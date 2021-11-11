import { FlowElement } from "react-flow-renderer";

interface FullPath {
  [counter: string]: {
    path: TreeNode[];
    weightSum: number;
  };
}

export class TreeNode {
  constructor(
    public data: FlowElement<any>,
    public children: TreeNode[] = [],
    public parent: TreeNode | null
  ) {}

  addNewNode = (node: FlowElement<any>) => {
    const newNode = new TreeNode(node, [], this);
    this.children.push(newNode);
  };

  getAncestors = (cb: (weight: number | undefined) => void) => {
    const ancestors = [];
    let parent = this.parent;
    while (parent) {
      ancestors.push(parent);
      cb(parent.data.data?.nodeWeight);
      parent = parent.parent;
    }
    return ancestors;
  };
}

class Tree {
  constructor(public root: TreeNode | null = null) {}

  //breadth first traversal
  traverse = (cb: (node: TreeNode) => void) => {
    if (!this.root) return;
    const queue: TreeNode[] = [this.root];

    while (queue.length) {
      const next = queue.shift();
      cb(next!);

      queue.push(...next!.children);
    }
  };

  //depth first
  getCheapestPath = (): FullPath[""] | undefined => {
    if (!this.root) return;

    const validPath: FullPath = {};
    let counter = 0;
    const stack = [this.root];

    while (stack.length) {
      const next = stack.pop();
      if (next!.children.length) {
        stack.push(...next!.children);
      } else {
        //is a leaf node
        let weightSum = next!.data.data.nodeWeight;
        validPath[`${counter}`] = {
          path: [
            ...next!.getAncestors((weight) => (weightSum += weight ?? 0)),
            next!,
          ],
          weightSum,
        };

        ++counter;
      }
    }

    return Object.entries(validPath).reduce(
      (cheapestPath: FullPath[""], entry) => {
        const [, { path, weightSum }] = entry;
        if (weightSum < cheapestPath.weightSum) {
          cheapestPath.path = path;
          cheapestPath.weightSum = weightSum;
        }
        return cheapestPath;
      },
      {
        path: [],
        weightSum: Infinity,
      }
    );
  };
}
export default Tree;
