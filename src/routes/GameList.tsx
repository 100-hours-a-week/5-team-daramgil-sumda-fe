import React from "react";
import Game from "../components/Game"; // Game 컴포넌트 import
import "./styles/GameList.css";

const GameList: React.FC = () => {
  const dummyGames = [
    { title: "OX 퀴즈", thumbnailUrl: "https://via.placeholder.com/150" },
    {
      title: "떨어지는 도토리를 받아받아",
      thumbnailUrl: "https://via.placeholder.com/150",
    },
    {
      title: "도토리를 들고 점프점프",
      thumbnailUrl: "https://via.placeholder.com/150",
    },
    {
      title: "나무에 있는 도토리를 떨어뜨려요",
      thumbnailUrl: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="gamelist-container">
      <h2 className="title">도토리 주으러가기</h2>
      <div className="game-items">
        {dummyGames.map((game, index) => (
          <Game
            key={index}
            title={game.title}
            thumbnailUrl={game.thumbnailUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default GameList;
