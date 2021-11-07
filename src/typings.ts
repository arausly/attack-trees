import { Edge, FlowElement } from "react-flow-renderer";

export interface Tree {
  data: {
    title: string;
    description: string;
    nodes: FlowElement<Node>[];
    edges: FlowElement<Edge>[];
  };
  ref: {
    value: {
      id: string;
    };
  };
}

export enum NodeType {
  AND_NODE = "AND",
  OR_NODE = "OR",
  LEAF_NODE = "LEAF",
  DEFEND_NODE = "DEFEND",
}

//File
export interface FileType {
  name: string;
  treeId: string;
  nodeId: string;
  nodeTitle: string;
  url: string;
  format: string;
}
