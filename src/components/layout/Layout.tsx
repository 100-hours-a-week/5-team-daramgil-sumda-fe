import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Wrapbar from "./Wrapbar";
import Footer from "./Footer";
import forest from "../../assets/forest.jpg";
import "./styles/Layout.css";

const Layout: React.FC = () => {
  return (
    <div
      className="background-container"
      style={{ backgroundImage: `url(${forest})` }}
    >
      <div className="mobile-frame">
        <Header />
        <div className="content-container">
          <Outlet />
          <Footer />
        </div>
        <Wrapbar />
      </div>
    </div>
  );
};

export default Layout;
