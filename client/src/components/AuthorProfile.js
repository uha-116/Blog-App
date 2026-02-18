import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api";
import { requireAuthForAction } from "../services/authGuard";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";

function Authorarticles() {
  const [articles, setArticles] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const { currentuser } = useSelector((state) => state.userauthorlogin);
  const navigate = useNavigate();
  const location=useLocation();
  console.log("Location State:", location.state);
  useEffect(() => {
    if (!requireAuthForAction({ requiredRole: "Author" })) return;
    if (!currentuser?.username) return;

    const fetchArticles = async () => {
      try {
        if (currentuser) {
          const res = await api.get(`/authorapi/articles/${currentuser.username}`);
          setArticles(Array.isArray(res.data?.data) ? res.data.data : []);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    if (currentuser) {
      fetchArticles();
    }
  }, [currentuser?.username,location.state?.refresh]);
  useEffect(() => {
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleNavigate = () => {
    if (!requireAuthForAction({ requiredRole: "Author" })) return;
    console.log("Navigating to /authorarticles/new"); // Debug log
    navigate("/authorarticles/new");
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const safeArticles = Array.isArray(articles) ? articles : [];
  let sortedArticles = [...safeArticles];
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
  if (sortOption === "category") {
    groupedArticles = groupArticles("category");
  } else if (sortOption === "date") {
    groupedArticles = groupArticles("date");
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold" style={{ color: "#001f7f" }}>My Articles</h3>
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button className="btn text-white dropdown-toggle d-flex align-items-center" style={{ backgroundColor: "#001f7f" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-list me-2"></i> Sort
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" value="date" onClick={handleSortChange}>Sort by Date</button></li>
              <li><button className="dropdown-item" value="category" onClick={handleSortChange}>Sort by Category</button></li>
            </ul>
          </div >
          <button className="btn text-white" style={{ backgroundColor: "#001f7f" }}  onClick={handleNavigate}>
            <i className="bi bi-plus-lg me-2"></i> Add Article
          </button>
        </div>
      </div>
      <div className="row">
        {sortOption ? (
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
                          {article.content.slice(0, 100)}{article.content.length > 100 && "..."}
                        </p>
                        <button
                          className="btn mt-auto rounded-pill text-white"
                          style={{ backgroundColor: "#001f7f" }}
                          onClick={() => navigate(`/articles/id/${article.article_id}`)}
                        >
                          Read More
                        </button>
                      </div>
                      <div className="card-footer bg-light text-muted text-start rounded-bottom-4">
                        Last updated on {new Date(article.date_modification).toLocaleString()} by {article.username}
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
                      {article.content.slice(0, 100)}{article.content.length > 100 && "..."}
                    </p>
                    <button
                      className="btn mt-auto rounded-pill text-white"
                      style={{ backgroundColor: "#001f7f" }}
                      onClick={() => navigate(`/articles/id/${article.article_id}`)}
                    >
                      Read More
                    </button>
                  </div>
                  <div className="card-footer bg-light text-muted text-start rounded-bottom-4">
                    Last updated on {new Date(article.date_modification).toLocaleString()} by {article.username}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="fw-semibold text-secondary">No articles available.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Authorarticles;

