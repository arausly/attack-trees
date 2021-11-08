import {
  Connection,
  Edge,
  Elements,
  FlowElement,
  isNode,
} from "react-flow-renderer";
import db from "./NewTree/db";
import { ElementsData } from "./NewTree/typings";
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
          nodeType: el.data.nodeType,
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
};

export default utils;
