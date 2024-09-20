import React, { useState, useEffect, useCallback } from "react";
import "./styles/FallingAcorn.css";
import useAuthStore from "../../store/useAuthStore"; // JWT 토큰 가져오기
import axios from "axios";

const FallingAcorn: React.FC = () => {
  const { jwtToken, reissueToken } = useAuthStore(); // Zustand에서 JWT 토큰 가져오기
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number | null>(null); // 서버에서 가져올 최고 점수
  const [acornPosition, setAcornPosition] = useState({ x: 50, y: 0 });
  const [basketPosition, setBasketPosition] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null); // 게임 시작 시간

  const moveBasketLeft = () => {
    setBasketPosition((prev) => Math.max(prev - 5, 0));
  };

  const moveBasketRight = () => {
    setBasketPosition((prev) => Math.min(prev + 5, 90));
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      moveBasketLeft();
    } else if (event.key === "ArrowRight") {
      moveBasketRight();
    }
  }, []);

  // 서버에서 최고 점수를 불러오는 함수
  const fetchHighScore = useCallback(async () => {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}/game/highest-score?gameTypeId=1`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // 토큰 만료 시 재발급 후 재요청
      if (response.status === 401) {
        console.log("토큰이 만료되었습니다. 재발급 시도 중...");
        await reissueToken();
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/game/highest-score?gameTypeId=1`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`, // 재발급된 토큰 사용
            },
          }
        );
      }
      if (response.status === 200) {
        setHighScore(response.data.data.highestScore);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          console.log("게임 로그를 찾을 수 없습니다.");
        } else {
          console.error("최고 점수를 불러오는데 실패했습니다:", error);
        }
      } else {
        console.error("알 수 없는 오류가 발생했습니다:", error);
      }
    }
  }, [jwtToken, reissueToken]);

  // 게임 결과를 서버로 전송하는 함수
  const sendGameResult = useCallback(async () => {
    if (!startTime) return;

    try {
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/game/result`,
        {
          gameId: 1,
          startTime: startTime,
          score: score,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // 토큰 만료 시 재발급 후 재요청
      if (response.status === 401) {
        console.log("토큰이 만료되었습니다. 재발급 시도 중...");
        await reissueToken();
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/game/result`,
          {
            gameId: 1,
            startTime: startTime,
            score: score,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`, // 재발급된 토큰 사용
            },
          }
        );
      }
      if (response.status === 200) {
        const { getAcorns, userAcorns } = response.data.data;
        console.log(`획득한 도토리: ${getAcorns}, 보유 도토리: ${userAcorns}`);
      }
    } catch (error) {
      console.error("게임 결과 전송 중 오류 발생:", error);
    }
  }, [jwtToken, reissueToken, score, startTime]);

  useEffect(() => {
    fetchHighScore();
  }, [fetchHighScore]);

  useEffect(() => {
    if (!gameStarted) return;

    window.addEventListener("keydown", handleKeyPress);

    const fallInterval = setInterval(() => {
      setAcornPosition((prev) => {
        if (prev.y >= 90) {
          if (Math.abs(prev.x - basketPosition) < 15) {
            setScore((prevScore) => prevScore + 1);
          } else {
            setGameOver(true);
            setGameStarted(false);
            sendGameResult(); // 게임 종료 시 결과 전송
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
  }, [basketPosition, gameStarted, sendGameResult]);

  const startGame = () => {
    setScore(0);
    setAcornPosition({ x: 50, y: 0 });
    setGameOver(false);
    setGameStarted(true);
    setStartTime(new Date().toISOString()); // 게임 시작 시간을 기록
  };

  return (
    <div className="falling-acorn-container">
      <h2 className="falling-acorn-title">떨어지는 도토리를 받아받아</h2>
      <div className="falling-acorn">
        <div className="score-board">
          <div>점수 : {score}</div>
          <div>
            최고점수 : {highScore !== null ? highScore : "불러오는 중..."}
          </div>
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
            <div className="mobile-controls">
              <button onClick={moveBasketLeft} className="control-button">
                ←
              </button>
              <button onClick={moveBasketRight} className="control-button">
                →
              </button>
            </div>
          </>
        ) : gameOver ? (
          <div className="game-over">
            <h3 className="game-over-text">게임 오버!</h3>
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
