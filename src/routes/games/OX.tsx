import React, { useState, useEffect } from "react";
import "./styles/OX.css";
import { useNavigate } from "react-router-dom";

const OX: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    id: number;
    question: string;
    answer: string;
    explanation: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/oxgames`
        );
        const data = await response.json();
        setCurrentQuestion(data); // 퀴즈 데이터를 설정
        setLoading(false);
      } catch (error) {
        console.error("퀴즈 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchQuizData(); // 페이지가 로드될 때 퀴즈 데이터를 먼저 가져옴
  }, []);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption && currentQuestion) {
      // 정답 여부와 설명을 props로 `Answer` 컴포넌트로 전달
      navigate(`/games/answer`, {
        state: {
          selectedOption, // 사용자가 선택한 답
          correctAnswer: currentQuestion.answer, // 정답
          explanation: currentQuestion.explanation, // 설명
        },
      });
    } else {
      alert("답을 선택해주세요.");
    }
  };

  if (loading) {
    return <div>퀴즈 데이터를 불러오는 중입니다...</div>;
  }

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
