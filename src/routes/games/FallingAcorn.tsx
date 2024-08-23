import React, { useState, useEffect, useCallback } from "react";
import "./styles/FallingAcorn.css";

const FallingAcorn: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [acornPosition, setAcornPosition] = useState({ x: 50, y: 0 });
  const [basketPosition, setBasketPosition] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && basketPosition > 0) {
        setBasketPosition((prev) => Math.max(prev - 5, 0));
      } else if (event.key === "ArrowRight" && basketPosition < 90) {
        setBasketPosition((prev) => Math.min(prev + 5, 90));
      }
    },
    [basketPosition]
  );

  useEffect(() => {
    if (!gameStarted) return;

    window.addEventListener("keydown", handleKeyPress);

    const fallInterval = setInterval(() => {
      setAcornPosition((prev) => {
        if (prev.y >= 90) {
          // 바구니의 양옆을 더 넓게 판정
          if (Math.abs(prev.x - basketPosition) < 10) {
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem("highScore", newScore.toString());
              }
              return newScore;
            });
          } else {
            setGameOver(true);
            setGameStarted(false);
          }
          return { x: Math.random() * 90, y: 0 };
        }
        return { ...prev, y: prev.y + 5 };
      });
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(fallInterval);
    };
  }, [basketPosition, highScore, gameStarted, gameOver]);

  const startGame = () => {
    setScore(0);
    setAcornPosition({ x: 50, y: 0 });
    setGameOver(false);
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
        ) : gameOver ? (
          <div className="game-over">
            <h3>게임 오버!</h3>
            <button onClick={startGame} className="restart-button">
              다시 시작
            </button>
          </div>
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
