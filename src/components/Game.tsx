import React from "react";
import "./styles/Game.css";

interface GameProps {
  title: string;
  thumbnailUrl: string;
}

const Game: React.FC<GameProps> = ({ title, thumbnailUrl }) => {
  return (
    <div className="game-container">
      <div className="game-title-container">
        <p className="game-title-text">{title}</p>
      </div>
      <div className="game-thumbnail-container">
        <img
          className="game-thumbnail-img"
          src={thumbnailUrl}
          alt={`${title} 썸네일`}
        />
      </div>
      <div className="game-button-container">
        <button className="game-button">게임하러 가기</button>
      </div>
    </div>
  );
};

export default Game;
