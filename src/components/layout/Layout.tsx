import React, {useState, useEffect} from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Wrapbar from "./Wrapbar";
import Footer from "./Footer";

import './styles/Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="background-container">
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