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
import LocationDropdown from "../components/LocationDropdown"; // 위치 드롭다운 컴포넌트

import {
  WiDaySunny,
  WiCloudy,
  WiFog,
  WiShowers,
  WiSnow,
  WiStormShowers,
} from "react-icons/wi";

// 날씨 상태와 대응하는 한국어 텍스트 매핑
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

// 날씨 상태와 대응하는 아이콘 매핑
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
  // 상태 관리
  const [airQualityData, setAirQualityData] = useState<any>(null); // 대기질 데이터
  const [weatherData, setWeatherData] = useState<any>(null); // 날씨 데이터
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [id, setId] = useState<number>(0); // 선택된 위치의 ID
  const [aiSummary, setAiSummary] = useState<{
    airQualityComment: string;
    weatherComment: string;
    actionRecommendation: string;
  } | null>(null); // AI 요약 정보

  const navigate = useNavigate();

  // 특정 경로로 이동하는 함수
  const gosq = () => {
    navigate("/underConstruction");
  };

  // 위치 ID가 변경될 때마다 날씨 및 대기질 데이터를 가져옴
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchWeatherData(id).then(() => setLoading(false));
      fetchAirQualityData(id);
    }
  }, [id]);

  // 위치 선택 핸들러
  const handleLocationSelect = (location: string, id: number) => {
    setId(id); // 선택된 위치의 ID 설정
  };

  // 날씨 데이터를 가져오는 함수
  const fetchWeatherData = async (id: number) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/acweather?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data.weatherDataJson); // 날씨 데이터 설정
      } else {
        console.error("날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 대기질 데이터를 가져오는 함수
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
      setAirQualityData(data.data); // 대기질 데이터 설정
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // AI 응답 데이터를 가져오는 함수
  const fetchSimpleAIResponse = async (
    khaiGrade: number,
    khaiValue: number,
    weatherType: string,
    currentTemperature: number
  ) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/ai/simple?khaiGrade=${khaiGrade}&khaiValue=${khaiValue}&sensitiveGroup=0&weatherType=${weatherType}&currentTemperature=${Math.round(
          currentTemperature
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.data); // AI 요약 정보 설정
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

  // 대기질 데이터와 날씨 데이터를 기반으로 AI 요약 정보를 가져옴
  useEffect(() => {
    if (airQualityData && weatherData) {
      const khaiGrade = airQualityData.khaiGrade;
      const khaiValue = airQualityData.khaiValue;
      const weatherType =
        weatherMainToKorean[
          weatherData.current.weather[0]
            .main as keyof typeof weatherMainToKorean
        ];
      const currentTemperature = Math.round(weatherData.current.temp); // 온도 반올림

      fetchSimpleAIResponse(
        khaiGrade,
        khaiValue,
        weatherType,
        currentTemperature
      );
    }
  }, [airQualityData, weatherData]);

  // 다람쥐 이미지 목록
  const squirrelImages = [basic, knight, samurai, space, cook, pilot, hiphop];
  const [randomImage, setRandomImage] = useState("");

  // 컴포넌트가 마운트될 때 랜덤으로 다람쥐 이미지 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * squirrelImages.length);
    setRandomImage(squirrelImages[randomIndex]);
  }, []);

  // 날씨 상태에 따른 아이콘을 반환하는 함수
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

  // 대기질 등급에 따른 이미지와 상태를 반환하는 함수
  const airQualityGrades = {
    "1": { image: good, status: "좋음" },
    "2": { image: moderate, status: "보통" },
    "3": { image: unhealthy, status: "나쁨" },
    "4": { image: veryUnhealthy, status: "매우 나쁨" },
    "5": { image: hazardous, status: "위험" },
  };

  // 대기질 값을 바탕으로 등급을 결정하는 함수
  const getAirQualityGrade = (value: number) => {
    if (value <= 50) return airQualityGrades["1"];
    if (value <= 100) return airQualityGrades["2"];
    if (value <= 250) return airQualityGrades["3"];
    if (value <= 350) return airQualityGrades["4"];
    return airQualityGrades["5"];
  };

  // 여러 줄의 텍스트를 <li>로 포맷팅하는 함수
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
        {/* 위치 선택 드롭다운 */}
        <LocationDropdown onLocationSelect={handleLocationSelect} />

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}
        >
          {/* 대기질 정보 슬라이드 */}
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

          {/* 날씨 정보 슬라이드 */}
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
