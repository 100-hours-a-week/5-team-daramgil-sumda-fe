import React from "react";
import './styles/Sidebar.css';

const Sidebar: React.FC<{isOpen: boolean}> = ({isOpen}) => {
  return (
    <div className={`sidebar ${isOpen ? '' : 'hidden'}`}>
        <div className="menu-title">메뉴</div>
        <div className="menu-item">즐겨찾는 위치</div>
        <div className="menu-item">컬렉션</div>
        <div className="menu-item">지역별 익명 채팅방</div>
        <div className="menu-item">우리동네 날씨자랑</div>
        <div className="menu-item">기온별 옷차림 추천</div>
        <div className="menu-item">오늘의 옷차림 추천</div>
        <div className="menu-item">야외활동 추천</div>
        <div className="menu-item">도토리 주으러 가기</div>
        
        <div className="footer-section">
            <div className="footer-item">공지사항</div>
            <div className="footer-item">문의하기</div>
            <div className="footer-item">설정</div>
        </div>
    </div>
  );
};

export default Sidebar;