import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./styles/DailyMission.css";
import Acorn_img from "../../assets/acorn.png";
import Check_img from "../../assets/check.png";
import { FaCheck } from "react-icons/fa";

import useAuthStore from "../../store/useAuthStore"; // Zustand에서 JWT 토큰 가져오기

interface MissionData {
  attendance: boolean;
  checkAir: boolean;
  talkWithSquirrel: boolean;
  quiz: boolean;
}

const DailyMission: React.FC = () => {
  const { jwtToken, reissueToken } = useAuthStore(); // Zustand에서 JWT 토큰 및 토큰 재발급 함수 가져오기
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/mission/day`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`, // JWT 토큰 헤더에 추가
            },
          }
        );
        console.log(response);
        if (response.status === 401) {
          // 토큰 만료 시
          console.log("토큰이 만료되었습니다. 재발급 시도 중...");
          await reissueToken(); // 토큰 재발급 요청
          const retryResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/mission/day`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${jwtToken}`, // 재발급 받은 토큰으로 재시도
              },
            }
          );
          if (!retryResponse.ok) {
            throw new Error("일일 미션 정보를 불러오는데 실패했습니다.");
          }
          const data = await retryResponse.json();
          setMissionData(data.data);
        } else if (!response.ok) {
          throw new Error("일일 미션 정보를 불러오는데 실패했습니다.");
        } else {
          const data = await response.json();
          setMissionData(data.data);
        }
      } catch (error) {
        console.error("Error fetching daily mission data:", error);
        setMissionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [jwtToken, reissueToken]); // jwtToken이 변경될 때마다 재요청

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중 표시
  }

  if (!missionData) {
    return <div>일일 미션 정보를 불러올 수 없습니다.</div>; // 데이터 불러오기 실패 시
  }

  // 동적 스타일 적용
  const checkImageStyle = (completed: boolean) => ({
    filter: completed ? "grayscale(0%)" : "grayscale(100%)",
  });

  const completedMissions = [
    missionData.attendance,
    missionData.checkAir,
    missionData.talkWithSquirrel,
    missionData.quiz,
  ].filter(Boolean).length; // 완료된 미션 개수
  const totalMissions = 4; // 총 미션 개수
  const completionPercentage = (completedMissions / totalMissions) * 100;

  return (
    <div className="dailymission-page">
      <div className="dailymission-container">
        <div className="mission-containers">
          <div className="dailymission-header">
            <div className="progress-circle">
              <CircularProgressbar
                value={completionPercentage}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: "#43A047", // 진행 바 색상 변경
                  textColor: "#333",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
            <div className="dailymission-title">
              <h3>일일 미션</h3>
              <span className="progress-text">
                {completedMissions}/{totalMissions} 완료
              </span>
            </div>
          </div>
          <div className="mission-container">
            <FaCheck
              className="check-img"
              style={checkImageStyle(missionData.attendance)}
            />
            <p>출석하기</p>
          </div>
          <div
            className="mission-container"
            onClick={() => navigate("/squirrel")}
          >
            <FaCheck
              className="check-img"
              style={checkImageStyle(missionData.talkWithSquirrel)}
            />
            <p>다람쥐와 대화하기</p>
          </div>
          <div className="mission-container" onClick={() => navigate("/games")}>
            <FaCheck
              className="check-img"
              style={checkImageStyle(missionData.quiz)}
            />
            <p>OX 퀴즈 참여하기</p>
          </div>
          <div
            className="mission-container"
            onClick={() => navigate("/aqi-details")}
          >
            <FaCheck
              className="check-img"
              style={checkImageStyle(missionData.checkAir)}
            />
            <p>대기 오염 정보 조회하기</p>
          </div>
        </div>
        <div className="dailymission-page-meta">
          <img src={Acorn_img} alt="도도리 이미지" className="acron-img" />
          <p className="dailymission-explanation-text">
            미션을 완수하면, 도토리를 받을 수 있습니다. <br />
            위 미션을 수행하고 도토리를 주워가세요!
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyMission;
