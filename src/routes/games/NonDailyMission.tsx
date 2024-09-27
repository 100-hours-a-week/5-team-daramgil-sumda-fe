import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import "./styles/DailyMission.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./styles/DailyMission.css";
import Acorn_img from "../../assets/acorn.png";
import kakao_login_button_img from "../../assets/icons/kakao_login_large_wide.png";

import useAuthStore from "../../store/useAuthStore"; // Zustand에서 JWT 토큰 가져오기

const NonDailyMission: React.FC = () => {
  const { attemptLogin } = useAuthStore();

  const handleKakaoLogin = () => {
    attemptLogin(); // 로그인 시도 상태를 true로 설정
    window.location.href = `${process.env.REACT_APP_LOGIN_URL}/oauth2/authorization/kakao`; // 리다이렉트
  };

  return (
    <div className="dailymission-page">
      <div className="dailymission-container">
        <div className="mission-containers">
          <div className="dailymission-header">
            <div className="progress-circle">
              <CircularProgressbar
                value={100}
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
              <span className="progress-text">0/4 완료</span>
            </div>
          </div>
          <div className="non-login-container">
            <p className="daily-login-explain1">
              일일 미션은 회원만 확인할 수 있습니다.
            </p>
            <p className="daily-login-explain2">확인하려면 로그인해주세요.</p>
            <div className="login-button-container">
              <button className="login-button" onClick={handleKakaoLogin}>
                <img
                  className="login-button-img"
                  src={kakao_login_button_img}
                  alt="카카오 로그인 이미지"
                />
              </button>
            </div>
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

export default NonDailyMission;
