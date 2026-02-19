import api from "./api";

export async function getAllArticles() {
  try {
    const response = await api.get("/userapi/articles");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAuthorArticles(username) {
  try {
    const response = await api.get(`/authorapi/articles/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getArticleById(articleId) {
  try {
    const response = await api.get(`/authorapi/articles/id/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createArticle(articleData) {
  try {
    const response = await api.post("/authorapi/articles", articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateArticle(articleData) {
  try {
    const response = await api.put("/authorapi/articles/update", articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteArticle(articleId) {
  try {
    const response = await api.put(`/authorapi/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
