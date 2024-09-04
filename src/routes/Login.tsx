// src/components/Login.tsx
import React from "react";
import logo from "../assets/icons/logo.png";
import kakao_login_button_img from "../assets/icons/kakao_login_large_wide.png";
import "./styles/Login.css";
import useAuthStore from "../store/useAuthStore";

const Login: React.FC = () => {
  const { login } = useAuthStore();

  // 임시 JWT 토큰 생성 함수
  const generateMockJwtToken = () => {
    // 여기서 임의로 생성된 토큰을 사용합니다. 실제로는 서버로부터 받아야 합니다.
    return "mock-jwt-token-1234";
  };

  const handleLogin = () => {
    const token = generateMockJwtToken();
    login(token); // Zustand 상태에 토큰 저장 및 로그인 처리
    alert("로그인 되었습니다.");
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
        {!login ? (
          <button className="login-button" onClick={handleLogin}>
            <img
              className="login-button-img"
              src={kakao_login_button_img}
              alt="카카오 로그인 이미지"
            />
          </button>
        ) : (
          <p>이미 로그인 되었습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Login;
