import api from "./api";

export const getComments = async (articleId) => {
  const response = await api.get(`/userapi/comments/${articleId}`);
  return response.data;
};

export const addComment = async (commentData) => {
  const response = await api.post(`/userapi/comments`, commentData);
  return response.data;
};

export const deleteComment = async (articleId, commentId) => {
  const response = await api.delete(
    `/userapi/comments/${articleId}/${commentId}`
  );
  return response.data;
};