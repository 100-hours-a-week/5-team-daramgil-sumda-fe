import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Squirrel.css";

import Acorn_img from "../../assets/acorn.png";
import squirrel from "../../assets/squirrel/기본_다람쥐_lv4-removebg-preview.png";

const Squirrel: React.FC = () => {
  const [level, setLevel] = useState<number>(2);
  const [acorns, setAcorns] = useState<number>(30);
  const [progress, setProgress] = useState<number>(3);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAcorns, setSelectedAcorns] = useState<number>(0);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(false);

  const maxLevels = [10, 20, 30, 40]; // 각 레벨에 필요한 도토리 수

  const handleAcornClick = () => {
    setIsModalOpen(true);
  };

  const handleAcornChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAcorns(Math.min(parseInt(e.target.value), acorns));
  };

  const handleFeedAcorns = () => {
    const newProgress = progress + selectedAcorns;
    if (newProgress >= maxLevels[level - 1]) {
      if (level === 4) {
        // Lv4 도달 시 성장 완료
        setProgress(maxLevels[level - 1]);
      } else {
        // 레벨 업
        setLevel(level + 1);
        setProgress(newProgress - maxLevels[level - 1]);
      }
    } else {
      setProgress(newProgress);
    }
    setAcorns(acorns - selectedAcorns);
    setSelectedAcorns(0);
    setIsModalOpen(false);
  };

  const navigate = useNavigate();
  const handleToGames = () => {
    navigate(`/games`);
  };
  const handleNewSquirrel = () => {
    navigate(`/adopt`);
  };

  const toggleQuestions = () => {
    setIsQuestionsVisible(!isQuestionsVisible);
  };

  return (
    <div className="squirrel-container">
      <div className="level-info">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(progress / maxLevels[level - 1]) * 100}%` }}
          />
        </div>
        <div className="level-text">LV. {level}</div>
      </div>

      <div className="acorn-info">
        <button className="acorn-button" onClick={handleToGames}>
          도토리 주으러 가기
        </button>
        <div className="acorn-count" onClick={handleAcornClick}>
          <img src={Acorn_img} alt="acorn-icon" />
          {acorns}
        </div>
      </div>

      {isModalOpen && (
        <div className="acorn-modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>도토리 주기</h3>
            <p>다람쥐에게 도토리를 주고 성장시키세요.</p>
            <p>보유중인 도토리 {acorns}개</p>
            <input
              type="range"
              min="1"
              max={acorns}
              value={selectedAcorns}
              onChange={handleAcornChange}
            />
            <div>
              {selectedAcorns}/{30}
            </div>
            <button className="acorn-modal-btn" onClick={handleFeedAcorns}>
              도토리 주기
            </button>
          </div>
        </div>
      )}

      <div className="squirrel-section">
        <div className="chat-squirrel">
          <img src={squirrel} alt="chat-squirrel" />
        </div>
        <button className="new-squirrel-button" onClick={handleNewSquirrel}>
          새 다람쥐 분양받기
        </button>
      </div>

      <div className="chat-section">
        <div className="chat-messages">
          <div className="chat-log">
            <div className="message bot">
              안녕하세요! 저는 다람쥐에요. 🐿 대기 오염 정보나 다른 질문이 있으면
              언제든지 물어보세요!
            </div>
            <div className="message user">오늘 대기 오염은 어때?</div>
            <div className="message bot">
              오늘은 공기가 정말 맑고 깨끗해요! 🎉 밖에서 신나게 놀고, 산책도
              하고 피크닉도 해도 좋답니다. 창문도 활짝 열어 신선한 공기를 마음껏
              마셔보세요!
            </div>
          </div>

          <div
            className={`common-questions-container ${
              isQuestionsVisible ? "visible" : ""
            }`}
          >
            <div className="common-questions">
              <div
                className="question"
                onClick={() => console.log("질문 클릭")}
              >
                호흡기 질환이 있는데, 밖에서 운동해도 돼?
              </div>
              <div
                className="question"
                onClick={() => console.log("질문 클릭")}
              >
                창문 열고 환기 시켜도 돼?
              </div>
              <div
                className="question"
                onClick={() => console.log("질문 클릭")}
              >
                오늘 날씨는 어때?
              </div>
              <div
                className="question"
                onClick={() => console.log("질문 클릭")}
              >
                대중교통 이용 시 주의사항
              </div>
              <div
                className="question"
                onClick={() => console.log("질문 클릭")}
              >
                미세먼지에 노출되었을 시 몸에 미치는 영향
              </div>
              <div
                className="question"
                onClick={() => console.log("질문 클릭")}
              >
                오늘 날씨와 대기질 상황을 비유로 표현해줘
              </div>
            </div>
          </div>
          <div className="toggle-button-container">
            <div className="toggle-button" onClick={toggleQuestions}>
              {isQuestionsVisible ? "" : ""}
            </div>
          </div>
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            placeholder="다람쥐에게 전달할 이야기를 적어주세요"
            maxLength={2000}
          />
          <button disabled={false}>보내기</button>
        </div>
      </div>
    </div>
  );
};

export default Squirrel;
