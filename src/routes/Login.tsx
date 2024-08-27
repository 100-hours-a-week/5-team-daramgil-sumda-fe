import React from "react";
// 숨쉬는 다람쥐 로고 이미지
import logo from "../assets/icons/logo.png";
// 카카오 로그인 버튼 이미지
import kakao_login_button_img from "../assets/icons/kakao_login_large_wide.png";
// 스타일링 코드
import "./styles/Login.css";
const Login: React.FC = () => {
  return (
    <div className="login-container">
      <img className="login-logo" src={logo} alt="숨다 로고 이미지" />
      <p className="logo-text">
        <strong className="logo-strong">숨</strong>쉬는{" "}
        <strong className="logo-strong">다</strong>람쥐
      </p>
      <p className="login-explain1">해당 서비스는 회원만 이용할 수 있습니다.</p>
      <p className="login-explain2">이용하려면 로그인해주세요.</p>
      <div className="login-button-container">
        <button className="login-button">
          <img
            className="login-button-img"
            src={kakao_login_button_img}
            alt="카카오 로그인 이미지"
          />
        </button>
      </div>
    </div>
  );
};

export default Login;
