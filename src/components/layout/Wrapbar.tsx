import React from "react";
import { Link } from "react-router-dom";
import "./styles/Wrapbar.css";

import home from "../../assets/icons/home.png";
import info from "../../assets/icons/info.png";
import weather from "../../assets/icons/weather.png";
import squirrel from "../../assets/icons/squirrel.png";
import mission from "../../assets/icons/mission.png";

const Wrapbar: React.FC = () => {
  return (
    <div className="wrapbar">
      <Link to="/" className="wrapbar-item">
        <img src={home} alt="홈" className="wrapbar-icon" />
        <span>홈</span>
      </Link>
      <Link to="/" className="wrapbar-item">
        <img src={info} alt="대기 오염 조회" className="wrapbar-icon" />
        <span>대기조회</span>
      </Link>
      <Link to="/" className="wrapbar-item">
        <img src={weather} alt="날씨 정보 조회" className="wrapbar-icon" />
        <span>날씨조회</span>
      </Link>
      <Link to="/" className="wrapbar-item">
        <img src={squirrel} alt="다람쥐와 대화하기" className="wrapbar-icon" />
        <span>
          다람쥐와
          <br />
          대화하기
        </span>
      </Link>
      <Link to="/" className="wrapbar-item">
        <img src={mission} alt="일일 미션" className="wrapbar-icon" />
        <span>일일미션</span>
      </Link>
    </div>
  );
};

export default Wrapbar;
