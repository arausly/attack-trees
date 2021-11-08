import {
  Connection,
  Edge,
  Elements,
  FlowElement,
  isEdge,
  isNode,
} from "react-flow-renderer";
import db from "./NewAttackTree/db";
import Tree, { TreeNode } from "./NewAttackTree/Tree";
import { ElementsData } from "./NewAttackTree/typings";
import { NodeType } from "./typings";

const ATTACK_COLLECTION = "AttackTree";
const FILE_COLLECTION = "NodeFiles";

let lastDigit = 0;
const newId = (elements: Elements) => {
  elements.forEach(
    (el) => isNode(el) && (lastDigit = Number(el.id.replace("node-", "")))
  );
  return `node-${++lastDigit}`;
};

const shortenWithEllipsis = (content: string = "", size: number = 40): string =>
  content?.length < size ? content : `${content.substring(0, size)}...`;

// update tree info
const save = async (elements: Elements, refId: string) => {
  const data: ElementsData = {
    nodes: [],
    edges: [],
  };
  elements.map((el) => {
    if (isNode(el)) {
      const elCopy: unknown = {
        ...el,
        data: {
          highlighted: el.data.highlighted,
          title: el.data.title,
          description: el.data.description,
          nodeType: el.data.nodeType,
          nodeWeight: el.data.nodeWeight,
        },
      };
      data.nodes.push(elCopy as FlowElement<any>);
    } else {
      data.edges.push(el);
    }
    return el;
  });

  return await db.client.query(
    db.q.Update(db.q.Ref(db.q.Collection(ATTACK_COLLECTION), refId), {
      data,
    })
  );
};

// get a single tree
const getTreeData = async (refId: string) => {
  return await db.client.query(
    db.q.Get(db.q.Ref(db.q.Collection(ATTACK_COLLECTION), refId))
  );
};

// list all trees
const getAllTrees = async () => {
  return await db.client.query(
    db.q.Map(
      db.q.Paginate(db.q.Documents(db.q.Collection(ATTACK_COLLECTION))),
      db.q.Lambda((Tree) => db.q.Get(Tree))
    )
  );
};

//list files
const getFiles = async (treeId: string) => {
  return await db.client.query(
    db.q.Paginate(db.q.Match(db.q.Index("treeId"), treeId))
  );
};

//create new tree
const createNewTree = async (title: string, description: string) => {
  const data = {
    title,
    description,
    nodes: [],
    edges: [],
  };
  return await db.client.query(
    db.q.Create(db.q.Collection(ATTACK_COLLECTION), {
      data,
    })
  );
};

const uploadFile = async (
  treeId: string,
  nodeTitle: string,
  nodeId: string,
  filename: string,
  files: FileList
) => {
  const data = new FormData();
  data.append("file", files[0]);
  data.append("public_id", `${treeId}/${filename}`);
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET!);
  try {
    //upload to cloudinary
    const response = await (
      await fetch(process.env.REACT_APP_CLOUDINARY_URL!, {
        method: "POST",
        body: data,
      })
    ).json();

    //upload to database
    await db.client.query(
      db.q.Create(db.q.Collection(FILE_COLLECTION), {
        data: {
          name: filename,
          treeId,
          nodeTitle,
          nodeId,
          url: response.url,
          format: response.format,
        },
      })
    );
  } catch (err) {}
};

/**
 *
 * in building tree ensure all nodes are connected, no loose nodes
 */
const getCheapestPath = (elements: FlowElement<Node | Edge>[]) => {
  const nodesAndEdges: { [key: string]: FlowElement<any> } = {};
  const tree = new Tree();

  elements.forEach((el) => {
    if (nodesAndEdges[el.id]) {
      nodesAndEdges[el.id] = el;
    }
  });

  elements.forEach((el) => {
    if (isEdge(el)) {
      // get source/parent node
      const parentEl = nodesAndEdges[el.source];
      const targetEl = nodesAndEdges[el.target];
      //check if exists else create node.
      if (!tree.root) {
        //safe bet that the first edge here is from the root node
        tree.root = new TreeNode(parentEl);
        tree.root.children.push(new TreeNode(targetEl));
      }
      //traverse tree
      tree.traverse((node) => {
        if (node.data.id === parentEl.id) {
          // add target node to children of parent
          node.addNewNode(targetEl);
        }
      });

      delete nodesAndEdges[el.source];
      delete nodesAndEdges[el.target];
    }
  });

  //tree has been built
  const hasUnattachedNodes = Object.values(nodesAndEdges).find((n) =>
    isNode(n)
  );
  // if nodes still exist in nodes and edges i.e there loose nodes still available and hence cannot make cannot get cheapest path
  if (hasUnattachedNodes) {
    console.error("Has loosely connected nodes, couldn't build tree");
    return;
  }

  return tree.getCheapestPath();
};

//check if new connection is with a defend node
const connectionWithDefendNode = (
  elements: FlowElement<any>[],
  params: Edge<any> | Connection
) =>
  elements.find(
    (el) =>
      isNode(el) &&
      (el.id === params.source || el.id === params.target) &&
      el.data.nodeType === NodeType.DEFEND_NODE
  );

const utils = {
  newId,
  save,
  getTreeData,
  getAllTrees,
  createNewTree,
  shortenWithEllipsis,
  uploadFile,
  getFiles,
  connectionWithDefendNode,
  getCheapestPath,
};

export default utils;
