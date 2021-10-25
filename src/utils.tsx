import { Elements, FlowElement, isNode } from "react-flow-renderer";
import db from "./NewTree/db";
import { ElementsData } from "./NewTree/typings";

const COLLECTION_NAME = "AttackTree";

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
    db.q.Update(db.q.Ref(db.q.Collection(COLLECTION_NAME), refId), {
      data,
    })
  );
};

// get a single tree
const getTreeData = async (refId: string) => {
  return await db.client.query(
    db.q.Get(db.q.Ref(db.q.Collection(COLLECTION_NAME), refId))
  );
};

// list all trees
const getAllTrees = async () => {
  return await db.client.query(
    db.q.Map(
      db.q.Paginate(db.q.Documents(db.q.Collection(COLLECTION_NAME))),
      db.q.Lambda((Tree) => db.q.Get(Tree))
    )
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
    db.q.Create(db.q.Collection(COLLECTION_NAME), {
      data,
    })
  );
};

const utils = {
  newId,
  save,
  getTreeData,
  getAllTrees,
  createNewTree,
  shortenWithEllipsis,
};

export default utils;
