import { FlowElement, Node } from "react-flow-renderer";

export class TreeNode {
  constructor(
    public data: FlowElement<Node>,
    public children: TreeNode[] = []
  ) {}

  addNewNode = (node: FlowElement<Node>) => {
    const newNode = new TreeNode(node);
    this.children.push(newNode);
  };
}

class Tree {
  constructor(public root: TreeNode | null = null) {}

  traverse = (cb: (node: TreeNode) => void) => {
    if (!this.root) return;
    const queue: TreeNode[] = [this.root];

    while (queue.length) {
      const next = queue.shift();
      cb(next!);

      queue.push(...next!.children);
    }
  };

  getCheapestPath = () => {
    if (!this.root) return;
  };
}
export default Tree;
