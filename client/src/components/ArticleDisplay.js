import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requireAuthForAction } from "../services/authGuard";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useArticle } from "../hooks/useArticle";
import { useComments } from "../hooks/useComments";

function ArticleDisplay() {
  const { article_id } = useParams();
  const navigate = useNavigate();
  const { currentuser } = useSelector(
    (state) => state.userauthorlogin
  ) || {};

  const {
    article,
    isLoading,
    isNotFound,
    removeArticle,
  } = useArticle(article_id);

  const {
    comments,
    comment,
    setComment,
    error,
    handleAddComment,
    handleDeleteComment,
  } = useComments(article_id, currentuser);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔥 UI Guard Logic
  const canEditOrDelete =
    currentuser?.usertype === "Author" &&
    currentuser?.username === article?.username;

  useEffect(() => {
    if (isNotFound) {
      navigate("/not-found", { replace: true });
    }
  }, [isNotFound, navigate]);

  const handleEditArticle = () => {
    if (
      !requireAuthForAction({
        requiredRole: "Author",
        ownerUsername: article?.username,
        checkOwnership: true,
      })
    )
      return;

    navigate("/authorarticles/new", { state: { article } });
  };

  const handleDeleteConfirm = async () => {
    if (
      !requireAuthForAction({
        requiredRole: "Author",
        ownerUsername: article?.username,
        checkOwnership: true,
      })
    ) {
      setShowDeleteModal(false);
      return;
    }

    try {
      await removeArticle();
      navigate("/authorarticles", { state: { refresh: true } });
    } catch (error) {
      console.error("Error deleting article:", error);
    }

    setShowDeleteModal(false);
  };

  if (isLoading) {
    return <p className="text-center mt-4">Loading article...</p>;
  }

  if (!article) return null;

  return (
    <div>
      <div
        className="article-container d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${article.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          className="content-overlay p-4 rounded text-light mt-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            maxWidth: "800px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h2>{article.title}</h2>

            {/* 🔥 Edit/Delete only visible if owner */}
            {canEditOrDelete && (
              <div>
                <button
                  className="btn btn-info me-2"
                  onClick={handleEditArticle}
                >
                  <FaEdit />
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          <p><strong>Author:</strong> {article.username}</p>
          <p><strong>Created:</strong> {new Date(article.date_creation).toLocaleString()}</p>
          <p><strong>Modified:</strong> {new Date(article.date_modification).toLocaleString()}</p>

          <div className="mb-3">
            {article.content.split("\\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

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
        </div>
      </div>
    </div>
  );
}

export default ArticleDisplay;
