import type { ContainerDirective, LeafDirective, TextDirective } from "mdast-util-directive";
import { setupDirectiveNode } from "./directive";
import { useRef, useEffect } from "react";
import { useScreenCapture } from "../../screen-capture/ScreenCaptureContext";

export const handleScreenCaptureNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
) => {
  if (node.name !== "screencapture") {
    return;
  }
  if (node.type !== "leafDirective") {
    return;
  }
  setupDirectiveNode(node);
};

export const ScreenCapture = () => {
  const { stream, isCapturing } = useScreenCapture();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-lg font-semibold mt-0 mb-3">Screen Capture</p>
      
      {isCapturing && stream ? (
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-auto max-h-96"
            style={{ maxWidth: '100%' }}
          />
        </div>
      ) : (
        <div className="bg-gray-200 rounded-lg p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📺</div>
          <p>No screen capture active</p>
          <p className="text-sm mt-1">Use the Screen Capture dialog in the editor to start capturing</p>
        </div>
      )}
    </div>
  );
};
