import * as THREE from "three";
import { useEffect, useState } from "react";

interface CameraInfo {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
}

const DEFAULT_CAMERA_INFO: CameraInfo = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  fov: NaN,
};

interface Props {
  showCameraInfo: boolean;
  camera?: THREE.Camera;
}

export const DebugOverlay = ({ showCameraInfo, camera }: Props) => {
  const [cameraInfo, setCameraInfo] = useState<CameraInfo>(DEFAULT_CAMERA_INFO);

  useEffect(() => {
    if (!showCameraInfo || !camera) {
      setCameraInfo(DEFAULT_CAMERA_INFO);
      return;
    }
    const intervalId = setInterval(() => {
      if (camera) {
        setCameraInfo({
          position: [
            camera.position.x,
            camera.position.y,
            camera.position.z,
          ],
          rotation: [
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z,
          ],
          fov: camera instanceof THREE.PerspectiveCamera ? camera.fov : NaN,
        });
      }
    }, 500); // Update every ~500ms (2fps)

    return () => clearInterval(intervalId);
  }, [camera]);

  if (!showCameraInfo) {
    return null;
  }

  return (
    <div className="absolute top-2 left-2 bg-black text-white p-3 rounded font-mono text-sm space-y-1 z-[10000000]">
      {showCameraInfo && (
        <>
          <div>[Camera]</div>
          <div>
            Position: ({cameraInfo?.position[0].toFixed(2)},{" "}
            {cameraInfo?.position[1].toFixed(2)}, {cameraInfo?.position[2].toFixed(2)})
          </div>
          <div>
            Rotation: ({cameraInfo?.rotation[0].toFixed(2)},{" "}
            {cameraInfo?.rotation[1].toFixed(2)}, {cameraInfo?.rotation[2].toFixed(2)})
          </div>
          <div>FOV: {cameraInfo?.fov.toFixed(0)}°</div>
        </>
      )}
    </div>
  );
};
