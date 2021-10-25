import React from "react";
import { NodeProps, Handle, Position } from "react-flow-renderer";
import { NodeType } from "../../../typings";

//style
import "./index.css";

interface NodeContentProps {
  title: string;
  highlighted: boolean;
  nodeType: NodeType;
  MenuButtons: React.FC<{ close: () => void }>;
}

interface CustomNodeProps extends NodeProps {
  data: NodeContentProps;
}

const CustomNode = React.memo((node: CustomNodeProps) => {
  const {
    selected,
    data: { highlighted, MenuButtons, nodeType, title },
  } = node;
  const [showMenu, toggleMenu] = React.useState<boolean>(false);

  const handleStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "0px",
    backgroundColor: !highlighted ? "#000" : "rgb(139, 92, 246)",
  };

  const handles: any[] = [
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

  const activeNodeClass = selected ? "border-gray-500" : "";

  return (
    <div
      className={`node flex w-72 bg-white flex-col ${activeNodeClass} ${
        highlighted ? "border-solid border-2 border-purple-500" : "border"
      } `}
    >
      <div className="node__header flex-initial border">
        <div className="flex justify-between items-center p-2">
          <h5>{nodeType}</h5>
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
            {showMenu ? <MenuButtons close={() => toggleMenu(false)} /> : null}
          </div>
        </div>
      </div>
      <div className="node__body flex-1 p-4">
        <p>{title}</p>
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
