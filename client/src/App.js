import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { reset, setAuthError } from "./redux/slices/userauthorslice";

import Signup from "./components/Signup";
import Authorarticles from "./components/AuthorProfile";
import AddArticle from "./components/AddArticle";
import UserArticles from "./components/UserArticles";
import ArticleDisplay from "./components/ArticleDisplay";
import NotFound from "./components/NotFound";
import MainLayout from "./components/MainLayout";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.userauthorlogin);

  // 🔥 Session Expiry Handler
  const handleSessionExpiry = () => {
    dispatch(setAuthError("Session expired. Please login again."));

    setTimeout(() => {
      dispatch(reset());
      localStorage.removeItem("authData");
      window.location.href = "/signup";
    }, 2000);
  };

  // 🔥 Auto Logout Timer
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const remainingTime = decoded.exp - currentTime;

      if (remainingTime <= 0) {
        handleSessionExpiry();
        return;
      }

      const logoutTimer = setTimeout(() => {
        handleSessionExpiry();
      }, remainingTime * 1000);

      return () => clearTimeout(logoutTimer);

    } catch (error) {
      handleSessionExpiry();
    }

  }, [token]);

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout setSearchTerm={setSearchTerm} />}>
          <Route index element={<UserArticles searchTerm={searchTerm} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authorarticles" element={<Authorarticles />} />
          <Route path="/userarticles" element={<UserArticles searchTerm={searchTerm} />} />
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
