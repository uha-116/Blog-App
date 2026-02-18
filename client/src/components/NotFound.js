import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "100vh", padding: "1rem", backgroundColor: "#f8f9fa" }}
    >
      <h1 className="display-1 fw-bold text-dark mb-3">404</h1>
      <p className="lead text-secondary mb-4">Oops! This page doesn't exist.</p>
      <button
        type="button"
        className="btn btn-primary px-4 py-2"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFound;
