import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import kakao_login_button_img from "../assets/icons/kakao_login_large_wide.png";
import "./styles/Login.css";
import useAuthStore from "../store/useAuthStore";

const Login: React.FC = () => {
  const { isLoggedIn, logout } = useAuthStore(); // Zustand 상태와 액션 가져오기
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // 카카오 로그인 엔드포인트로 리디렉션 (백엔드에서 처리)
    window.location.href = `http://localhost:8080/oauth2/authorization/kakao`;
  };

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

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
        {!isLoggedIn ? (
          <button className="login-button" onClick={handleKakaoLogin}>
            <img
              className="login-button-img"
              src={kakao_login_button_img}
              alt="카카오 로그인 이미지"
            />
          </button>
        ) : (
          <div className="login-oauth-container">
            <p>로그인 정보 : KAKAO ID1234567890</p>
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
            <button className="quit-button">탈퇴하기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
