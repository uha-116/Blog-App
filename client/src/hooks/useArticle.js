import { useEffect, useState } from "react";
import { getArticleById, deleteArticle } from "../services/articleService";

export const useArticle = (articleId) => {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setIsNotFound(false);

        const res = await getArticleById(articleId);
        const fetchedArticle = res?.data?.[0];

        if (!fetchedArticle) {
          setIsNotFound(true);
        } else {
          setArticle(fetchedArticle);
        }

      } catch (error) {
        console.error("Error fetching article:", error);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const removeArticle = async () => {
    await deleteArticle(articleId);
  };

  return {
    article,
    isLoading,
    isNotFound,
    removeArticle,
  };
};
