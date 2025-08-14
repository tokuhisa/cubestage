import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { VRMAnimationLoaderPlugin } from "@pixiv/three-vrm-animation";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export const vrmLoader = new GLTFLoader();
vrmLoader.register((parser) => new VRMLoaderPlugin(parser));
vrmLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));
