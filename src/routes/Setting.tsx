import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import "./styles/Setting.css";

const Setting: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [weatherPush, setWeatherPush] = useState(false);
  const [airQualityPush, setAirQualityPush] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 값 불러오기
  useEffect(() => {
    const savedGroup = localStorage.getItem("sensitiveGroup");
    if (savedGroup) {
      setSelected(savedGroup);
    }

    const savedWeatherPush = localStorage.getItem("weatherPush");
    if (savedWeatherPush) {
      setWeatherPush(JSON.parse(savedWeatherPush));
    }

    const savedAirQualityPush = localStorage.getItem("airQualityPush");
    if (savedAirQualityPush) {
      setAirQualityPush(JSON.parse(savedAirQualityPush));
    }
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    localStorage.setItem("sensitiveGroup", option); // 로컬 스토리지에 값 저장
    alert("민감군 정보가 저장되었습니다."); // 저장 완료 메시지
  };
  const handleWeatherPushChange = (checked: boolean) => {
    setWeatherPush(checked);
    localStorage.setItem("weatherPush", JSON.stringify(checked));
  };

  const handleAirQualityPushChange = (checked: boolean) => {
    setAirQualityPush(checked);
    localStorage.setItem("airQualityPush", JSON.stringify(checked));
  };

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
        <button
          className={`setting-button2 ${selected === "yes" ? "selected" : ""}`}
          onClick={() => handleSelect("yes")}
        >
          민감군
        </button>
        <button
          className={`option-button1 ${selected === "no" ? "selected" : ""}`}
          onClick={() => handleSelect("no")}
        >
          일반군
        </button>
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
            onChange={handleWeatherPushChange}
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
            onChange={handleAirQualityPushChange}
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
      {/* <div className="oauth-container">
        <p>로그인 정보 : KAKAO ID1234567890</p>
        <button className="logout-button">로그아웃</button>
        <button className="quit-button">탈퇴하기</button>
      </div> */}
    </div>
  );
};

export default Setting;
