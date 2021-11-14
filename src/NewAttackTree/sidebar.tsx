import React from "react";
import { NodeType } from "../typings";

enum NODE_CATEGORIES {
  goal,
  subGoal,
}

const SideBar = () => {
  const [categoryVisible, setCategoryVisibility] = React.useState<
    NODE_CATEGORIES[]
  >([NODE_CATEGORIES.goal]);

  const shouldBeVisible = (category: NODE_CATEGORIES) =>
    categoryVisible.includes(category);

  const toggleVisibility = (category: NODE_CATEGORIES) =>
    setCategoryVisibility((cat) =>
      cat.includes(category)
        ? cat.filter((c) => c !== category)
        : [...cat, category]
    );

  const goalVisible = shouldBeVisible(NODE_CATEGORIES.goal);
  const subGoalVisible = shouldBeVisible(NODE_CATEGORIES.subGoal);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="tree__editor-sidebar flex border flex-col p-8">
      <div className="flex flex-col mb-4 border-b-2 pb-2">
        <div
          className="flex items-center __cursor"
          onClick={() => toggleVisibility(NODE_CATEGORIES.goal)}
        >
          {!goalVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}

          <h3 className="font-medium text-lg">Goal</h3>
        </div>
        {goalVisible ? (
          <>
            <div
              className="box-border h-15 w-34 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
              onDragStart={(event) => onDragStart(event, NodeType.AND_NODE)}
              draggable
            >
              <p className="font-extralight text-sm cursor-grab">
                Conjunctive refinement
              </p>
            </div>
            <div
              className="box-border h-15 w-34 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
              onDragStart={(event) => onDragStart(event, NodeType.OR_NODE)}
              draggable
            >
              <p className="font-extralight text-sm cursor-grab">
                Disjunctive refinement
              </p>
            </div>
          </>
        ) : null}
      </div>
      <div className="flex flex-col mb-4 border-b-2 pb-2">
        <div
          className="flex items-center __cursor"
          onClick={() => toggleVisibility(NODE_CATEGORIES.subGoal)}
        >
          {!subGoalVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <h3 className="font-medium text-lg">Sub Goal</h3>
        </div>
        {subGoalVisible ? (
          <>
            <div
              className="box-border h-15 w-34 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
              onDragStart={(event) => onDragStart(event, NodeType.AND_NODE)}
              draggable
            >
              <p className="font-extralight text-sm cursor-grab">
                Conjunctive refinement
              </p>
            </div>
            <div
              className="box-border h-15 w-34 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
              onDragStart={(event) => onDragStart(event, NodeType.OR_NODE)}
              draggable
            >
              <p className="font-extralight text-sm cursor-grab">
                Disjunctive refinement
              </p>
            </div>
          </>
        ) : null}
      </div>
      <div className="mb-4 border-b-2 pb-2">
        <h3 className="font-medium text-lg">Leaf Nodes</h3>
        <div
          className="box-border h-15 w-34 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.LEAF_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">Leaf Node</p>
        </div>
      </div>
      <div>
        <h3 className="font-medium text-lg">Defense Nodes</h3>
        <div
          className="box-border h-15 w-34 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.DEFEND_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">Defense Node</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
