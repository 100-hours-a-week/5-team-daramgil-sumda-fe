import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/OutfitDaily.css";
import LocationDropdown from "../../components/LocationDropdown";
import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiFog,
  WiShowers,
  WiStormShowers,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

// Mapping for weather descriptions to Korean
const weatherMainToKorean: { [key: string]: string } = {
  Thunderstorm: "천둥번개",
  Drizzle: "이슬비",
  Rain: "비",
  Snow: "눈",
  Mist: "엷은 안개",
  Smoke: "연기",
  Haze: "실안개",
  Dust: "먼지",
  Fog: "안개",
  Sand: "모래",
  Ash: "화산재",
  Squall: "돌풍",
  Tornado: "토네이도",
  Clear: "맑음",
  Clouds: "구름",
};

// Mapping for weather descriptions to corresponding icons
const weatherIconMap: { [key: string]: JSX.Element } = {
  Thunderstorm: <WiThunderstorm />,
  Drizzle: <WiShowers />,
  Rain: <WiShowers />,
  Snow: <WiSnow />,
  Mist: <WiFog />,
  Smoke: <WiFog />,
  Haze: <WiFog />,
  Dust: <WiFog />,
  Fog: <WiFog />,
  Sand: <WiFog />,
  Ash: <WiFog />,
  Squall: <WiStormShowers />,
  Tornado: <WiStormShowers />,
  Clear: <WiDaySunny />,
  Clouds: <WiCloudy />,
};

const OutfitDailyPage: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchWeatherData(id);
    }
  }, [id]);

  const handleLocationSelect = (location: string, id: number) => {
    setId(id); // LocationDropdown에서 전달된 ID로 데이터를 가져옴
  };

  const fetchWeatherData = async (locationId: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/acweather?id=${locationId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      if (data.weatherDataJson) {
        setWeatherData(data.weatherDataJson.current);
      } else {
        alert("날씨 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("날씨 정보를 가져오는 중 오류가 발생했습니다:", error);
      alert("날씨 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const getOutfitRecommendation = (
    temperature: number,
    humidity: number
  ): string[] => {
    if (temperature >= 30) {
      if (humidity > 70) {
        return ["통기성 좋은 반팔", "반바지", "모자", "선글라스"];
      } else {
        return ["반팔", "반바지", "가벼운 원피스", "샌들"];
      }
    } else if (temperature >= 25) {
      return ["반팔", "반바지", "얇은 긴바지", "스니커즈"];
    } else if (temperature >= 20) {
      return ["반팔", "얇은 긴팔", "청바지", "가디건"];
    } else if (temperature >= 15) {
      return ["얇은 긴팔", "얇은 스웨터", "긴 바지", "재킷"];
    } else if (temperature >= 10) {
      return ["두꺼운 긴팔", "니트", "코트", "긴 바지"];
    } else if (temperature >= 5) {
      return ["두꺼운 스웨터", "코트", "스카프", "장갑", "긴 바지"];
    } else {
      return [
        "패딩",
        "두꺼운 코트",
        "목도리",
        "장갑",
        "털모자",
        "두꺼운 긴 바지",
      ];
    }
  };

  return (
    <div className="outfit-daily-page">
      <LocationDropdown onLocationSelect={handleLocationSelect} />
      <div className="outfit-info-container">
        <div className="outfit-weather-section">
          {weatherData ? (
            <>
              <div className="outfit-weather-icon-container">
                {weatherIconMap[weatherData.weather[0].main]}
              </div>
              <p className="outfit-weather-status">
                {weatherMainToKorean[weatherData.weather[0].main] ||
                  "알 수 없음"}
              </p>
              <p className="outfit-weather-current-temperature">
                {Math.round(weatherData.temp)}°C
              </p>

              <p className="outfit-weather-humidity">
                습도 {weatherData.humidity}%
              </p>
              <h2 className="outfit-recommend-title">추천 옷차림</h2>
              <ul className="outfit-recommendations-list">
                {getOutfitRecommendation(
                  parseFloat(weatherData.temp),
                  parseFloat(weatherData.humidity)
                ).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>날씨 정보를 가져오는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitDailyPage;
