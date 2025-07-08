import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AddArticle() {
  const { currentuser } = useSelector((state) => state.userauthorlogin);
  const navigate = useNavigate();
  const location=useLocation();
  const prev=location.state?.article;
  console.log(prev)


  const handleSubmit = async (e) => {
    e.preventDefault();

    const articleData = {
      article_id: prev? prev.article_id:Date.now().toString(),
      title: e.target.title.value,
      category: e.target.category.value,
      img: e.target.imageUrl.value,
      content: e.target.content.value,
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString(),
      username: currentuser.details.username,
      comments: [],
      status: true,
    };
    let res;
    try {
      if(prev){
       res = await axios.put("http://localhost:2000/authorapi/articles/update", articleData, {
        headers: { "Content-Type": "application/json" },
      });
    }
    else
    {
       res = await axios.post("http://localhost:2000/authorapi/articles", articleData, {
        headers: { "Content-Type": "application/json" },
      });
       
    }

      console.log("Article submitted successfully:", res.data);
      e.target.reset();
      navigate("/authorarticles", { state: { refresh: true } });
    } catch (err) {
      console.error("Error submitting article:", err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center" style={{ paddingTop: "80px" }}>
        <div className="col-lg-6 col-md-8 col-12 card shadow-lg p-4" style={{ borderRadius: "12px" }}>
          <h5 className="fw-semibold mb-3">{prev ? "✏️ Edit Article" : "📝 Add New Article"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">Title:</label>
              <input type="text" name="title" id="title" className="form-control border-2" placeholder="Enter article title" defaultValue={prev ? prev.title : ""} required />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label fw-semibold">Select a Category:</label>
              <select name="category" id="category" className="form-select border-2" defaultValue={prev ? prev.category : ""} required>
                <option value="" disabled selected>Select</option>
                <option value="Movies">Movies</option>
                <option value="Programming">Programming</option>
                <option value="Technologies">Technologies</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label fw-semibold">Content:</label>
              <textarea name="content" id="content" className="form-control border-2" rows="4" placeholder="Write your article here..." defaultValue={prev ? prev.content : ""} required></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label fw-semibold">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                className="form-control border-2"
                placeholder="Enter image URL"
                defaultValue={prev ? prev.img : ""}
              />
            </div>

            <div className="text-start">
              <button type="submit" className="btn btn-success px-4 fw-semibold">{prev ? "Update" : "Post"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddArticle;
