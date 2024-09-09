import React, { useState, useEffect } from "react";
import "./styles/OX.css";
import { useNavigate } from "react-router-dom";
import quizData from "./quizData.json"; // JSON 파일을 가져옵니다.

const OX: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    answer: string;
    explanation: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 랜덤으로 질문을 선택
    const randomIndex = Math.floor(Math.random() * quizData.length);
    setCurrentQuestion(quizData[randomIndex]);
  }, []);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption && currentQuestion) {
      if (selectedOption === currentQuestion.answer) {
        alert("정답입니다!");
      } else {
        alert("틀렸습니다!");
      }
      navigate(`/games/answer`, {
        state: {
          correctAnswer: currentQuestion.answer,
          explanation: currentQuestion.explanation,
        },
      });
    } else {
      alert("답을 선택해주세요.");
    }
  };

  return (
    <div className="ox-quiz-container">
      <h2 className="quiz-title">OX 퀴즈</h2>
      <p className="quiz-description">OX 퀴즈를 맞추고 도토리를 받아가세요!</p>
      {currentQuestion && (
        <>
          <p className="quiz-question">Q. {currentQuestion.question}</p>
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
        </>
      )}
    </div>
  );
};

export default OX;
