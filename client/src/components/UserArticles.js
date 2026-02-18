import React, { useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {  useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";

function UserArticles({ searchTerm }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortOption, setSortOption] = useState(""); // Initially no sorting
  
  const { currentuser } = useSelector((state) => state.userauthorlogin);
  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const res = await axios.get("http://localhost:2000/userapi/articles");
        const apiArticles = Array.isArray(res?.data?.data) ? res.data.data : [];
        setArticles(apiArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
        setErrorMessage("Unable to load articles right now.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
    console.log("Current user:", currentuser);
  }, [currentuser]);

  const handleReadMore = async(articleId) => {
    navigate(`/articles/id/${articleId}`);
  };


  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const safeArticles = Array.isArray(articles) ? articles : [];
  const normalizedSearchTerm = (searchTerm || "").toLowerCase();
  const filteredArticles = safeArticles.filter((article) =>
    !normalizedSearchTerm ||
    (article?.title || "").toLowerCase().includes(normalizedSearchTerm)
  );

  let sortedArticles = [...filteredArticles];

  if (sortOption === "date") {
    sortedArticles.sort((a, b) => new Date(b.date_modification) - new Date(a.date_modification));
  }

  const groupArticles = (key) => {
    return sortedArticles.reduce((acc, article) => {
      let groupKey;
      if (key === "date") {
        groupKey = article.date_modification
          ? new Date(article.date_modification).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "Unknown Date";
      } else {
        groupKey = article[key] || "Unknown";
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(article);
      return acc;
    }, {});
  };

  let groupedArticles = {};
  if (sortOption) {
    if (sortOption === "author") {
      groupedArticles = groupArticles("username");
    } else if (sortOption === "category") {
      groupedArticles = groupArticles("category");
    } else if (sortOption === "date") {
      groupedArticles = groupArticles("date");
    }
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold" style={{ color: "#001f7f" }}>Articles</h3>
        <div className="dropdown">
          <button className="btn text-white dropdown-toggle d-flex align-items-center" style={{ backgroundColor: "#001f7f" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-list me-2"></i> Sort
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" value="date" onClick={handleSortChange}>Sort by Date</button></li>
            <li><button className="dropdown-item" value="author" onClick={handleSortChange}>Sort by Author</button></li>
            <li><button className="dropdown-item" value="category" onClick={handleSortChange}>Sort by Category</button></li>
          </ul>
        </div>
      </div>

      <div className="row">
        {isLoading && (
          <div className="col-12 text-center">
            <p className="fw-semibold text-secondary">Loading articles...</p>
          </div>
        )}
        {!isLoading && errorMessage && (
          <div className="col-12 text-center">
            <p className="fw-semibold text-danger">{errorMessage}</p>
          </div>
        )}
        {!isLoading && !errorMessage && (sortOption ? (
          Object.keys(groupedArticles).sort().map((groupKey, idx) => (
            <div key={idx} className="col-12">
              <h4 className="fw-bold mt-4 text-decoration-underline" style={{ color: "#001f7f" }}>{groupKey.toUpperCase()}</h4>
              <div className="row">
                {groupedArticles[groupKey].map((article, index) => (
                  <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                      {article.img && (
                        <img
                          src={article.img}
                          alt="Article Cover"
                          className="card-img-top rounded-top-4"
                          style={{ maxHeight: "150px", objectFit: "cover" }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold" style={{ color: "#001f7f" }}>{article.title}</h5>
                        <p className="card-text text-secondary">
                          {(article?.content || "").slice(0, 100)}{(article?.content || "").length > 100 && "..."}
                        </p>
                        <button
  className="btn mt-auto rounded-pill text-white"
  style={{ backgroundColor: "#001f7f" }}
  onClick={() => handleReadMore(article.article_id)}
>
  Read More
</button>
                      </div>
                      <div className="card-footer bg-light text-muted text-start rounded-bottom-4">
                        Last updated on {article?.date_modification ? new Date(article.date_modification).toLocaleString() : "Unknown"} by {article?.username || "Unknown"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          sortedArticles.length > 0 ? (
            sortedArticles.map((article, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  {article.img && (
                    <img
                      src={article.img}
                      alt="Article Cover"
                      className="card-img-top rounded-top-4"
                      style={{ maxHeight: "150px", objectFit: "cover" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold" style={{ color: "#001f7f" }}>{article.title}</h5>
                    <p className="card-text text-secondary">
                      {(article?.content || "").slice(0, 100)}{(article?.content || "").length > 100 && "..."}
                    </p>
                    <button
  className="btn mt-auto rounded-pill text-white"
  style={{ backgroundColor: "#001f7f" }}
  onClick={() => handleReadMore(article.article_id)}
>
  Read More
</button>
                  </div>
                  <div className="card-footer bg-light text-muted text-start rounded-bottom-4">
                    Last updated on {article?.date_modification ? new Date(article.date_modification).toLocaleString() : "Unknown"} by {article?.username || "Unknown"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="fw-semibold text-secondary">No articles available.</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default UserArticles;
