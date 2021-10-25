import { Edge, FlowElement, Node } from "react-flow-renderer";

export interface ElementsData {
  nodes: FlowElement<Node>[];
  edges: FlowElement<Edge>[];
}
