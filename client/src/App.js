import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Signup from "./components/Signup";
import Authorarticles from './components/AuthorProfile'
import AddArticle from './components/AddArticle'
import UserArticles from "./components/UserArticles";
import ArticleDisplay from "./components/ArticleDisplay";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  console.log("App re-rendered");
  return (
    <Router>
      <div className="app-container">
        <Navigation setSearchTerm={setSearchTerm}/>
        <div className="content">
          <Routes>
            <Route index element={<UserArticles searchTerm={searchTerm}/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/authorarticles" element={<Authorarticles />} />
            <Route path="/userarticles" element={<UserArticles searchTerm={searchTerm}/>} />
            <Route path="/authorarticles/new" element={<AddArticle />} />
            <Route path="/articles/id/:article_id" element={<ArticleDisplay />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
