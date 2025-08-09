import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import { h } from "hastscript";

export const setupDirectiveNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
) => {
  const data = node.data ?? (node.data = {});
  const hast = h(node.name, node.attributes ?? {});
  data.hName = hast.tagName;
  data.hProperties = hast.properties;
};
