import React, { useEffect, useState } from "react";
import "./styles/DailyMission.css";
import Acorn_img from "../../assets/acorn.png";
import Check_img from "../../assets/check.png";
import useAuthStore from "../../store/useAuthStore"; // Zustand에서 JWT 토큰 가져오기

interface MissionData {
  attendance: boolean;
  checkAir: boolean;
  talkWithSquirrel: boolean;
  quiz: boolean;
}

const DailyMission: React.FC = () => {
  const { jwtToken } = useAuthStore(); // Zustand에서 JWT 토큰 가져오기
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        if (!response.ok) {
          throw new Error("일일 미션 정보를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setMissionData(data.data);
        console.log(missionData);
      } catch (error) {
        console.error("Error fetching daily mission data:", error);
        setMissionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [jwtToken]);

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

  return (
    <div className="dailymission-container">
      <h3 className="dailymission-header">일일 미션</h3>
      <div className="dailymission-page-meta">
        <img src={Acorn_img} alt="도도리 이미지" className="acron-img" />
        <p className="dailymission-explanation-text">
          퀘스트를 완료하면, 도토리를 받을 수 있습니다. <br />
          아래 미션을 수행하고 도토리를 주워가세요!!
          <br />
        </p>
      </div>
      <div className="mission-container">
        <p>출석하기</p>
        <img
          className="check-img"
          src={Check_img}
          alt="체크 이미지"
          style={checkImageStyle(missionData.attendance)}
        />
      </div>
      <div className="mission-container">
        <p>다람쥐와 대화하기</p>
        <img
          className="check-img"
          src={Check_img}
          alt="체크 이미지"
          style={checkImageStyle(missionData.talkWithSquirrel)}
        />
      </div>
      <div className="mission-container">
        <p>OX 퀴즈 참여하기</p>
        <img
          className="check-img"
          src={Check_img}
          alt="체크 이미지"
          style={checkImageStyle(missionData.quiz)}
        />
      </div>
      <div className="mission-container">
        <p>대기 오염 정보 조회하기</p>
        <img
          className="check-img"
          src={Check_img}
          alt="체크 이미지"
          style={checkImageStyle(missionData.checkAir)}
        />
      </div>
    </div>
  );
};

export default DailyMission;
