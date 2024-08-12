import React from "react";
import logo from "../../assets/logo.png";
import "./styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <img src={logo} alt="Logo" className="footer-logo" />
      <p className="footer-text">
        상호명 : 숨쉬는 다람쥐 | 대표자 박원준<br />
        고객센터 : 010-1234-1234, contact@daramgil.kr<br />
        주소 : 서울특별시 어딘가 임대로 싼 곳에 있는 다람길
      </p>
    </footer>
  );
};

export default Footer;