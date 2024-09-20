import React from "react";
import logo from "../../assets/icons/logo.png";
import "./styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* <img src={logo} alt="Logo" className="footer-logo" /> */}
      <p className="footer-text">
        팀 이름: 다람길 | 서비스 이름: 숨쉬는 다람쥐 (숨다)
        <br />
        고객센터: daramgil07@gmail.com | 이미지 출처:{" "}
        <a
          href="https://kr.freepik.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Freepik
        </a>
      </p>
    </footer>
  );
};

export default Footer;
