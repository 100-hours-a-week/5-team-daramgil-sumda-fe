import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UnderConstruction.css";

const Setting: React.FC = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };
  return (
    <div className="construction-container">
      <div className="construction-title">페이지 준비 중입니다.</div>
      <div className="construction-section">
        <p>더 나은 서비스를 위해 준비 중입니다.</p>
        <p>아래 버튼을 누르시면 메인 페이지로 이동합니다.</p>
        <button className="construction-button" onClick={goToHome}>
          메인 페이지로 이동
        </button>
      </div>
    </div>
  );
};

export default Setting;
