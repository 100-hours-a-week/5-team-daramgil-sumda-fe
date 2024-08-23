import React, { useState } from "react";
import Switch from "react-switch";
import "./styles/Setting.css";

const Setting: React.FC = () => {
  const [weatherPush, setWeatherPush] = useState(false);
  const [airQualityPush, setAirQualityPush] = useState(false);

  return (
    <div className="setting-container">
      <h1 className="setting-title">설정</h1>
      <p className="setting-sub-title">
        <span className="highlight">※ 민감군:</span>
        어린이, 노인, 천식같은 폐질환 및
        <br />
        심장질환을 앓고 있는 경우
      </p>

      <div className="button-group">
        <button className="option-button">민감군</button>
        <button className="option-button">일반군</button>
      </div>
      <p className="info">
        민감군인 경우, 더 낮은 수치를 기준으로 정보를
        <br />
        안내해드립니다.
      </p>
      <div className="switch-container">
        <div className="switch-item">
          <label htmlFor="weatherPush">날씨 푸시 알림 설정</label>
          <Switch
            onChange={setWeatherPush}
            checked={weatherPush}
            offColor="#ccc"
            onColor="#000"
            checkedIcon={false}
            uncheckedIcon={false}
            handleDiameter={20}
            height={20}
            width={40}
          />
        </div>
        <div className="switch-item">
          <label htmlFor="airQualityPush">대기질 푸시 알림 설정</label>
          <Switch
            onChange={setAirQualityPush}
            checked={airQualityPush}
            offColor="#ccc"
            onColor="#000"
            checkedIcon={false}
            uncheckedIcon={false}
            handleDiameter={20}
            height={20}
            width={40}
          />
        </div>
      </div>
      <div className="oauth-container">
        {/* <h2>연동하기</h2> */}
        <p>로그인 정보 : KAKAO ID1234567890</p>
        <button className="logout-button">로그아웃</button>
        <button className="quit-button">탈퇴하기</button>
      </div>
    </div>
  );
};

export default Setting;
