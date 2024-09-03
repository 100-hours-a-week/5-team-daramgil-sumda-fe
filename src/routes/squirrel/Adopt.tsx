import React, { useState } from "react";
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
  const { jwtToken, setSquirrelData } = useAuthStore(); // Zustand에서 jwtToken과 setSquirrelData 가져오기
  const [selectedSquirrel, setSelectedSquirrel] = useState<string | null>(null);

  const squirrels = [
    {
      id: 1,
      type: "요리사 다람쥐",
      img: "/squirrels/main/요리사_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 2,
      type: "기사 다람쥐",
      img: "/squirrels/main/기사_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 3,
      type: "파일럿 다람쥐",
      img: "/squirrels/main/파일럿_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 4,
      type: "사무라이 다람쥐",
      img: "/squirrels/main/사무라이_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 5,
      type: "우주비행사 다람쥐",
      img: "/squirrels/main/우주비행사_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 6,
      type: "힙합 다람쥐",
      img: "/squirrels/main/힙합_다람쥐_lv1-removebg-preview.png",
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
      const response = await fetch(
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
