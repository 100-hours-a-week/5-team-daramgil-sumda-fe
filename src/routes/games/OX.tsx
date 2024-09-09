import React, { useState, useEffect } from "react";
import "./styles/OX.css";
import { useNavigate } from "react-router-dom";
import useMissionStore from "../../store/useMissionStore"; // Mission Store 사용

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
  const { completeDailyQuiz } = useMissionStore(); // OX퀴즈 관련 미션 함수 불러오기

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/oxgames`
        );
        const data = await response.json();
        setCurrentQuestion(data); // 퀴즈 데이터를 설정
        setLoading(false);
        // 퀴즈 데이터를 불러온 후, 미션 완료 여부를 체크
        checkQuizMissionStatus();
      } catch (error) {
        console.error("퀴즈 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    const checkQuizMissionStatus = async () => {
      try {
        // OX 퀴즈 미션을 완료했는지 확인
        await completeDailyQuiz();
        // 만약 퀴즈가 이미 완료된 경우라면, 에러가 발생하며 해당 메시지를 표시하고 이전 페이지로 이동
        alert(
          "오늘은 이미 OX 퀴즈를 통해 도토리를 주웠네요. 내일 다시 참여해주세요."
        );
        navigate(-1); // 이전 페이지로 이동
      } catch (error) {
        // 미션이 완료되지 않은 경우 퀴즈를 계속 진행
        console.log(
          "퀴즈 미션을 아직 완료하지 않았습니다. 계속 진행 가능합니다."
        );
      }
    };

    fetchQuizData(); // 페이지가 로드될 때 퀴즈 데이터를 먼저 가져옴
  }, [completeDailyQuiz, navigate]);

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
