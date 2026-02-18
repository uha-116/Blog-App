import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Authorarticles from './components/AuthorProfile'
import AddArticle from './components/AddArticle'
import UserArticles from "./components/UserArticles";
import ArticleDisplay from "./components/ArticleDisplay";
import NotFound from "./components/NotFound";
import MainLayout from "./components/MainLayout";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout setSearchTerm={setSearchTerm} />}>
          <Route index element={<UserArticles searchTerm={searchTerm}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authorarticles" element={<Authorarticles />} />
          <Route path="/userarticles" element={<UserArticles searchTerm={searchTerm}/>} />
          <Route path="/authorarticles/new" element={<AddArticle />} />
          <Route path="/articles/id/:article_id" element={<ArticleDisplay />} />
        </Route>
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
