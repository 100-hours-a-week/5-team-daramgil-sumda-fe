import React, { useState, useEffect } from "react";
import "./styles/FallingAcorn.css";

const FallingAcorn: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [acornPosition, setAcornPosition] = useState({ x: 50, y: 0 });
  const [basketPosition, setBasketPosition] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  console.log(process.env.REACT_APP_API_URL);

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && basketPosition > 0) {
        setBasketPosition(basketPosition - 5);
      } else if (event.key === "ArrowRight" && basketPosition < 90) {
        setBasketPosition(basketPosition + 5);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const fallInterval = setInterval(() => {
      setAcornPosition((prev) => {
        if (prev.y >= 90) {
          if (Math.abs(prev.x - basketPosition) < 10) {
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
              }
              return newScore;
            });
          }
          return { x: Math.random() * 90, y: 0 };
        }
        return { ...prev, y: prev.y + 15 };
      });
    }, 200);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(fallInterval);
    };
  }, [basketPosition, highScore, gameStarted]);

  const startGame = () => {
    setScore(0);
    setAcornPosition({ x: 50, y: 0 });
    setGameStarted(true);
  };

  return (
    <div className="falling-acorn-container">
      <h2 className="falling-acorn-title">떨어지는 도토리를 받아받아</h2>
      <div className="falling-acorn">
        <div className="score-board">
          <div>점수 : {score}</div>
          <div>최고점수 : {highScore}</div>
        </div>
        {gameStarted ? (
          <>
            <div
              className="acorn"
              style={{
                left: `${acornPosition.x}%`,
                top: `${acornPosition.y}%`,
              }}
            />
            <div className="basket" style={{ left: `${basketPosition}%` }} />
          </>
        ) : (
          <button onClick={startGame} className="start-button">
            게임 시작
          </button>
        )}
      </div>
    </div>
  );
};

export default FallingAcorn;
