import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import "./styles/Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isOpen, onClose }, ref) => {
    return (
      <div ref={ref} className={`sidebar ${isOpen ? "" : "hidden"}`}>
        <div className="menu-title">메뉴</div>
        <Link to="/favorites" className="menu-item" onClick={onClose}>
          즐겨찾는 위치
        </Link>
        <Link to="/collection" className="menu-item" onClick={onClose}>
          컬렉션
        </Link>
        {/*
        <Link to="/underConstruction" className="menu-item" onClick={onClose}>
          지역별 익명 채팅방
        </Link>
        <Link to="/underConstruction" className="menu-item" onClick={onClose}>
          우리동네 날씨자랑
        </Link> */}
        <Link to="/outfitbytemp" className="menu-item" onClick={onClose}>
          기온별 옷차림 추천
        </Link>
        <Link to="/outfitdaily" className="menu-item" onClick={onClose}>
          오늘의 옷차림 추천
        </Link>
        {/* <Link to="/underConstruction" className="menu-item" onClick={onClose}>
          야외활동 추천
        </Link>
        <Link to="/underConstruction" className="menu-item" onClick={onClose}>
          도토리 주으러 가기
        </Link> */}

        <div className="footer-section">
          <Link to="/notice" className="footer-item" onClick={onClose}>
            공지사항
          </Link>
          <Link to="/contact" className="footer-item" onClick={onClose}>
            문의하기
          </Link>
          <Link to="/setting" className="footer-item" onClick={onClose}>
            설정
          </Link>
          <p style={{ marginBottom: "110px" }}></p>
        </div>
      </div>
    );
  }
);

export default Sidebar;
