import React, { useState } from "react";
import "./styles/Adopt.css";

const Adopt: React.FC = () => {
  const [selectedSquirrel, setSelectedSquirrel] = useState<string | null>(null);

  const squirrels = [
    {
      id: 1,
      name: "요리사 다람쥐",
      img: "/squirrels/main/요리사_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 2,
      name: "기사 다람쥐",
      img: "/squirrels/main/기사_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 3,
      name: "파일럿 다람쥐",
      img: "/squirrels/main/파일럿_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 4,
      name: "사무라이 다람쥐",
      img: "/squirrels/main/사무라이_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 5,
      name: "우주비행사 다람쥐",
      img: "/squirrels/main/우주비행사_다람쥐_lv1-removebg-preview.png",
    },
    {
      id: 6,
      name: "힙합 다람쥐",
      img: "/squirrels/main/힙합_다람쥐_lv1-removebg-preview.png",
    },
  ];

  const handleSquirrelSelect = (name: string) => {
    setSelectedSquirrel(name === selectedSquirrel ? null : name);
  };

  const handleComplete = () => {
    if (selectedSquirrel) {
      alert(`선택된 다람쥐: ${selectedSquirrel}`);
      // 여기서 기존 다람쥐를 컬렉션으로 이동시키고, 새로운 다람쥐로 교체하는 로직 추가
    } else {
      alert("다람쥐를 선택해주세요.");
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
              selectedSquirrel === squirrel.name ? "selected" : "dimmed"
            }`}
            onClick={() => handleSquirrelSelect(squirrel.name)}
          >
            <img
              src={squirrel.img}
              alt={squirrel.name}
              className="squirrel-image"
            />
            <p className="squirrel-name">{squirrel.name}</p>
            {selectedSquirrel === squirrel.name && (
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
