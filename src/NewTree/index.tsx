import React from "react";
import ReactFlow, {
  Elements,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  XYPosition,
  removeElements,
  isNode,
  addEdge,
  Connection,
  Edge,
  isEdge,
  useUpdateNodeInternals,
  ReactFlowProvider,
  Node,
} from "react-flow-renderer";
import { ElementsData } from "./typings";
import customNode, { CustomNodeProps } from "./components/CustomNode";
import Modal from "../components/modal";
import utils from "../utils";
import { useHistory, useParams } from "react-router";
import { FileType, NodeType } from "../typings";
import SideBar from "./sidebar";

const nodeTypes = {
  customNode,
};

const NewTree: React.FC<{}> = () => {
  const reactFlowWrapper = React.useRef<any>(null);
  const [elements, setElements] = React.useState<Elements>([]);
  const [hasUnsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [editNameModal, toggleEditNameModal] = React.useState<any>(new Map());
  const [showFileUploader, toggleFileUploader] = React.useState<boolean>(false);
  const updateNodeInternals = useUpdateNodeInternals();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [filename, setFilename] = React.useState<string>("");
  const [, setFileUploadLoading] = React.useState<boolean>(false);
  const [activeNode, setActiveNode] = React.useState<{
    nodeId?: string;
    nodeTitle?: string;
  }>({});
  const [files, setFiles] = React.useState<FileType[]>([]);

  React.useEffect(() => {
    utils.getFiles(id).then((res: any) => {
      const data: any[] = res?.data;
      if (data?.length) {
        setFiles(() =>
          data.map(([name, nodeId, treeId, nodeTitle, url, format]) => ({
            name,
            nodeId,
            treeId,
            nodeTitle,
            url,
            format,
          }))
        );
      }
    });
  }, [id]);

  // initial loading
  React.useEffect(() => {
    utils
      .getTreeData(id)
      .then((res: any) => {
        const data: ElementsData = res?.data;
        if (data) {
          const nodes = data.nodes.map((el: any) =>
            createNode(
              el.data.nodeType,
              el.position,
              el.id,
              el.data.highlighted,
              el.data.title
            )
          );
          setElements(() => [...nodes, ...data.edges]);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    const nodeType = event.dataTransfer.getData(
      "application/reactflow"
    ) as NodeType;

    const newNode = createNode(
      nodeType,
      {
        x: event.clientX - (reactFlowBounds.left + 50 / 2),
        y: event.clientY - (reactFlowBounds.top + 45 / 2),
      },
      undefined,
      false,
      undefined
    );

    console.log({ newNode });
    setElements((els) => [...els, newNode]);
    setUnsavedChanges(true);
  };

  const switchNodeType = (id: string) => {
    setElements((els) => {
      const nodeWithRemovedEdges = els.filter(
        (el) => (isEdge(el) && el.source !== id) || isNode(el)
      );
      return nodeWithRemovedEdges.map((el) => {
        if (el.id === id) {
          el.data = {
            ...el.data,
            nodeType:
              el.data.nodeType === NodeType.AND_NODE
                ? NodeType.OR_NODE
                : NodeType.AND_NODE,
          };
        }
        return el;
      });
    });
    setTimeout(() => updateNodeInternals(id), 50);
    setUnsavedChanges(true);
  };

  const toggleHighlighting = React.useCallback((nodeId: string) => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === nodeId) {
          el.data = {
            ...el.data,
            highlighted: !el.data.highlighted,
          };
        }
        return el;
      })
    );
    setUnsavedChanges(true);
  }, []);

  const handleDeleteNode = React.useCallback((nodeId: string) => {
    setElements((els) => {
      const node = els.find((n) => isNode(n) && n.id === nodeId);
      return node ? removeElements([node], els) : els;
    });
    setUnsavedChanges(true);
  }, []);

  const handleNodeLabelChange = () => {
    if (!editNameModal?.size) return;
    const modal = editNameModal?.get(true);
    if (modal) {
      const { id, title } = modal;
      if (!title?.length) return;
      setElements((els) =>
        els.map((el) => {
          if (el.id === id) {
            el.data = {
              ...el.data,
              title,
            };
          }
          return el;
        })
      );
    }
    toggleEditNameModal(new Map());
    setUnsavedChanges(true);
  };

  const handleFileUpload = () => {};

  const onConnect = React.useCallback((params: Edge<any> | Connection) => {
    setElements((els) => addEdge(params, els));
    setUnsavedChanges(true);
  }, []);

  const handleNodeDragStop = React.useCallback(
    (event: React.MouseEvent<Element, MouseEvent>, draggedElement: Node) => {
      setElements((els) =>
        els.map((el) => {
          if (isNode(el) && el.id === draggedElement.id) {
            (el as Node).position = draggedElement.position;
          }
          return el;
        })
      );
      setUnsavedChanges(true);
    },
    []
  );

  const handleSave = async () => {
    const data = await utils.save(elements, id);
    console.log({ data });
    setUnsavedChanges(false);
  };

  const MenuButtons: React.FC<{ close: () => void; node: CustomNodeProps }> = ({
    close,
    node,
  }) => (
    <div
      className="origin-top-right z-10 absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      <div className="py-1" role="none">
        <button
          type="submit"
          className="text-gray-700 flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-3"
          onClick={() => {
            close();
            const update = new Map([[true, { id: node.id }]]);
            toggleEditNameModal(update);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <p>Rename</p>
        </button>
        {(node.data.nodeType !== NodeType.DEFEND_NODE && (
          <button
            type="submit"
            className="text-gray-700 flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-3"
            onClick={() => {
              close();
              toggleHighlighting(node.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>Highlight</p>
          </button>
        )) ||
          null}
        <button
          type="submit"
          className="text-gray-700 flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-3"
          onClick={() => {
            close();
            handleDeleteNode(node.id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remove
        </button>
        <button
          type="submit"
          className="text-gray-700 flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-3"
          onClick={() => {
            close();
            toggleFileUploader(true);
            setActiveNode({ nodeId: node.id, nodeTitle: node.data.title });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          Add file
        </button>
        <button
          type="submit"
          className="text-gray-700 flex items-center block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-3"
          onClick={() => {
            close();
            switchNodeType(node.id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          Change Type
        </button>
      </div>
    </div>
  );

  const createNode = (
    nodeType: NodeType,
    pos: XYPosition,
    nodeId?: string,
    highlighted = false,
    title = "default__name"
  ) => {
    const id = nodeId || utils.newId(elements);

    const newNode = {
      type: "customNode",
      data: {
        highlighted,
        nodeType,
        title,
        MenuButtons,
      },
      id,
      position: pos,
    };
    return newNode;
  };

  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    nodeId?: string,
    nodeTitle?: string
  ) => {
    const files = e.target.files;
    if (filename.length && files?.length && nodeId && nodeTitle) {
      setFileUploadLoading(true);
      await utils.uploadFile(id, nodeTitle, nodeId, filename, files);
      setFilename("");
      setFileUploadLoading(false);
      toggleFileUploader(false);
    }
  };

  return (
    <>
      <Modal
        show={!!editNameModal?.size}
        title="Edit label"
        onClose={() => toggleEditNameModal(undefined)}
        onSave={() => handleNodeLabelChange()}
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        }
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="node_label"
          >
            Label
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNodeLabelChange();
            }}
          >
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="node_label"
              placeholder="new label"
              value={editNameModal?.get(true)?.title ?? ""}
              onChange={(e) => {
                toggleEditNameModal(
                  (m: Map<boolean, { id: string; title?: string }>) =>
                    m.size &&
                    new Map(
                      m.set(true, {
                        id: m.get(true)?.id ?? "",
                        title: e.target.value,
                      })
                    )
                );
              }}
              required
            />
          </form>
          <p className="text-red-500 text-xs italic">Please enter label</p>
        </div>
      </Modal>

      <Modal
        show={showFileUploader}
        title="Add file"
        onClose={() => toggleFileUploader(false)}
        onSave={() => handleFileUpload()}
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        }
      >
        <form className="bg-white rounded  pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              filename
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="filename"
              type="text"
              placeholder="Enter file name"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              select file
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="file"
              onChange={(e) =>
                uploadFile(e, activeNode.nodeId, activeNode.nodeTitle)
              }
            />
          </div>
        </form>
      </Modal>
      <button
        className="bg-white w-auto flex justify-end items-center text-gray-500 p-2 hover:text-blue-400 m-3"
        onClick={() => history.push("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Go Back Home
      </button>
      <div className="tree flex p-8">
        <SideBar />
        <div className="tree__editor flex-1 border p-5">
          <div className="flex flex-col">
            <div className="tree__editor__toolbar flex-initial border p-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    className={`${
                      hasUnsavedChanges
                        ? "bg-blue-500 hover:bg-blue-700"
                        : "bg-blue-200"
                    } text-white font-bold py-2 px-4 rounded m-2`}
                    disabled={!hasUnsavedChanges}
                    onClick={() => handleSave()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center  rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="tree__editor__pane border m-2"
              style={{ height: "80vh" }}
              ref={reactFlowWrapper}
            >
              <ReactFlow
                elements={elements}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
                onNodeDragStop={handleNodeDragStop}
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={12}
                  size={0.5}
                />
                <MiniMap />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        </div>

        <div className="tree__files flex-initial border p-6">
          <h3>All files ({files.length}) </h3>
          <div className="mt-5 shadow flex">
            <input
              className="w-full rounded p-2"
              type="text"
              placeholder="Search files"
            />
            <button className="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <div className="w-full bg-white rounded-lg mt-8">
            <ul className="divide-y-2 divide-gray-400">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {file.name}.{file.format}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    download={file.name}
                  >
                    <button
                      type="button"
                      className="inline-flex justify-center  rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                      id="menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const WrappedFlowTree = () => (
  <ReactFlowProvider>
    <NewTree />
  </ReactFlowProvider>
);

export default WrappedFlowTree;