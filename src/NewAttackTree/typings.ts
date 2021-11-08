import { Edge, FlowElement, Node, XYPosition } from "react-flow-renderer";
import { NodeType } from "../typings";

export interface ElementsData {
  nodes: FlowElement<Node>[];
  edges: FlowElement<Edge>[];
}

export interface CreateNodeType {
  type: NodeType;
  pos: XYPosition;
  nodeId?: string;
  highlighted?: boolean;
  title?: string;
  description?: string;
  fileCount?: number;
  nodeWeight?: number;
}
