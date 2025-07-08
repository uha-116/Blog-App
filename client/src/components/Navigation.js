import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "../redux/slices/userauthorslice";
import { FaSearch, FaBars, FaHome, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Import Bootstrap JS
import "./nav.css";
import logo from "./images/bloglogo.png";

const Navigation = ({ setSearchTerm }) => {
  const { currentuser, loginstatus } = useSelector((state) => state.userauthorlogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); 

  const isArticleDisplayPage = location.pathname.startsWith("/articles/id/");
  const isNewArticlePage = location.pathname === "/authorarticles/new"; // ✅ Exact match for new article page

  useEffect(() => {
    if (loginstatus) {
      navigate(currentuser.details.usertype === "Author" ? "/authorarticles" : "/userarticles");
    }
  }, [loginstatus]);

  const logout = (event) => {
    event.preventDefault();
    dispatch(reset());
    navigate("/signup", { state: { showLogin: true } });
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div>
      {/* ✅ Navbar */}
      <nav
        className="navbar navbar-expand-md fixed-top"
        style={{
          backgroundColor: isArticleDisplayPage || isNewArticlePage ? "#001f7f" : "white",
        }}
      >
        <div className="container-fluid">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Logo" style={{ height: "30px" }} />
          </Link>

          {/* ✅ Hamburger Icon */}
          <button
            className="btn d-md-none"
            type="button"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
          >
            <FaBars />
          </button>

          {/* ✅ Desktop Links */}
          <div className="navbar-nav ms-auto d-none d-md-flex align-items-center">
            {!loginstatus ? (
              <>
                <Link
                  to="/"
                  className="nav-link fs-5"
                  style={{
                    color: isArticleDisplayPage || isNewArticlePage ? "white" : "black",
                  }}
                >
                  <FaHome className="me-2" /> Home
                </Link>
                <Link
                  to="/signup"
                  className="nav-link fs-5"
                  style={{
                    color: isArticleDisplayPage || isNewArticlePage ? "white" : "black",
                  }}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <div className="d-flex align-items-center me-3">
                  <FaUser
                    className="fs-4 me-2"
                    style={{
                      color: isArticleDisplayPage || isNewArticlePage ? "white" : "black",
                    }}
                  />
                  <span
                    className="fw-medium"
                    style={{
                      color: isArticleDisplayPage || isNewArticlePage ? "white" : "black",
                    }}
                  >
                    {currentuser.details.username} <sub>({currentuser.details.usertype})</sub>
                  </span>
                </div>
                <Link
                  to="/signup"
                  className="nav-link fs-5"
                  style={{
                    color: isArticleDisplayPage || isNewArticlePage ? "white" : "black",
                  }}
                  onClick={logout}
                >
                  Logout
                </Link>
              </>
            )}
          </div>

          {/* ✅ Mobile Dropdown Menu */}
          {dropdownOpen && (
            <div className="dropdown-menu show custom-dropdown">
              {!loginstatus ? (
                <>
                  <Link to="/" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Home
                  </Link>
                  <Link to="/signup" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <div className="dropdown-item d-flex align-items-center">
                    <FaUser className="fs-4 me-2 text-dark" />
                    <span>
                      {currentuser.details.username} <sub>({currentuser.details.usertype})</sub>
                    </span>
                  </div>
                  <Link
                    to="/signup"
                    className="dropdown-item"
                    onClick={(e) => {
                      logout(e);
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Hide this section when viewing an article OR adding a new article */}
      {(!isArticleDisplayPage && !isNewArticlePage) && (
        <div className="main-section text-center text-white py-5 mt-5" style={{ backgroundColor: "#001f7f" }}>
          <div className="container">
            <h1 className="display-4 fw-bold">
              {loginstatus ? `Hi ${currentuser.details.username}!` : "Welcome to Blog"}
            </h1>
            <p className="lead">Explore a number of blogs from various categories!</p>

            <form className="search-bar d-flex justify-content-center mt-4 w-75 mx-auto">
              <div className="input-group w-100">
                <span className="input-group-text bg-white rounded-start-pill">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control rounded-end-pill"
                  placeholder="Search by title"
                  aria-label="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
