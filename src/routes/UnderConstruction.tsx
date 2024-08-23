import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UnderConstruction.css";

const Setting: React.FC = () => {
  const navigate = useNavigate();
  const confirm = () => {
    navigate("/");
  };
  return (
    <div className="construction-container">
      <div className="construction-title">구현 중인 페이지입니다.</div>
      <div className="construction-section">
        <p>현재 기능 구현 중에 있습니다.</p>
        <p>아래 버튼을 누르시면 메인 페이지로 돌아갑니다.</p>
        <button className="construction-button" onClick={confirm}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Setting;
