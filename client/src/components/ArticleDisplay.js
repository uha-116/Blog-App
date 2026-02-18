import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uid } from 'uuid';
import api from "../services/api";
import { requireAuthForAction } from "../services/authGuard";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash ,FaUserCircle} from "react-icons/fa";
function ArticleDisplay() {
  const ALERT_DURATION_MS = 3000;
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [refreshComments, setRefreshComments] = useState(false);
  const errorTimerRef = useRef(null);

  const { currentuser } = useSelector((state) => state.userauthorlogin) || {};

  const showTransientError = (message) => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    setError(message);
    errorTimerRef.current = setTimeout(() => {
      setError("");
    }, ALERT_DURATION_MS);
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/userapi/comments/${article_id}`);
      console.log("Fetched Comments:", res.data.showcomment);
      setComments(res.data.showcomment);  // Storing the comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    const fetchArticleById = async () => {
      setIsLoading(true);
      setIsNotFound(false);
      try {
        const res = await api.get(`/authorapi/articles/id/${article_id}`);
        const fetchedArticle = res?.data?.data?.[0];

        if (!fetchedArticle) {
          setArticle(null);
          setIsNotFound(true);
        } else {
          setArticle(fetchedArticle);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setArticle(null);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleById();
    fetchComments();
  }, [article_id,refreshComments]);

  useEffect(() => {
    if (isNotFound) {
      navigate("/not-found", { replace: true });
    }
  }, [isNotFound, navigate]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const handleEditArticle = () => {
    if (
      !requireAuthForAction({
        requiredRole: "Author",
        ownerUsername: article?.username,
        checkOwnership: true,
      })
    ) {
      return;
    }
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
      const updatedArticle = { ...article, status: false };
      await api.put(`/authorapi/articles/${article_id}`, updatedArticle);
      setArticle(null);
      navigate("/authorarticles", { state: { refresh: true } });
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
    setShowDeleteModal(false);
  };
  const handleDeleteComment = async (comment) => {
    console.log("Trying to delete:", comment);
    if (
      !requireAuthForAction({
        ownerUsername: comment.username,
        checkOwnership: true,
        wrongRoleMessage: "You are not allowed to delete this comment.",
      })
    ) {
      return;
    }

    try {
      await api.delete(
        `/userapi/comments/${article_id}/${comment.comment_id}`
      );
      setRefreshComments((prev) => !prev); // refresh to reflect changes
    } catch (err) {
      console.error("Error deleting comment:", err);
      showTransientError("Failed to delete comment. Try again.");
    }
  };
  
  const handleComment = async () => {
   if (!requireAuthForAction()) {
    return;
   }

    try {
      const commentData={
        id:article_id ,
        comment_id: uid(),
        username:currentuser.username,
        comments:comment,
        date:new Date().toISOString()
      }
      await api.post(`/userapi/comments`, commentData);
      setComment("");
      setRefreshComments((prev) => !prev); 
    } catch (error) {
      console.error("Error adding comment:", error);
      showTransientError("Failed to add comment. Please try again.");
    }
  };
  return (
    <div>
      {isLoading || isNotFound ? (
        <p className="text-center mt-4">Loading article...</p>
      ) : (
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
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="fw-bold">{article.title}</h2>
              <div>
                <button className="btn me-2 btn-info" 
                 onClick={handleEditArticle}
                >
                  <FaEdit />
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                  <FaTrash />
                </button>
              </div>
            </div>

            <p>
              <strong>Author:</strong> {article.username}
            </p>
            <p>
              <strong>Created:</strong> {new Date(article.date_creation).toLocaleString()}
            </p>
            <p>
              <strong>Modified:</strong> {new Date(article.date_modification).toLocaleString()}
            </p>

            <div className="mb-3">
              {article.content.split("\\n").map((paragraph, index) => (
                <p key={index} className="text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="container mt-3">
  {comments.length > 0 ? (
    comments.map((comment) => (
      <div
        key={comment.comment_id}
        className="d-flex justify-content-between align-items-start border p-3 mb-2 rounded shadow-sm"
      >
        <div className="d-flex align-items-start">
          <FaUserCircle size={20} className="me-3 text-primary" />
          <div>
            <strong>{comment.username}</strong>
            <p className="mb-1">{comment.comments}</p>
            <small>{comment.date}</small>
          </div>
        </div>

        <button
          className="btn btn-link p-0 text-danger"
          title="Delete comment"
          onClick={() => handleDeleteComment(comment)}
        >
          <FaTrash size={16} />
        </button>
      </div>
    ))
  ) : (
    <strong>No comments added yet...</strong>
  )}

  {/* 🛑 Error Message placed here after comments */}
  {error && (
    <p className="text-danger small mt-2">{error}</p>
  )}
</div>

            <div className="mt-4">
              <h5>Add a Comment</h5>
              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              <button
                className="btn"
                onClick={handleComment}
                style={{ backgroundColor: "#001f7f", color: "white" }}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div
    className="modal"
    style={{
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1050,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div
        className="modal-content"
        style={{
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          border: "none",
        }}
      >
        <div
          className="modal-header"
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h5 className="modal-title">Confirm Deletion</h5>
          <button
            className="btn-close"
            onClick={() => setShowDeleteModal(false)}
            style={{ filter: "invert(1)" }}
          ></button>
        </div>
        <div className="modal-body text-center">
          <p className="fs-5">Are you sure you want to delete this article?</p>
        </div>
        <div className="modal-footer d-flex justify-content-center">
          <button
            className="btn btn-secondary px-4"
            onClick={() => setShowDeleteModal(false)}
            style={{ borderRadius: "5px" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger px-4"
            onClick={handleDeleteConfirm}
            style={{ borderRadius: "5px" }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}

     
    </div>
  );
}

export default ArticleDisplay;
