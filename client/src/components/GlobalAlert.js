import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function GlobalAlert() {
  const { pathname } = useLocation();
  const { errMsg } = useSelector((state) => state.userauthorlogin);
  const message =
    typeof errMsg === "string" ? errMsg : errMsg?.data || errMsg?.message || "";

  if (pathname === "/signup") return null;
  if (!message) return null;

  return (
    <div
      className="alert alert-warning text-center mb-0"
      role="alert"
      style={{
        position: "fixed",
        top: "56px",
        left: 0,
        right: 0,
        zIndex: 1100,
        borderRadius: 0,
      }}
    >
      {message}
    </div>
  );
}

export default GlobalAlert;
