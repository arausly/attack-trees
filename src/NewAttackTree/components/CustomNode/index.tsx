import React from "react";
import { NodeProps, Handle, Position } from "react-flow-renderer";
import { NodeType } from "../../../typings";

//style
import "./index.css";

export interface NodeContentProps {
  title: string;
  description: string;
  highlighted: boolean;
  nodeType: NodeType;
  MenuButtons: React.FC<{ close: () => void; node: CustomNodeProps }>;
  fileCount?: number;
  nodeWeight?: number;
  focusState?: "match" | "warning";
}

export interface CustomNodeProps extends NodeProps {
  data: NodeContentProps;
}

const CustomNode = React.memo((node: CustomNodeProps) => {
  const {
    selected,
    data: {
      highlighted,
      MenuButtons,
      nodeType,
      title,
      description,
      fileCount,
      nodeWeight,
      focusState,
    },
  } = node;
  const [showMenu, toggleMenu] = React.useState<boolean>(false);

  const handleStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "0px",
    backgroundColor:
      nodeType === NodeType.DEFEND_NODE
        ? "rgba(220, 38, 38)"
        : !highlighted
        ? "#000"
        : "rgb(139, 92, 246)",
  };

  let handles: any[] = [
    { type: "target", position: Position.Top, id: "a", style: handleStyle },
    {
      type: "source",
      position: Position.Bottom,
      id: "b",
      style: {
        ...handleStyle,
        left: nodeType === NodeType.AND_NODE ? "40%" : "50%",
      },
    },
  ];

  if (nodeType === NodeType.AND_NODE && handles.length === 2) {
    handles.push({
      type: "source",
      position: Position.Bottom,
      id: "c",
      style: { ...handleStyle, left: "60%" },
    });
  }

  if (nodeType === NodeType.LEAF_NODE) {
    handles = [
      { type: "target", position: Position.Top, id: "a", style: handleStyle },
    ];
  }

  const activeNodeClass = selected ? "border-gray-500" : "";
  const defendNodeClass =
    nodeType === NodeType.DEFEND_NODE ? "border-8 border-red-600" : "";
  const focusClass = focusState ? "border-1 border-blue-500 rounded" : "";

  return (
    <div
      className={`node flex w-72 bg-white flex-col ${activeNodeClass}  ${
        highlighted
          ? "border-solid border-2 border-purple-500 rounded"
          : "border"
      } ${defendNodeClass} ${focusClass}`}
      style={{
        borderWidth: focusState ? "8px" : "2px",
      }}
    >
      <div className="node__header flex-initial border">
        <div className="flex justify-between items-center p-2">
          <h5>{title}</h5>
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => {
                toggleMenu((m) => !m);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            {showMenu ? (
              <MenuButtons close={() => toggleMenu(false)} node={node} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="node__body flex flex-1 p-4 justify-around">
        {nodeWeight ? (
          <span className="flex mr-2 h-10 w-10 items-center justify-center px-2 py-0.5 text-lg font-bold leading-none text-red-100 transform bg-yellow-900 rounded-full">
            {nodeWeight}
          </span>
        ) : null}
        <div className="flex">
          <p>{description}</p>
        </div>
        {fileCount ? (
          <div className="flex-initial">
            <span className="relative inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <span className="absolute -top-0.5 -right-2.5 px-2 py-1 text-xs font-bold leading-none text-red-100 transform bg-red-600 rounded-full">
                {fileCount}
              </span>
            </span>
          </div>
        ) : null}
      </div>
      {nodeType === NodeType.AND_NODE && (
        <div
          className="and-identifier"
          style={{
            backgroundColor: !highlighted ? "#000" : "rgb(139, 92, 246)",
          }}
        />
      )}
      {handles.map(({ style, ...h }, i) => (
        <Handle key={`${h.id}-${i}`} {...h} style={style} />
      ))}
    </div>
  );
});

export default CustomNode;
