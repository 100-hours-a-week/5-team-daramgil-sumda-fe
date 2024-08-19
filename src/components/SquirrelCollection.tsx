import React from "react";
import "./styles/SquirrelCollection.css";

import pedestal from "../assets/pedestal.png";

const squirrelData = [
  {
    id: 1,
    name: "사무라이 다람쥐",
    image: "/squirrels/main/사무라이_다람쥐_lv4-removebg-preview.png",
    adoptDate: "2024.03.25",
    independenceDate: "2024.04.03",
  },
  {
    id: 2,
    name: "파일럿 다람쥐",
    image: "/squirrels/main/파일럿_다람쥐_lv4-removebg-preview.png",
    adoptDate: "2024.01.25",
    independenceDate: "2024.02.03",
  },
  {
    id: 3,
    name: "기사 다람쥐",
    image: "/squirrels/main/기사_다람쥐_lv4-removebg-preview.png",
    adoptDate: "2024.01.25",
    independenceDate: "2024.02.03",
  },
  {
    id: 4,
    name: "힙합 다람쥐",
    image: "/squirrels/main/힙합_다람쥐_lv4-removebg-preview.png",
    adoptDate: "2024.01.25",
    independenceDate: "2024.02.03",
  },
  {
    id: 5,
    name: "우주비행사 다람쥐",
    image: "/squirrels/main/우주비행사_다람쥐_lv4-removebg-preview.png",
    adoptDate: "2024.01.25",
    independenceDate: "2024.02.03",
  },
  {
    id: 6,
    name: "요리시 다람쥐",
    image: "/squirrels/main/요리사_다람쥐_lv4-removebg-preview.png",
    adoptDate: "2024.01.25",
    independenceDate: "2024.02.03",
  },
  // 추가 다람쥐 데이터를 여기에 추가할 수 있습니다.
];

const SquirrelCollection: React.FC = () => {
  return (
    <div className="squirrel-collection">
      {squirrelData.map((squirrel) => (
        <div key={squirrel.id} className="squirrel-item">
          <div className="image-container">
            <img src={pedestal} alt="단상" className="pedestal" />
            <img
              src={squirrel.image}
              alt={squirrel.name}
              className="squirrel"
            />
          </div>
          <p className="squirrel-name">{squirrel.name}</p>
          <p className="squirrel-date">분양 날짜 : {squirrel.adoptDate}</p>
          <p className="squirrel-date">
            독립 날짜 : {squirrel.independenceDate}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SquirrelCollection;
