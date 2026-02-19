import { useEffect, useRef, useState } from "react";
import { v4 as uid } from "uuid";
import {
  getComments,
  addComment,
  deleteComment,
} from "../services/commentService";
import { requireAuthForAction } from "../services/authGuard";

export const useComments = (articleId, currentuser) => {
  const ALERT_DURATION_MS = 3000;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [refreshComments, setRefreshComments] = useState(false);

  const errorTimerRef = useRef(null);

  const showTransientError = (message) => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    setError(message);
    errorTimerRef.current = setTimeout(() => {
      setError("");
    }, ALERT_DURATION_MS);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(articleId);
        setComments(res?.showcomment || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [articleId, refreshComments]);

  const handleAddComment = async () => {
    if (!requireAuthForAction()) return;

    try {
      const commentData = {
        id: articleId,
        comment_id: uid(),
        username: currentuser.username,
        comments: comment,
        date: new Date().toISOString(),
      };

      await addComment(commentData);
      setComment("");
      setRefreshComments((prev) => !prev);

    } catch (error) {
      showTransientError(
        "Failed to add comment. Please try again."
      );
    }
  };

  const handleDeleteComment = async (commentObj) => {
    if (
      !requireAuthForAction({
        ownerUsername: commentObj.username,
        checkOwnership: true,
        wrongRoleMessage:
          "You are not allowed to delete this comment.",
      })
    )
      return;

    try {
      await deleteComment(articleId, commentObj.comment_id);
      setRefreshComments((prev) => !prev);
    } catch (err) {
      showTransientError(
        "Failed to delete comment. Try again."
      );
    }
  };

  return {
    comments,
    comment,
    setComment,
    error,
    handleAddComment,
    handleDeleteComment,
  };
};
