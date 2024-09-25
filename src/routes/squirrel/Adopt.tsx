import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Adopt.css";
import useAuthStore from "../../store/useAuthStore"; // Zustand store import

interface SquirrelData {
  squirrelId: number; // squirrelId 추가
  type: string;
  level: number;
  feed: number;
  userAcorns: number;
}

const Adopt: React.FC = () => {
  const { jwtToken, reissueToken, setSquirrelData } = useAuthStore();
  const [selectedSquirrel, setSelectedSquirrel] = useState<string | null>(null);
  const navigate = useNavigate();
  const squirrels = [
    {
      id: 1,
      type: "요리사 다람쥐",
      img: "/squirrels/main/요리사-다람쥐-lv1.png",
    },
    {
      id: 2,
      type: "기사 다람쥐",
      img: "/squirrels/main/기사-다람쥐-lv1.png",
    },
    {
      id: 3,
      type: "파일럿 다람쥐",
      img: "/squirrels/main/파일럿-다람쥐-lv1.png",
    },
    {
      id: 4,
      type: "사무라이 다람쥐",
      img: "/squirrels/main/사무라이-다람쥐-lv1.png",
    },
    {
      id: 5,
      type: "우주비행사 다람쥐",
      img: "/squirrels/main/우주비행사-다람쥐-lv1.png",
    },
    {
      id: 6,
      type: "힙합 다람쥐",
      img: "/squirrels/main/힙합-다람쥐-lv1.png",
    },
  ];

  const handleSquirrelSelect = (name: string) => {
    setSelectedSquirrel(name === selectedSquirrel ? null : name);
  };

  const handleComplete = async () => {
    if (!selectedSquirrel) {
      alert("다람쥐를 선택해주세요.");
      return;
    }

    try {
      let response = await fetch(
        `${process.env.REACT_APP_API_URL}/squirrel/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sqrType: selectedSquirrel }), // 선택된 다람쥐 종류를 전송
        }
      );
      // 토큰이 만료된 경우
      if (response.status === 401) {
        await reissueToken(); // 토큰 재발급 요청
        // 재발급 후 요청을 다시 시도
        response = await fetch(
          `${process.env.REACT_APP_API_URL}/squirrel/new`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`, // 재발급 받은 토큰으로 재시도
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sqrType: selectedSquirrel }),
          }
        );
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "다람쥐 분양에 실패했습니다.");
      }
      const data = await response.json();
      // squirrelId가 서버 응답에 포함되어 있지 않은 경우 임시 ID를 생성
      setSquirrelData({
        squirrelId: data.data.squirrelId || 0, // squirrelId가 제공되면 사용, 아니면 0
        type: data.data.type,
        level: data.data.level,
        feed: data.data.feed,
        userAcorns: 0, // 초기값 설정
      });
      alert(`새로운 다람쥐가 분양되었습니다: ${data.data.type}`);
      navigate(`/squirrel`);
    } catch (error: any) {
      alert(error.message);
      console.error("다람쥐 분양 에러:", error);
    }
  };

  return (
    <div className="adopt-container">
      <h2 className="adopt-title">새로운 다람쥐 고르기</h2>
      <div className="squirrel-selection-container">
        {squirrels.map((squirrel) => (
          <div
            key={squirrel.id}
            className={`squirrel-item ${
              selectedSquirrel === squirrel.type ? "selected" : "dimmed"
            }`}
            onClick={() => handleSquirrelSelect(squirrel.type)}
          >
            <img
              src={squirrel.img}
              alt={squirrel.type}
              className="squirrel-image"
            />
            <p className="squirrel-name">{squirrel.type}</p>
            {selectedSquirrel === squirrel.type && (
              <div className="selection-overlay"></div>
            )}
          </div>
        ))}
      </div>
      <button
        className="complete-button"
        onClick={handleComplete}
        disabled={!selectedSquirrel}
      >
        완료
      </button>
    </div>
  );
};

export default Adopt;
