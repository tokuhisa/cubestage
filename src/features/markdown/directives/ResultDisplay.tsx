import { useMarkdownContext } from "../MarkdownContext";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import { setupDirectiveNode } from "./directive";

export const handleResultDisplayNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
) => {
  if (node.name !== "resultdisplay") {
    return;
  }
  if (node.type !== "leafDirective") {
    return;
  }
  setupDirectiveNode(node);
};

export interface Props {
  resultId?: string;
  children?: React.ReactNode;
}

/**
 * Component to display JavaScript execution results
 */
export const ResultDisplay = (props: Props) => {
  const { resultId, children } = props;
  const { executionResults } = useMarkdownContext();

  if (!resultId) {
    return null;
  }

  const result = executionResults[resultId];
  
  if (!result) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 my-4 bg-gray-50">
        <p className="text-gray-500 text-sm">
          {children ?? 'No results yet. Click a button to execute code.'}
        </p>
      </div>
    );
  }

  const typedResult = result as {
    value?: unknown;
    error?: string;
    logs?: string[];
    display?: string;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 my-4 bg-white">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">実行結果</h4>
      
      {typedResult.error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          <strong>エラー:</strong> {typedResult.error}
        </div>
      ) : (
        <>
          {typedResult.display && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded text-sm mb-3">
              <strong>結果:</strong> {typedResult.display}
            </div>
          )}
          
          {typedResult.logs && typedResult.logs.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded text-sm">
              <strong>ログ:</strong>
              <div className="mt-1">
                {typedResult.logs.map((log) => (
                  <div key={log} className="font-mono text-xs">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};