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
  const [aiClothes, setAiClothes] = useState<
    { clothesName: string; reason: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가

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
        console.log(data.weatherDataJson);
        setWeatherData(data.weatherDataJson);
        console.log(weatherData);
      } else {
        alert("날씨 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("날씨 정보를 가져오는 중 오류가 발생했습니다:", error);
      alert("날씨 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // New function to fetch AI response
  // API 요청 및 응답 처리
  const fetchSimpleAIResponse = async (
    weatherType: string,
    currentTemp: number,
    highTemp: number,
    lowTemp: number
  ) => {
    try {
      setLoading(true); // 로딩 시작
      // 쿼리 스트링 생성
      console.log(weatherType, currentTemp, highTemp, lowTemp);
      // API 요청 시 쿼리 스트링 포함
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ai/clothes?weatherType=${weatherType}&currentTemp=${currentTemp}&highTemp=${highTemp}&lowTemp=${lowTemp}`
      );
      if (response.ok) {
        const data = await response.json();
        setAiClothes(data.data);
        console.log(aiClothes);
      } else {
        console.error("AI 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("AI 데이터를 가져오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    if (weatherData) {
      const weatherType =
        weatherMainToKorean[
          weatherData.current.weather[0]
            .main as keyof typeof weatherMainToKorean
        ];
      const currentTemp = Math.round(weatherData.current.temp); // 현재 온도를 반올림
      const highTemp = Math.round(weatherData.daily[0].temp.max); // 최댓값 온도를 반올림
      const lowTemp = Math.round(weatherData.daily[0].temp.min); // 최솟값 온도를 반올림

      fetchSimpleAIResponse(weatherType, currentTemp, highTemp, lowTemp);
    }
  }, [weatherData]);

  return (
    <div className="outfit-daily-page">
      <LocationDropdown onLocationSelect={handleLocationSelect} />
      <div className="outfit-daily-weather-section">
        <div className="outfit-daily-weather-p">
          <div className="outfit-daily-weather-icon-container">
            {weatherIconMap[weatherData?.current?.weather[0]?.main]}
          </div>
          <p className="outfit-daily-weather-status">
            {weatherMainToKorean[weatherData?.current?.weather[0]?.main] ||
              "알 수 없음"}
          </p>
        </div>
        <p className="outfit-daily-weather-current-temperature">
          {Math.round(weatherData?.current?.temp)}°
        </p>
        <div className="outfit-daily-weather-p">
          <p className="outfit-daily-weather-precipitation">
            습도 {weatherData?.current?.humidity}%
          </p>
        </div>
      </div>
      <div className="outfit-info-container">
        <div className="outfit-weather-section">
          {weatherData ? (
            <>
              <h2 className="outfit-recommend-title">추천 옷차림</h2>
              {loading ? ( // 로딩 중일 때
                <ul className="outfit-recommendations-list">
                  <li>불러오는 중입니다...</li>
                </ul>
              ) : (
                <ul className="outfit-recommendations-list">
                  {aiClothes.map((item, index) => (
                    <li key={index}>
                      <strong>{item.clothesName}</strong>
                      <br />
                      {item.reason}
                    </li>
                  ))}
                </ul>
              )}
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
