import React from "react";
import { useHistory } from "react-router";
import Modal from "../components/modal";
import { NodeType, Tree } from "../typings";
import utils from "../utils";

const Timeline = () => {
  const [trees, setTrees] = React.useState<Tree[]>([]);
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [showCreateTreeForm, toggleCreateTreeForm] =
    React.useState<boolean>(false);
  const history = useHistory();

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

  return (
    <>
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
              <div
                key={treeId}
                className="cursor-pointer"
                onClick={() => history.push(`/tree/${treeId}`)}
              >
                <div className="max-w-sm rounded overflow-hidden shadow-lg  flex flex-col justify-center items-center">
                  <img
                    className="w-full"
                    src="/flow.jpeg"
                    alt="Sunset in the mountains"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">
                      {utils.shortenWithEllipsis(tree.data.title ?? "No Title")}
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
