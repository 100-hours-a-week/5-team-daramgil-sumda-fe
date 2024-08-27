import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./styles/Home.css";

import basic from "../assets/randomSquirrels/기본.png";
import knight from "../assets/randomSquirrels/기사.png";
import samurai from "../assets/randomSquirrels/사무라이.png";
import cook from "../assets/randomSquirrels/요리사.png";
import space from "../assets/randomSquirrels/우주비행사.png";
import pilot from "../assets/randomSquirrels/파일럿.png";
import hiphop from "../assets/randomSquirrels/힙합.png";

import good from "../assets/grade/good.png";
import moderate from "../assets/grade/moderate.png";
import unhealthy from "../assets/grade/unhealthy.png";
import veryUnhealthy from "../assets/grade/very_unhealthy.png";
import hazardous from "../assets/grade/hazardous.png";

import loading_gif from "../assets/loading.gif";
import LocationDropdown from "../components/LocationDropdown"; // 올바르게 임포트

import {
  WiDaySunny,
  WiCloudy,
  WiFog,
  WiShowers,
  WiSnow,
  WiStormShowers,
} from "react-icons/wi";

const weatherMainToKorean: { [key in keyof typeof weatherIconMap]: string } = {
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

const weatherIconMap = {
  Thunderstorm: <WiStormShowers />,
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

const Home: React.FC = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [id, setId] = useState<number>(0);
  const [aiSummary, setAiSummary] = useState<{
    airQualityComment: string;
    weatherComment: string;
    actionRecommendation: string;
  } | null>(null);

  const navigate = useNavigate();
  const gosq = () => {
    navigate("/underConstruction");
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchWeatherData(id).then(() => setLoading(false));
      fetchAirQualityData(id);
    }
  }, [id]);
  const handleLocationSelect = (location: string, id: number) => {
    setId(id); // 선택된 위치의 id를 설정하여 데이터를 가져옴
  };

  const fetchWeatherData = async (id: number) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/acweather?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data.weatherDataJson);
      } else {
        console.error("날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const fetchAirQualityData = async (id: number) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAirQualityData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // New function to fetch AI response
  // API 요청 및 응답 처리
  const fetchSimpleAIResponse = async (
    khaiGrade: number,
    khaiValue: number,
    weatherType: string,
    currentTemperature: number
  ) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/ai/simple?khaiGrade=${khaiGrade}&khaiValue=${khaiValue}&sensitiveGroup=0&weatherType=${weatherType}&currentTemperature=${currentTemperature}`
      );
      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.data); // 응답 데이터를 전체 객체로 저장
        console.log(aiSummary);
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
    if (airQualityData && weatherData) {
      const khaiGrade = airQualityData.khaiGrade;
      const khaiValue = airQualityData.khaiValue;
      const weatherType =
        weatherMainToKorean[
          weatherData.current.weather[0]
            .main as keyof typeof weatherMainToKorean
        ];
      const currentTemperature = weatherData.current.temp;

      fetchSimpleAIResponse(
        khaiGrade,
        khaiValue,
        weatherType,
        currentTemperature
      );
    }
  }, [airQualityData, weatherData]);

  const squirrelImages = [basic, knight, samurai, space, cook, pilot, hiphop];

  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * squirrelImages.length);
    setRandomImage(squirrelImages[randomIndex]);
  }, []);

  const executeIcon = (weatherMain: keyof typeof weatherIconMap) => {
    if (!weatherMain) {
      return <WiDaySunny />;
    }
    const icon = weatherIconMap[weatherMain];
    if (!icon) {
      return <WiDaySunny />;
    }
    return icon;
  };

  const airQualityGrades = {
    "1": { image: good, status: "좋음" },
    "2": { image: moderate, status: "보통" },
    "3": { image: unhealthy, status: "나쁨" },
    "4": { image: veryUnhealthy, status: "매우 나쁨" },
    "5": { image: hazardous, status: "위험" },
  };

  const getAirQualityGrade = (value: number) => {
    if (value <= 50) return airQualityGrades["1"];
    if (value <= 100) return airQualityGrades["2"];
    if (value <= 250) return airQualityGrades["3"];
    if (value <= 350) return airQualityGrades["4"];
    return airQualityGrades["5"];
  };

  // 데이터가 여러 줄일 경우 각 줄을 <li> 태그로 감싸기 위해서
  const formatRecommendations = (text: string) => {
    return text.split("\n").map((line, index) => (
      <li key={index}>
        {line}
        <br />
      </li>
    ));
  };

  return (
    <div className="home-page">
      <div className="info-container">
        <LocationDropdown onLocationSelect={handleLocationSelect} />

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}
        >
          <SwiperSlide>
            <div className="home-air-quality-section">
              <h1 className="air-quality-title">통합대기환경지수</h1>
              {loading ? (
                <img
                  className="home-air-quality-image"
                  src={loading_gif}
                  alt="통합대기환경지수 로딩 이미지"
                />
              ) : (
                <img
                  className="home-air-quality-image"
                  src={
                    airQualityData?.khaiValue
                      ? getAirQualityGrade(airQualityData.khaiValue).image
                      : ""
                  }
                  alt="통합대기환경지수 이미지"
                />
              )}
              {airQualityData ? (
                <>
                  <p className="air-quality-status">
                    {getAirQualityGrade(airQualityData.khaiValue).status}
                  </p>
                  <p className="air-quality-value">
                    {airQualityData.khaiValue}
                  </p>
                  <p className="air-quality-description">
                    {aiSummary?.airQualityComment}
                  </p>
                </>
              ) : (
                <p className="loading-text">
                  대기질 정보를 불러오는 중입니다...
                </p>
              )}
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="home-weather-section">
              <h1 className="weather-title">날씨</h1>
              <div className="home-weather-icon">
                {executeIcon(
                  weatherData?.current?.weather[0]
                    ?.main as keyof typeof weatherIconMap
                )}
              </div>
              {weatherData ? (
                <>
                  <p className="weather-status">
                    {
                      weatherMainToKorean[
                        weatherData.current.weather[0]
                          .main as keyof typeof weatherMainToKorean
                      ]
                    }
                  </p>
                  <p className="home-weather-current-temperature">
                    {Math.round(weatherData.current.temp)}°C
                  </p>
                  <p className="weather-range">
                    {Math.round(weatherData.daily[0].temp.max)}°C /{" "}
                    {Math.round(weatherData.daily[0].temp.min)}°C
                  </p>
                  <p className="weather-description">
                    {aiSummary?.weatherComment}
                  </p>
                </>
              ) : (
                <p className="loading-text">
                  날씨 데이터를 불러오는 중입니다...
                </p>
              )}
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="additional-info">
          {loading ? (
            <p className="loading-text">추가적인 정보를 불러오는 중입니다...</p>
          ) : (
            airQualityData &&
            weatherData && (
              <>
                <ul>
                  {aiSummary?.actionRecommendation &&
                    formatRecommendations(aiSummary.actionRecommendation)}
                </ul>
                <p>
                  더 궁금한 점이 있다면, 아래 '다람쥐와 대화하기'를 통해
                  알려드릴게요!
                </p>
                <img src={randomImage} alt="다람쥐 이미지" onClick={gosq} />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
