import React, { useState } from "react";
import Sidebar from "./Sidebar";
import './styles/Header.css';

import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu.png"

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
  };

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
          <img src={logo} alt="Logo" className="logo"/>
          <p className="logo-text">
            <strong className="logo-strong">숨</strong>쉬는 <strong className="logo-strong">다</strong>람쥐
          </p>
        </div>
        <p style={{ marginLeft: '30px' }}></p>
      </header>
      <Sidebar isOpen={isSidebarOpen} />
    </div>
  );
};

export default Header;