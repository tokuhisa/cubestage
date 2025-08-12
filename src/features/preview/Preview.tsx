import { useEffect, useState } from "react";
import { MarkdownView } from "../markdown/MarkdownView";
import { Stage } from "../stage/Stage";

export interface Props {
  text: string;
  previewMode: "2d" | "3d";
}

export const Preview = (props: Props) => {
  const { text, previewMode } = props;
  const [contents, setContents] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const update = async () => {
      // Split text by horizontal rules (---)
      const sceneTexts = text
        .split(/^---$/m)
        .map((scene) => scene.trim())
        .filter((scene) => scene.length > 0);

      if (sceneTexts.length === 0) {
        setContents([""]);
        return;
      }

      setContents(sceneTexts);
      setCurrentScene(0);
    };

    update().catch((err: unknown) => {
      console.error("Error processing markdown:", err);
    });
  }, [text]);

  const nextScene = () => {
    if (currentScene < contents.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const goToScene = (sceneIndex: number) => {
    if (sceneIndex >= 0 && sceneIndex < contents.length) {
      setCurrentScene(sceneIndex);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Scene content */}
      {previewMode === "2d" ? (
        <MarkdownView text={contents[currentScene] ?? ""} />
      ) : (
        <Stage>
          <MarkdownView text={contents[currentScene] ?? ""} />
        </Stage>
      )}

      {/* Navigation controls */}
      {contents.length > 1 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
          <button
            onClick={prevScene}
            disabled={currentScene === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            前のシーン
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {currentScene + 1} / {contents.length}
            </span>
            <div className="flex gap-1">
              {contents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToScene(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentScene
                      ? "bg-blue-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  title={`シーン ${index + 1} に移動`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextScene}
            disabled={currentScene === contents.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            次のシーン
          </button>
        </div>
      )}
    </div>
  );
};
