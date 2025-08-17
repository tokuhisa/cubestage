import { Editor } from "./features/editor/Editor";
import { ScreenCaptureProvider } from "./features/screen-capture/ScreenCaptureContext";

function App() {

  return (
    <ScreenCaptureProvider>
      <Editor />
    </ScreenCaptureProvider>
  );
}

export default App;
