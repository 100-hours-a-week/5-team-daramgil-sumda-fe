import React, { useState } from "react";
import "./styles/Answer.css";
import { useNavigate } from "react-router-dom";

const Answer: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/daily`);
  };
  return (
    <div className="answer-container">
      <h2 className="answer-title">OX 퀴즈</h2>

      <div className="correct-answer-section">
        <p className="correct-answer-text">정답은...</p>
        <div className="correct-answer-box">O</div>
      </div>

      <div className="explanation-section">
        <p className="explanation-text">
          환기를 하지 않으면 이산화탄소, 포름알데히드, 라돈 등 오염물질이
          축적되어 실외 공기질보다 실내 공기질이 더욱 나빠집니다.
        </p>
      </div>

      <div className="reward-section">
        <p className="reward-text">OX 퀴즈 참가 완료! 도토리를 주웠어요!</p>
      </div>

      <button className="confirm-button" onClick={handleSubmit}>
        확인
      </button>
    </div>
  );
};

export default Answer;
