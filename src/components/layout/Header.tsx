import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./styles/Header.css";

import logo from "../../assets/icons/logo.png";
import menu_icon from "../../assets/icons/menu.png";

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // useLocation 훅 사용

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    // 경로가 변경될 때마다 사이드바를 닫음
    closeSidebar();
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  return (
    <div>
      <header className="header">
        <img
          src={menu_icon}
          alt="menu-icon"
          className="menu-icon"
          onClick={toggleSidebar}
        />
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo" />
          <p className="logo-text">
            <strong className="logo-strong">숨</strong>쉬는{" "}
            <strong className="logo-strong">다</strong>람쥐
          </p>
        </div>
        <p style={{ marginLeft: "30px" }}></p>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
};

export default Header;
