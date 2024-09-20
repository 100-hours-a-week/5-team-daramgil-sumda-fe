import React, { useState, useEffect } from "react";
import "./styles/OX.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore"; // Auth 상태를 사용하기 위해 import

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

  const { jwtToken, reissueToken, isLoggedIn } = useAuthStore(); // Zustand에서 auth 관련 정보 가져오기

  useEffect(() => {
    const fetchQuizData = async () => {
      // 로그인 확인
      if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/oxgames`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰 포함
            "Content-Type": "application/json",
          },
        });

        // 토큰 만료 시 토큰 재발급 요청 후 다시 시도
        if (response.status === 401) {
          await reissueToken();
          const { jwtToken: newToken } = useAuthStore.getState(); // 새로운 토큰 가져오기
          response = await fetch(`${process.env.REACT_APP_API_URL}/oxgames`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newToken}`, // 재발급된 토큰 사용
              "Content-Type": "application/json",
            },
          });
        }

        const data = await response.json();
        setCurrentQuestion(data); // 퀴즈 데이터를 설정
        setLoading(false);
      } catch (error) {
        console.error("퀴즈 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchQuizData(); // 페이지가 로드될 때 퀴즈 데이터를 먼저 가져옴
  }, [jwtToken, isLoggedIn, navigate, reissueToken]);

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
    <div className="ox-quiz-page">
      <div className="ox-quiz-container">
        <h2 className="quiz-title">OX 퀴즈</h2>
        <p className="quiz-description">
          OX 퀴즈를 맞추고 도토리를 받아가세요!
        </p>
        {currentQuestion && (
          <div className="quiz-section">
            <div className="quiz-question">{currentQuestion.question}</div>
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
        )}
      </div>
    </div>
  );
};

export default OX;
