import { useMarkdownContext } from "../MarkdownContext";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import { setupDirectiveNode } from "./directive";

export const handleValueDisplayNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
) => {
  if (node.name !== "value") {
    return;
  }
  if (node.type !== "leafDirective" && node.type !== "textDirective") {
    return;
  }
  setupDirectiveNode(node);
};

export interface Props {
  name?: string;
}

/**
 * Component to display value
 */
export const ValueDisplay = (props: Props) => {
  const { name } = props;
  const { inputValues } = useMarkdownContext();

  if (!name) {
    return null;
  }

  const result = inputValues[name];
  return (<>{result}</>)
};
