import React from "react";
import "./styles/FallingAcorn.css";

const FallingAcorn: React.FC = () => {
  return (
    <div className="falling-acorn-container">
      <h2 className="falling-acorn-title">
        떨어지는 도토리를
        <br />
        받아받아
      </h2>
      <div className="falling-acorn">{/*이곳에 게임 환경 추가 */}</div>
    </div>
  );
};

export default FallingAcorn;
