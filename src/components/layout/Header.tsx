import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import Sidebar from "./Sidebar";
import "./styles/Header.css";

import logo from "../../assets/icons/logo.png";
import menu_icon from "../../assets/icons/menu.png";

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 초기화
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const goHome = () => {
    navigate("/"); // "/"로 리다이렉트
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭한 대상이 헤더나 사이드바 내부가 아닌 경우에만 닫음
      if (
        sidebarRef.current &&
        headerRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !headerRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  return (
    <div>
      <header className="header" ref={headerRef}>
        <img
          src={menu_icon}
          alt="menu-icon"
          className="menu-icon"
          onClick={toggleSidebar}
        />
        <div className="header-logo" onClick={goHome}>
          <img src={logo} alt="Logo" className="logo" />
          <p className="logo-text">
            <strong className="logo-strong">숨</strong>쉬는{" "}
            <strong className="logo-strong">다</strong>람쥐
          </p>
        </div>
        <p style={{ marginLeft: "30px" }}></p>
      </header>
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
};

export default Header;
