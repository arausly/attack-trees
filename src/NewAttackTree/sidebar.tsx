import { NodeType } from "../typings";

const SideBar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="tree__editor-sidebar flex border flex-col p-7">
      <div className="flex flex-col mb-4 border-b-2 pb-2">
        <h3 className="font-medium text-lg">Goal Nodes</h3>
        <div
          className="box-border h-15 w-32 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.AND_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">And Node</p>
        </div>
        <div
          className="box-border h-15 w-32 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.OR_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">OR Node</p>
        </div>
      </div>
      <div className="flex flex-col mb-4 border-b-2 pb-2">
        <h3 className="font-medium text-lg">Sub Goal Nodes</h3>
        <div
          className="box-border h-15 w-32 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          draggable
          onDragStart={(event) => onDragStart(event, NodeType.AND_NODE)}
        >
          <p className="font-extralight text-sm cursor-grab">And Node</p>
        </div>
        <div
          className="box-border h-15 w-32 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.OR_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">OR Node</p>
        </div>
      </div>
      <div className="mb-4 border-b-2 pb-2">
        <div
          className="box-border h-15 w-32 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.LEAF_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">Leaf Node</p>
        </div>
      </div>
      <div>
        <div
          className="box-border h-15 w-32 p-2 border rounded mb-2 mt-2 shadow-sm bg-white"
          onDragStart={(event) => onDragStart(event, NodeType.DEFEND_NODE)}
          draggable
        >
          <p className="font-extralight text-sm cursor-grab">Defend Node</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
