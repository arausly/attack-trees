import React from "react";
import { useHistory } from "react-router";
import Modal from "../components/modal";
import Comment from "./components/comments";
import { NodeType, Tree } from "../typings";
import utils from "../utils";

const Timeline = () => {
  const [trees, setTrees] = React.useState<Tree[]>([]);
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [showComments, setShowComments] = React.useState<boolean>(false);
  const [activeTreeId, setActiveTreeId] = React.useState<string>("");
  const [showCreateTreeForm, toggleCreateTreeForm] =
    React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const history = useHistory();
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    utils
      .getAllTrees()
      .then((res: any) => setTrees(res.data))
      .catch(console.error);
  }, []);

  const handleCreateTree = async () => {
    const result: any = await utils.createNewTree(title, description);
    if (result?.ref) {
      const newTreeId = result.ref?.value.id;
      history.push(`/tree/${newTreeId}`);
    }
    toggleCreateTreeForm(false);
  };

  const handleDeleteTree = async () => {
    try {
      setDeleteLoading(true);
      await utils.deleteTree(activeTreeId);
    } catch (err) {
    } finally {
      setDeleteLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Comment
        toggle={setShowComments}
        treeId={activeTreeId}
        show={showComments}
      />
      <Modal
        show={showDeleteModal}
        title="Delete prompt"
        onClose={() => setShowDeleteModal(false)}
        onSave={() => handleDeleteTree()}
        saveActionName="Yes"
        cancelActionName="No"
        icon={
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </>
        }
      >
        <p className="text-sm font-medium text-black">
          {deleteLoading
            ? "Deleting, please wait..."
            : "Are you sure you want to delete this tree"}
        </p>
      </Modal>
      <Modal
        show={showCreateTreeForm}
        title="Create New Tree"
        onClose={() => toggleCreateTreeForm(false)}
        onSave={() => handleCreateTree()}
        icon={
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </>
        }
      >
        <form className="bg-white rounded pt-6 pb-8 mb-4 w-96">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description"
            />
          </div>
        </form>
      </Modal>
      <section>
        <div className="">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 w-36 flex items-center"
            onClick={() => toggleCreateTreeForm(true)}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Tree
          </button>
        </div>
        <h3 className="p-6 text-xl">All Trees({trees.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {trees.map((tree) => {
            const data: any = {
              ands: [],
              ors: [],
              highlights: [],
            };
            tree.data.nodes.forEach((n: any) => {
              if (n.data.highlighted) {
                data.highlights.push(n);
              }
              if (n.data.nodeType === NodeType.AND_NODE) {
                data.ands.push(n);
              } else {
                data.ors.push(n);
              }
            });

            const andNodesLength = data.ands.length;
            const orNodesLength = data.ors.length;
            const highlightsNodesLength = data.highlights.length;
            const treeId = tree.ref.value.id;
            return (
              <div key={treeId} className="cursor-pointer">
                <div className="max-w-sm rounded overflow-hidden shadow-lg  flex flex-col justify-center items-center">
                  <img
                    className="w-full"
                    src="/flow.jpeg"
                    alt="Sunset in the mountains"
                  />
                  <div className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="ml-4 flex items-center justify-between mb-2">
                        <div
                          className="__cursor mx-2 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                          onClick={() => {
                            history.push(`/tree/${treeId}`);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-600 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                        <span className="mx-3" />
                        <div
                          onClick={() => {
                            setShowComments(true);
                            setActiveTreeId(treeId);
                          }}
                          className="__cursor mx-2 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 ml-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <span className="mx-3" />
                        <div
                          onClick={() => {
                            setShowDeleteModal(true);
                            setActiveTreeId(treeId);
                          }}
                          className="__cursor mx-2 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 ml-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-600"
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
                        </div>
                      </div>
                      <div className="font-bold text-xl mb-2">
                        {utils.shortenWithEllipsis(
                          tree.data.title ?? "No Title"
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-base">
                      {utils.shortenWithEllipsis(
                        tree.data.description ?? "No Description"
                      )}
                    </p>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {andNodesLength} AND node{andNodesLength > 1 ? "s" : ""}
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {orNodesLength} OR node{orNodesLength > 1 ? "s" : ""}
                    </span>
                    {(highlightsNodesLength && (
                      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {highlightsNodesLength} Highlight
                        {highlightsNodesLength > 1 ? "s" : ""}
                      </span>
                    )) ||
                      null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Timeline;
