import { useRef, useEffect } from "react";
import { useScreenCapture } from "./ScreenCaptureContext";

interface ScreenCaptureDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenCaptureDialog = ({ isOpen, onClose }: ScreenCaptureDialogProps) => {
  const { stream, isCapturing, error, startCapture, stopCapture } = useScreenCapture();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000000]">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Screen Capture</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            {!isCapturing ? (
              <button
                onClick={startCapture}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Start Screen Capture
              </button>
            ) : (
              <button
                onClick={stopCapture}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Stop Capture
              </button>
            )}
            
            {isCapturing && (
              <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Recording
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {isCapturing && stream ? (
              <div className="bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-lg font-medium mb-2">No Screen Capture Active</h3>
                <p className="text-sm">Click "Start Screen Capture" to begin capturing your screen</p>
                <p className="text-xs mt-2 text-gray-400">
                  The captured screen will be available in your presentation content
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          {isCapturing && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
              <p className="font-medium mb-1">Screen capture is active!</p>
              <p>Your screen is being captured and can be displayed in presentation content using the ::screencapture directive.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};