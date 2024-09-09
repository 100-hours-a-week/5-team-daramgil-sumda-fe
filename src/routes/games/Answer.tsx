import React, { useEffect } from "react";
import "./styles/Answer.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useMissionStore from "../../store/useMissionStore";

const Answer: React.FC = () => {
  const { completeDailyQuiz } = useMissionStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { correctAnswer, explanation } = location.state || {};

  useEffect(() => {
    // 컴포넌트 마운트 시 출석 체크 호출
    const checkAttendance = async () => {
      try {
        await completeDailyQuiz();
        toast.success("OX퀴즈 미션을 완료했습니다. 도토리 1개가 지급됩니다.");
      } catch (error) {
        toast.error("이미 완료된 미션입니다."); // 에러 시 처리
      }
    };

    checkAttendance();
  }, [completeDailyQuiz]);

  const handleSubmit = () => {
    navigate(`/daily`);
  };

  return (
    <div className="answer-container">
      <h2 className="answer-title">OX 퀴즈</h2>

      <div className="correct-answer-section">
        <p className="correct-answer-text">정답은...</p>
        <div className="correct-answer-box">{correctAnswer}</div>
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
