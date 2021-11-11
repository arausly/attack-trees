import React from "react";
import utils from "../../../utils";

//style
import "./index.css";

interface CommentProps {
  show: boolean;
  treeId: string;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Comment {
  comment: string;
  treeId: string;
}

const Comments: React.FC<CommentProps> = ({ show, treeId, toggle }) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState<string>("");
  const commentBoxRef = React.useRef<any>();
  React.useEffect(() => {
    if (!treeId) {
      setComments([]);
    }
    utils.getComments(treeId).then((res: any) => {
      const data: any[] = res.data;
      if (data?.length) {
        setComments(() =>
          data.map(([comment, treeId]) => ({ comment, treeId }))
        );
      } else {
        setComments([]);
      }
    });
  }, [treeId]);

  const handleCommentSubmission = async (e: any) => {
    e.preventDefault();
    try {
      await utils.saveComment(newComment, treeId);
      setComments((c) => [...c, { comment: newComment, treeId }]);
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!treeId) return null;
  return (
    <div
      className={`comment ${
        show ? "show" : "hide"
      } fixed z-20 inset-0 overflow-y-auto`}
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={() => toggle(false)}
      ></div>
      <div className="comment__area">
        <div className="mr-2 h-full w-full comment-box" ref={commentBoxRef}>
          {comments.map((comment, index) => (
            <div className="clearfix" key={index}>
              <div className="bg-gray-300 w-10/12 mr-1 my-2 p-2 rounded-lg">
                {comment.comment}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmission}>
          <div>
            <input
              placeholder="Enter comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments;
