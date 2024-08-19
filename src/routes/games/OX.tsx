import React, { useState } from "react";
import "./styles/OX.css";
import { useNavigate } from "react-router-dom";

const OX: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      alert(`선택한 답: ${selectedOption}`);
      navigate(`/games/answer`);
    } else {
      alert("답을 선택해주세요.");
    }
  };
  return (
    <div className="ox-quiz-container">
      <h2 className="quiz-title">OX 퀴즈</h2>
      <p className="quiz-description">OX 퀴즈를 맞추고 도토리를 받아가세요!</p>
      <p className="quiz-question">
        Q. 미세먼지 발생 수준이 나쁘면 환기를 하지 않는 게 좋다?
      </p>
      <div className="options-container">
        <button
          className={`option-button ${
            selectedOption === "O" ? "selected-blue" : ""
          }`}
          onClick={() => handleOptionClick("O")}
        >
          O
        </button>
        <button
          className={`option-button ${
            selectedOption === "X" ? "selected-red" : ""
          }`}
          onClick={() => handleOptionClick("X")}
        >
          X
        </button>
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        제출하기
      </button>
    </div>
  );
};

export default OX;
