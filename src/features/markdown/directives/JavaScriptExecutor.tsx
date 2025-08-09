import { useState, useEffect } from "react";
import { getQuickJS } from "quickjs-emscripten";
import { useMarkdownContext } from "../MarkdownContext";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import {VFile} from 'vfile'
import { setupDirectiveNode } from "./directive";

/**
 * Safely convert unknown value to string for display
 */
const safeStringify = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  return JSON.stringify(value);
};

export const handleJavascriptExecutorNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
  file: VFile
) => {
  if (node.name !== "js") {
    return;
  }
  if (node.type !== "containerDirective") {
    return;
  }
  setupDirectiveNode(node);

  const data = node.data ?? (node.data = {});
  const text = file.value.toString();
  const lines = text.split("\n");
  const startLine = node.position?.start.line ?? 0;
  const endLine = node.position?.end.line ?? lines.length;

  const codeContent = lines.slice(startLine, endLine - 1).join("\n").trim();
  data.hProperties = { ...data.hProperties, codeContent };
  node.children = [];

  return;
};


export interface Props {
  children?: React.ReactNode;
  codeContent?: string;
  eventId?: string; // ID to trigger execution
  resultId?: string;
}

/**
 * Component that executes JavaScript code using QuickJS in a sandboxed environment
 */
export const JavaScriptExecutor = (props: Props) => {
  const [executionLog, setExecutionLog ] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showCode, setShowCode] = useState(false);
  const {
    inputValues,
    executionTriggers,
    setExecutionResult,
  } = useMarkdownContext();
  const { codeContent, resultId, eventId } = props;
  const eventTimestamp = executionTriggers[eventId ?? ""]?.timestamp ?? null;

  const executeCode = async () => {
    setIsLoading(true);
    setError("");
    setExecutionLog("");
    const code = codeContent ?? "";

    try {
      const QuickJS = await getQuickJS();
      const vm = QuickJS.newContext();

      // Create inputs object with all input values
      const inputsObject = vm.newObject();
      for (const [key, value] of Object.entries(inputValues)) {
        vm.setProp(inputsObject, key, vm.newString(value));
      }
      vm.setProp(vm.global, "inputs", inputsObject);

      // Add console.log implementation
      const logMessages: string[] = [];
      const logHandle = vm.newFunction("log", (...args) => {
        const nativeArgs = args.map((arg) => {
          const dumped = vm.dump(arg) as unknown;
          return typeof dumped === "string" ? dumped : String(dumped);
        });
        const message = nativeArgs.join(" ");
        logMessages.push(message);
        setExecutionLog((prev) => prev + message + "\n");
      });
      const consoleHandle = vm.newObject();
      vm.setProp(consoleHandle, "log", logHandle);
      vm.setProp(vm.global, "console", consoleHandle);

      // Execute the code
      const evalResult = vm.evalCode(code);

      let executionResult: unknown;
      if (evalResult.error) {
        const errorMsg = vm.dump(evalResult.error) as unknown;
        const errorString =
          typeof errorMsg === "string" ? errorMsg : String(errorMsg);
        setError(`Error: ${errorString}`);
        executionResult = { error: errorString, logs: logMessages };
        evalResult.error.dispose();
      } else {
        const output = vm.dump(evalResult.value) as unknown;
        if (output !== undefined && output !== null) {
          const outputString = safeStringify(output);
          setExecutionLog((prev) => prev + `Return value: ${outputString}\n`);
          executionResult = {
            value: output,
            logs: logMessages,
            display: outputString,
          };
        } else {
          executionResult = { logs: logMessages };
        }
        evalResult.value.dispose();
      }

      // Store result in context if resultId is provided
      if (resultId) {
        setExecutionResult(resultId, executionResult);
      }

      // Cleanup
      inputsObject.dispose();
      consoleHandle.dispose();
      logHandle.dispose();
      vm.dispose();
    } catch (err) {
      const errorString = err instanceof Error ? err.message : String(err);
      const errorMessage = `Execution error: ${errorString}`;
      setError(errorMessage);
      if (resultId) {
        setExecutionResult(resultId, { error: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for execution triggers from buttons
  useEffect(() => {
    console.log("JavaScriptExecutor: eventTimestamp changed", eventTimestamp);
    if (eventTimestamp) {
      executeCode();
    }
  }, [eventTimestamp]);


  return (
    <div className="border border-gray-300 rounded-lg p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700">
          JavaScript Execution
          {resultId && (
            <span className="ml-2 text-xs text-gray-500">
              (ID: {props.resultId})
            </span>
          )}
        </h4>
        <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              {showCode ? "コードを隠す" : "コードを表示"}
            </button>
            <button
              type="button"
              onClick={() => executeCode()}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              コードを実行
            </button>
          {isLoading && (
            <span className="text-sm text-blue-600">実行中...</span>
          )}
        </div>
      </div>

      {showCode && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">JavaScript Code:</div>
          <pre className="bg-gray-100 border p-3 rounded text-sm overflow-x-auto">
            <code className="text-gray-900">{codeContent}</code>
          </pre>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-2">
          {error}
        </div>
      )}

      {executionLog && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
          <strong>Output:</strong>
          <pre className="mt-1 whitespace-pre-wrap">{executionLog}</pre>
        </div>
      )}
    </div>
  );
};
