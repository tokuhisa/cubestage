import { createElement, Fragment, useEffect, useState, type JSX } from "react";
import rehypeReact from "rehype-react";
import { unified } from "unified";
import production from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkDirective from "remark-directive";
import { directiveHandler } from "./directives/directiveHandler";
import { MarkdownContextProvider } from "./MarkdownContext";
import { JavaScriptExecutor } from "./directives/JavaScriptExecutor";
import { TextInput } from "./directives/TextInput";
import { Button } from "./directives/Button";
import { ResultDisplay } from "./directives/ResultDisplay";

const components = {
  js: JavaScriptExecutor,
  textinput: TextInput,
  button: Button,
  resultdisplay: ResultDisplay,
};

export interface Props {
  text: string;
}

export const MarkdownView = (props: Props) => {
  const { text } = props;
  const [scenes, setScenes] = useState<JSX.Element[]>([]);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const update = async () => {
      // Split text by horizontal rules (---)
      const sceneTexts = text.split(/^---$/m).map(scene => scene.trim()).filter(scene => scene.length > 0);
      
      if (sceneTexts.length === 0) {
        setScenes([createElement(Fragment)]);
        return;
      }

      const processedScenes: JSX.Element[] = [];
      
      for (const sceneText of sceneTexts) {
        const processor = unified();
        processor.use(remarkParse);
        processor.use(remarkDirective);
        processor.use(directiveHandler);
        processor.use(remarkRehype);
        processor.use(rehypeReact, {
          ...production,
          components: components,
        });
        const file = await processor.process(sceneText);
        processedScenes.push(file.result as JSX.Element);
      }
      
      setScenes(processedScenes);
      setCurrentScene(0);
    };
    
    update().catch((err: unknown) => {
      console.error("Error processing markdown:", err);
    });
  }, [text]);

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const goToScene = (sceneIndex: number) => {
    if (sceneIndex >= 0 && sceneIndex < scenes.length) {
      setCurrentScene(sceneIndex);
    }
  };

  return (
    <MarkdownContextProvider>
      <div className="flex flex-col h-full w-full">
        {/* Scene content */}
        <div className="flex-1 overflow-auto">
          <article className="prose prose-slate max-w-none m-4">
            {scenes[currentScene] || createElement(Fragment)}
          </article>
        </div>
        
        {/* Navigation controls */}
        {scenes.length > 1 && (
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
                {currentScene + 1} / {scenes.length}
              </span>
              <div className="flex gap-1">
                {scenes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToScene(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentScene ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={`シーン ${index + 1} に移動`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={nextScene}
              disabled={currentScene === scenes.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              次のシーン
            </button>
          </div>
        )}
      </div>
    </MarkdownContextProvider>
  );
};