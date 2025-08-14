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

const modelUrl = "/AliciaSolid_vrm-0.51.vrm";
const animationUrl = "/VRMA_01.vrma";

const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));
loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

export const Avatar = () => {
  const [vrmModel, setVrmModel] = useState<VRM | null>(null);
  const [vrmAnimation, setVrmAnimation] = useState<VRMAnimation | null>(null);

  useEffect(() => {
    if (vrmModel !== null) {
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
  }, [vrmModel]);

  useEffect(() => {
    if (vrmAnimation !== null) {
      return;
    }

    loader.load(animationUrl, (gltf) => {
      const vrmAnimations: VRMAnimation[] = gltf.userData.vrmAnimations;
      console.log("VRM animation loaded:", vrmAnimations);
      setVrmAnimation(vrmAnimations[0]);
    });
  }, [vrmAnimation]);

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

  return (
    <>{vrmModel !== null ? <primitive object={vrmModel.scene} /> : null}</>
  );
};
