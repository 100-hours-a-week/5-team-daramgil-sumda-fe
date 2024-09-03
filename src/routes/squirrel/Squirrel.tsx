import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Squirrel.css";
import Acorn_img from "../../assets/acorn.png";
import useAuthStore from "../../store/useAuthStore";

interface SquirrelData {
  squirrelId: number;
  type: string;
  level: number;
  feed: number;
  userAcorns: number;
}

const Squirrel: React.FC = () => {
  const { squirrelData, setSquirrelData, jwtToken } = useAuthStore();
  const [progress, setProgress] = useState<number>(squirrelData?.feed || 0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAcorns, setSelectedAcorns] = useState<number>(0);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(false);

  const maxLevels = [10, 20, 30, 40]; // 각 레벨에 필요한 도토리 수

  useEffect(() => {
    if (jwtToken) {
      fetchSquirrelData();
    }
  }, [jwtToken]);

  // API 호출 함수
  const fetchSquirrelData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/squirrel/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("다람쥐 정보를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setSquirrelData(data.data);
      console.log(squirrelData);
      setProgress(data.data.feed);
    } catch (error) {
      console.error("API 호출 에러:", error);
    }
  };

  // 다람쥐 이미지 맵핑 객체를 생성하여 type에 따른 이미지를 설정합니다.
  const squirrelImages: { [type: string]: { [level: number]: string } } = {
    "기본 다람쥐": {
      1: "/squirrels/main/기본_다람쥐_lv1.png", // 기본 다람쥐 레벨 1 이미지 경로
      2: "/squirrels/main/기본_다람쥐_lv2.png", // 기본 다람쥐 레벨 2 이미지 경로
      3: "/squirrels/main/기본_다람쥐_lv3.png", // 기본 다람쥐 레벨 3 이미지 경로
      4: "/squirrels/main/기본_다람쥐_lv4.png", // 기본 다람쥐 레벨 4 이미지 경로
    },
    "사무라이 다람쥐": {
      1: "/squirrels/main/사무라이_다람쥐_lv1-removebg-preview.png",
      2: "/squirrels/main/사무라이_다람쥐_lv2-removebg-preview.png",
      3: "/squirrels/main/사무라이_다람쥐_lv3-removebg-preview.png",
      4: "/squirrels/main/사무라이_다람쥐_lv4-removebg-preview.png",
    },
    "기사 다람쥐": {
      1: "/squirrels/main/기사_다람쥐_lv1-removebg-preview.png",
      2: "/squirrels/main/기사_다람쥐_lv2-removebg-preview.png",
      3: "/squirrels/main/기사_다람쥐_lv3-removebg-preview.png",
      4: "/squirrels/main/기사_다람쥐_lv4-removebg-preview.png",
    },
    "요리사 다람쥐": {
      1: "/squirrels/main/요리사_다람쥐_lv1-removebg-preview.png",
      2: "/squirrels/main/요리사_다람쥐_lv2-removebg-preview.png",
      3: "/squirrels/main/요리사_다람쥐_lv3-removebg-preview.png",
      4: "/squirrels/main/요리사_다람쥐_lv4-removebg-preview.png",
    },
    "파일럿 다람쥐": {
      1: "/squirrels/main/파일럿_다람쥐_lv1-removebg-preview.png",
      2: "/squirrels/main/파일럿_다람쥐_lv2-removebg-preview.png",
      3: "/squirrels/main/파일럿_다람쥐_lv3-removebg-preview.png",
      4: "/squirrels/main/파일럿_다람쥐_lv4-removebg-preview.png",
    },
    "우주비행사 다람쥐": {
      1: "/squirrels/main/우주비행사_다람쥐_lv1-removebg-preview.png",
      2: "/squirrels/main/우주비행사_다람쥐_lv2-removebg-preview.png",
      3: "/squirrels/main/우주비행사_다람쥐_lv3-removebg-preview.png",
      4: "/squirrels/main/우주비행사_다람쥐_lv4-removebg-preview.png",
    },
    "힙합 다람쥐": {
      1: "/squirrels/main/힙합_다람쥐_lv1-removebg-preview.png",
      2: "/squirrels/main/힙합_다람쥐_lv2-removebg-preview.png",
      3: "/squirrels/main/힙합_다람쥐_lv3-removebg-preview.png",
      4: "/squirrels/main/힙합_다람쥐_lv4-removebg-preview.png",
    },
  };

  // squirrelData가 null이 아닐 때, type과 level에 따라 이미지를 선택
  const squirrelImageSrc = squirrelData
    ? squirrelImages[squirrelData.type]?.[squirrelData.level] ||
      "/squirrels/main/기본_다람쥐_lv1.png" // 타입과 레벨에 맞는 이미지, 없으면 기본 이미지
    : "/squirrels/main/기본_다람쥐_lv1.png"; // squirrelData가 null인 경우 기본 이미지

  const handleAcornClick = () => {
    setIsModalOpen(true);
  };

  const handleAcornChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAcorns(
      Math.min(parseInt(e.target.value), squirrelData?.userAcorns || 0)
    );
  };

  const handleFeedAcorns = async () => {
    if (!squirrelData || selectedAcorns <= 0) return;
    try {
      // 도토리 주기 API 호출
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/squirrel/feed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ acorns: selectedAcorns }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "도토리 주기 실패");
      }
      const data = await response.json();
      // 서버 응답에 따라 Zustand 상태 업데이트
      setSquirrelData({
        ...squirrelData,
        userAcorns: data.data.userAcorns,
        type: data.data.type,
        level: data.data.level,
        feed: data.data.ateAcorns,
      });

      setProgress(data.data.ateAcorns);
      alert("도토리를 성공적으로 줬습니다!");
    } catch (error: any) {
      alert(error.message);
      console.error("도토리 주기 에러:", error);
    } finally {
      setSelectedAcorns(0);
      setIsModalOpen(false);
    }
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

  if (!squirrelData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="squirrel-container">
      <div className="level-info">
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(progress / maxLevels[squirrelData.level - 1]) * 100}%`,
            }}
          />
        </div>
        <div className="level-text">LV. {squirrelData.level}</div>
      </div>

      <div className="acorn-info">
        <button className="acorn-button" onClick={handleToGames}>
          도토리 주으러 가기
        </button>
        <div className="acorn-count" onClick={handleAcornClick}>
          <img src={Acorn_img} alt="acorn-icon" />
          {squirrelData.userAcorns}
        </div>
      </div>

      {isModalOpen && (
        <div className="acorn-modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>도토리 주기</h3>
            <p>다람쥐에게 도토리를 주고 성장시키세요.</p>
            <p>보유중인 도토리 {squirrelData.userAcorns}개</p>
            <input
              type="range"
              min="1"
              max={squirrelData.userAcorns}
              value={selectedAcorns}
              onChange={handleAcornChange}
            />
            <div>
              {selectedAcorns}/{maxLevels[squirrelData.level - 1]}
            </div>
            <button className="acorn-modal-btn" onClick={handleFeedAcorns}>
              도토리 주기
            </button>
          </div>
        </div>
      )}

      <div className="squirrel-section">
        <div className="chat-squirrel">
          <img src={squirrelImageSrc} alt="chat-squirrel" />
        </div>
        {squirrelData.level === 4 && squirrelData.feed >= 100 && (
          <button className="new-squirrel-button" onClick={handleNewSquirrel}>
            새 다람쥐 분양받기
          </button>
        )}
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
