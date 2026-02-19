import React from "react";

function CommentSection({
  comments,
  comment,
  setComment,
  error,
  handleAddComment,
  handleDeleteComment,
}) {
  return (
    <>
      <div className="mt-4">
        <h5>Add a Comment</h5>

        <textarea
          className="form-control mb-2"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="btn"
          style={{ backgroundColor: "#001f7f", color: "white" }}
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>

      <div className="mt-4">
        {comments.map((c) => (
          <div key={c.comment_id} className="border p-2 mb-2">
            <strong>{c.username}</strong>
            <p>{c.comments}</p>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteComment(c)}
            >
              Delete
            </button>
          </div>
        ))}

        {error && <p className="text-danger">{error}</p>}
      </div>
    </>
  );
}

export default CommentSection;
