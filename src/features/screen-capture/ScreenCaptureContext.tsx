import { createContext, useContext, useState, useCallback } from "react";

interface ScreenCaptureContextType {
  stream: MediaStream | null;
  isCapturing: boolean;
  error: string | null;
  startCapture: () => Promise<void>;
  stopCapture: () => void;
}

export const ScreenCaptureContext = createContext<ScreenCaptureContextType | null>(null);

export const useScreenCapture = () => {
  const context = useContext(ScreenCaptureContext);
  if (!context) {
    throw new Error("useScreenCapture must be used within a ScreenCaptureProvider");
  }
  return context;
};

interface ScreenCaptureProviderProps {
  children: React.ReactNode;
}

export const ScreenCaptureProvider = ({ children }: ScreenCaptureProviderProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCapture = useCallback(async () => {
    try {
      setError(null);
      
      // Check if the Screen Capture API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Screen Capture API is not supported in this browser");
      }

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1280,
          height: 720,
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCapturing(true);

      // Handle stream ending (user stops sharing)
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopCapture();
      });

    } catch (err) {
      console.error("Error starting screen capture:", err);
      setError(err instanceof Error ? err.message : "Failed to start screen capture");
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const value = {
    stream,
    isCapturing,
    error,
    startCapture,
    stopCapture,
  } satisfies ScreenCaptureContextType;

  return (
    <ScreenCaptureContext.Provider value={value}>
      {children}
    </ScreenCaptureContext.Provider>
  );
};