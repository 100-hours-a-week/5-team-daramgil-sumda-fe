import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Squirrel.css";
import Acorn_img from "../../assets/acorn.png";
import useAuthStore from "../../store/useAuthStore";
import useMissionStore from "../../store/useMissionStore";
import LocationDropdown from "../../components/LocationDropdown";
import { FaArrowUp } from "react-icons/fa6";
interface SquirrelData {
  squirrelId: number;
  type: string;
  level: number;
  feed: number;
  userAcorns: number;
}
interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}
const Squirrel: React.FC = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const { squirrelData, setSquirrelData, jwtToken } = useAuthStore.getState();
  const [progress, setProgress] = useState<number>(squirrelData?.feed || 0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAcorns, setSelectedAcorns] = useState<number>(0);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(false);
  const [id, setId] = useState<number>(1);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      sender: "bot",
      message:
        "안녕하세요! 저는 다람쥐에요. 대기 오염 정보나 다른 질문이 있으면 언제든지 물어보세요!",
    },
  ]);
  const maxLevels = [10, 20, 30, 40]; // 각 레벨에 필요한 도토리 수
  const { completeSquirrelChatMission } = useMissionStore(); // 다람쥐와 대화 미션
  const [hasCompletedChat, setHasCompletedChat] = useState<boolean>(false); // 대화 완료 여부 상태

  // 다람쥐 이미지 맵핑 객체를 생성하여 type에 따른 이미지
  const squirrelImages: { [type: string]: { [level: number]: string } } = {
    "기본 다람쥐": {
      1: "/squirrels/main/기본-다람쥐-lv1.png",
      2: "/squirrels/main/기본-다람쥐-lv2.png",
      3: "/squirrels/main/기본-다람쥐-lv3.png",
      4: "/squirrels/main/기본-다람쥐-lv4.png",
    },
    "사무라이 다람쥐": {
      1: "/squirrels/main/사무라이-다람쥐-lv1.png",
      2: "/squirrels/main/사무라이-다람쥐-lv2.png",
      3: "/squirrels/main/사무라이-다람쥐-lv3.png",
      4: "/squirrels/main/사무라이-다람쥐-lv4.png",
    },
    "기사 다람쥐": {
      1: "/squirrels/main/기사-다람쥐-lv1.png",
      2: "/squirrels/main/기사-다람쥐-lv2.png",
      3: "/squirrels/main/기사-다람쥐-lv3.png",
      4: "/squirrels/main/기사-다람쥐-lv4.png",
    },
    "요리사 다람쥐": {
      1: "/squirrels/main/요리사-다람쥐-lv1.png",
      2: "/squirrels/main/요리사-다람쥐-lv2.png",
      3: "/squirrels/main/요리사-다람쥐-lv3.png",
      4: "/squirrels/main/요리사-다람쥐-lv4.png",
    },
    "파일럿 다람쥐": {
      1: "/squirrels/main/파일럿-다람쥐-lv1.png",
      2: "/squirrels/main/파일럿-다람쥐-lv2.png",
      3: "/squirrels/main/파일럿-다람쥐-lv3.png",
      4: "/squirrels/main/파일럿-다람쥐-lv4.png",
    },
    "우주비행사 다람쥐": {
      1: "/squirrels/main/우주비행사-다람쥐-lv1.png",
      2: "/squirrels/main/우주비행사-다람쥐-lv2.png",
      3: "/squirrels/main/우주비행사-다람쥐-lv3.png",
      4: "/squirrels/main/우주비행사-다람쥐-lv4.png",
    },
    "힙합 다람쥐": {
      1: "/squirrels/main/힙합-다람쥐-lv1.png",
      2: "/squirrels/main/힙합-다람쥐-lv2.png",
      3: "/squirrels/main/힙합-다람쥐-lv3.png",
      4: "/squirrels/main/힙합-다람쥐-lv4.png",
    },
  };
  // 위치 선택 핸들러
  const handleLocationSelect = (location: string, id: number) => {
    setId(id); // 선택된 위치의 ID 설정
  };
  // 위치 ID가 변경될 때마다 날씨 및 대기질 데이터를 가져옴
  useEffect(() => {
    if (id) {
      fetchWeatherData(id);
      fetchAirQualityData(id);
    }
  }, [id]);

  useEffect(() => {
    fetchSquirrelData();
  }, []);
  const handleSendMessage = async (message?: string) => {
    const question = message || inputMessage.trim();
    if (!question) return;
    // 사용자 질문 추가
    setChatLog((prev) => [...prev, { sender: "user", message: question }]);
    // 질문을 포함한 데이터를 API에 전송
    const payload = {
      air_quality: airQualityData,
      weather: weatherData,
      question: question,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("응답을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      const answer = data.data.answer;
      // API 응답으로 받은 답변을 채팅 로그에 추가
      setChatLog((prev) => [...prev, { sender: "bot", message: answer }]);
      // 대화 미션을 완료하지 않았다면, 완료 처리
      if (!hasCompletedChat) {
        await completeSquirrelChatMission();
        setHasCompletedChat(true); // 대화 미션 완료 상태 업데이트
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    // 입력 필드 초기화
    setInputMessage("");
  };

  // useEffect(() => {
  //   if (weatherData) {
  //     console.log("Weather data updated:", weatherData);
  //   }
  // }, [weatherData]);

  // useEffect(() => {
  //   if (airQualityData) {
  //     console.log("Air quality data updated:", airQualityData);
  //   }
  // }, [airQualityData]);
  // 날씨 데이터를 가져오는 함수
  const fetchWeatherData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/acweather?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data.weatherDataJson); // 날씨 데이터 설정
      } else {
        console.error("날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  // 대기질 데이터를 가져오는 함수
  const fetchAirQualityData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAirQualityData(data.data); // 대기질 데이터 설정
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // API 호출 함수
  const fetchSquirrelData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/squirrel/`,
        {
          method: "GET",
          credentials: "include", // 쿠키를 요청에 포함
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
    <div className="squirrel-page">
      <div className="squirrel-container">
        <LocationDropdown onLocationSelect={handleLocationSelect} />
        <div className="level-info">
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${
                  (progress / maxLevels[squirrelData.level - 1]) * 100
                }%`,
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
              {chatLog.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.message}
                </div>
              ))}
            </div>

            <div
              className={`common-questions-container ${
                isQuestionsVisible ? "visible" : ""
              }`}
            >
              <div className="toggle-button" onClick={toggleQuestions}>
                {isQuestionsVisible ? "" : ""}
              </div>
              <div className="common-questions">
                <div
                  className="question"
                  onClick={() => {
                    toggleQuestions();
                    handleSendMessage(
                      "호흡기 질환이 있는데, 밖에서 운동해도 돼?"
                    );
                  }}
                >
                  호흡기 질환이 있는데, 밖에서 운동해도 돼?
                </div>
                <div
                  className="question"
                  onClick={() => {
                    toggleQuestions();
                    handleSendMessage("창문 열고 환기 시켜도 돼?");
                  }}
                >
                  창문 열고 환기 시켜도 돼?
                </div>
                <div
                  className="question"
                  onClick={() => {
                    toggleQuestions();
                    handleSendMessage("오늘 날씨는 어때?");
                  }}
                >
                  오늘 날씨는 어때?
                </div>
                <div
                  className="question"
                  onClick={() => {
                    toggleQuestions();
                    handleSendMessage("대중교통 이용 시 주의사항");
                  }}
                >
                  대중교통 이용 시 주의사항
                </div>
                <div
                  className="question"
                  onClick={() => {
                    toggleQuestions();
                    handleSendMessage(
                      "미세먼지에 노출되었을 시 몸에 미치는 영향"
                    );
                  }}
                >
                  미세먼지에 노출되었을 시 몸에 미치는 영향
                </div>
                <div
                  className="question"
                  onClick={() => {
                    toggleQuestions();
                    handleSendMessage(
                      "오늘 날씨와 대기질 상황을 비유로 표현해줘"
                    );
                  }}
                >
                  오늘 날씨와 대기질 상황을 비유로 표현해줘
                </div>
              </div>
            </div>
            <div className="toggle-button-container">
              <div className="chat-input-container">
                <input
                  type="text"
                  placeholder="다람쥐에게 질문을 해보세요"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  maxLength={2000}
                />
                <button onClick={() => handleSendMessage()}>
                  <FaArrowUp />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squirrel;
