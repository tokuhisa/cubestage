import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useEffect, useState } from "react";
import {
  createVRMAnimationClip,
  VRMAnimation,
  VRMAnimationLoaderPlugin,
  VRMLookAtQuaternionProxy,
} from "@pixiv/three-vrm-animation";


const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));
loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

export const Avatar = () => {
  const [vrmModel, setVrmModel] = useState<VRM | null>(null);
  const [vrmAnimation, setVrmAnimation] = useState<VRMAnimation | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [animationUrl, setAnimationUrl] = useState<string | null>(null);

  // OPFSからファイルを読み込んでURLを生成する関数
  const loadFromOPFS = async () => {
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      
      // VRMファイルを読み込み
      try {
        const vrmFileHandle = await opfsRoot.getFileHandle('avatar.vrm');
        const vrmFile = await vrmFileHandle.getFile();
        const vrmObjectURL = URL.createObjectURL(vrmFile);
        setModelUrl(vrmObjectURL);
      } catch {
        // ファイルが存在しない場合はnullに設定
        setModelUrl(null);
      }
      
      // VRMAファイルを読み込み
      try {
        const vrmaFileHandle = await opfsRoot.getFileHandle('avatar.vrma');
        const vrmaFile = await vrmaFileHandle.getFile();
        const vrmaObjectURL = URL.createObjectURL(vrmaFile);
        setAnimationUrl(vrmaObjectURL);
      } catch {
        // ファイルが存在しない場合はnullに設定
        setAnimationUrl(null);
      }
    } catch (error) {
      console.error('Failed to load files from OPFS:', error);
      // エラーの場合はnullに設定
      setModelUrl(null);
      setAnimationUrl(null);
    }
  };

  // 初回読み込み時とファイル更新時にOPFSから読み込み
  useEffect(() => {
    loadFromOPFS();

    // ファイル更新イベントのリスナーを追加
    const handleAvatarFilesUpdate = () => {
      // 既存のモデルとアニメーションをリセット
      setVrmModel(null);
      setVrmAnimation(null);
      // OPFSから再読み込み
      loadFromOPFS();
    };

    window.addEventListener('avatar-files-updated', handleAvatarFilesUpdate);
    return () => {
      window.removeEventListener('avatar-files-updated', handleAvatarFilesUpdate);
    };
  }, []);

  useEffect(() => {
    if (vrmModel !== null || !modelUrl) {
      return;
    }

    loader.load(modelUrl, (gltf) => {
      const vrm: VRM = gltf.userData.vrm;
      console.log("VRM model loaded:", vrm);

      // calling these functions greatly improves the performance
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      VRMUtils.combineSkeletons(gltf.scene);
      VRMUtils.combineMorphs(vrm);

      // Disable frustum culling
      vrm.scene.traverse((obj) => {
        obj.frustumCulled = false;
      });

      if (vrm.lookAt) {
        const proxy = new VRMLookAtQuaternionProxy(vrm.lookAt);
        proxy.name = 'VRMLookAtQuaternionProxy';
        vrm.scene.add(proxy);
      }

      setVrmModel(vrm);
    });
  }, [vrmModel, modelUrl]);

  useEffect(() => {
    if (vrmAnimation !== null || !animationUrl) {
      return;
    }

    loader.load(animationUrl, (gltf) => {
      const vrmAnimations: VRMAnimation[] = gltf.userData.vrmAnimations;
      console.log("VRM animation loaded:", vrmAnimations);
      setVrmAnimation(vrmAnimations[0]);
    });
  }, [vrmAnimation, animationUrl]);

  useEffect(() => {
    if (vrmModel === null || vrmAnimation === null) {
      return;
    }
    const mixer = new THREE.AnimationMixer(vrmModel.scene);
    const clip = createVRMAnimationClip(vrmAnimation, vrmModel);
    mixer.clipAction(clip).play();

    // clockの準備
    const clock = new THREE.Clock();
    clock.start();

    let isRunning = true;

    // フレーム毎に呼ばれる
    const update = () => {
      if (!isRunning) {
        return;
      }
      requestAnimationFrame(update);

      const deltaTime = clock.getDelta();
      mixer.update(deltaTime);
      vrmModel.update(deltaTime);
    };
    update();
    return () => {
      isRunning = false;
    }
  }, [vrmModel, vrmAnimation]);

  // OPFSにファイルが存在しない場合は何も表示しない
  if (!modelUrl || !animationUrl || !vrmModel) {
    return null;
  }

  return <primitive object={vrmModel.scene} />;
};
