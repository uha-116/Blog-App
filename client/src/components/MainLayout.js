import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import GlobalAlert from "./GlobalAlert";

function MainLayout({ setSearchTerm }) {
  return (
    <div className="app-container">
      <Navigation setSearchTerm={setSearchTerm} />
      <GlobalAlert />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
