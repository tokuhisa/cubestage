import { useEffect, useState, type JSX } from "react";
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
import { ValueDisplay } from "./directives/ValueDisplay";

const components = {
  js: JavaScriptExecutor,
  textinput: TextInput,
  button: Button,
  value: ValueDisplay,
};

export interface Props {
  text: string;
}

export const MarkdownView = (props: Props) => {
  const { text } = props;
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const update = async () => {
      const processor = unified();
      processor.use(remarkParse);
      processor.use(remarkDirective);
      processor.use(directiveHandler);
      processor.use(remarkRehype);
      processor.use(rehypeReact, {
        ...production,
        components: components,
      });
      const file = await processor.process(text);
      setContent(file.result as JSX.Element);
    };

    update().catch((err: unknown) => {
      console.error("Error processing markdown:", err);
    });
  }, [text]);

  return (
    <MarkdownContextProvider>
      <div className="flex flex-col h-full w-full overflow-auto">
        <article className="prose prose-slate max-w-none m-4">
          {content}
        </article>
      </div>
    </MarkdownContextProvider>
  );
};
