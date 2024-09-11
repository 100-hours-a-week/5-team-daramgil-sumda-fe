import React, { useEffect } from "react";
import "./styles/Answer.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useMissionStore from "../../store/useMissionStore";

const Answer: React.FC = () => {
  const { completeDailyQuiz } = useMissionStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { correctAnswer, explanation, selectedOption } = location.state || {};

  useEffect(() => {
    // OX 퀴즈 미션 완료 처리 호출
    const checkDailyQuiz = async () => {
      try {
        await completeDailyQuiz();
        toast.success("OX퀴즈 미션을 완료했습니다. 도토리 1개가 지급됩니다.");
      } catch (error) {
        // error가 unknown 타입이므로 명시적으로 처리
        if (error instanceof Error) {
          if (error.message.includes("이미 완료된 미션")) {
            toast.info(
              "오늘은 이미 OX 퀴즈를 통해 도토리를 주웠네요 내일 참여해주세요"
            );
          } else {
            toast.error("OX퀴즈 미션 처리 중 오류가 발생했습니다.");
          }
        } else {
          toast.error("알 수 없는 오류가 발생했습니다.");
        }
      }
    };

    checkDailyQuiz();
  }, [completeDailyQuiz]);

  const handleSubmit = () => {
    navigate(`/daily`);
  };

  return (
    <div className="answer-container">
      <h2 className="answer-title">OX 퀴즈</h2>

      <div className="correct-answer-section">
        <p className="correct-answer-text">정답은...</p>
        <div
          className={`correct-answer-box ${
            selectedOption === correctAnswer ? "correct" : "wrong"
          }`}
        >
          {correctAnswer === selectedOption ? "정답입니다!" : "틀렸습니다!"}
        </div>
      </div>

      <div className="explanation-section">
        <p className="explanation-text">{explanation}</p>
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
