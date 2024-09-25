import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./styles/Home.css";

import basic from "../assets/randomSquirrels/기본-다람쥐-lv4.png";
import knight from "../assets/randomSquirrels/기사-다람쥐-lv4.png";
import samurai from "../assets/randomSquirrels/사무라이-다람쥐-lv4.png";
import cook from "../assets/randomSquirrels/요리사-다람쥐-lv4.png";
import space from "../assets/randomSquirrels/우주비행사-다람쥐-lv4.png";
import pilot from "../assets/randomSquirrels/파일럿-다람쥐-lv4.png";
import hiphop from "../assets/randomSquirrels/힙합-다람쥐-lv4.png";

import {
  PiSmileyWinkLight,
  PiSmileyLight,
  PiSmileyMehLight,
  PiSmileySadLight,
  PiSmileyXEyesLight,
  PiSmileyMeltingLight,
} from "react-icons/pi";

import loading_gif from "../assets/loading4.gif";
import LocationDropdown from "../components/LocationDropdown"; // 위치 드롭다운 컴포넌트

import { toast } from "react-toastify";
import useMissionStore from "../store/useMissionStore";
import useAuthStore from "../store/useAuthStore";

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
  const { completeDailyAttendance } = useMissionStore(); // 출석 체크 함수 가져오기
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuthStore();
  // 특정 경로로 이동하는 함수
  const gosq = () => {
    navigate("/squirrel");
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
      console.log("대기질 데이터:", data); // 데이터를 출력해서 확인
      setAirQualityData(data.data); // 대기질 데이터 설정
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const fetchSimpleAIResponse = async (
    khaiGrade: string | number | null | undefined, // 문자열도 받을 수 있도록 변경
    khaiValue: number | null | undefined,
    weatherType: string | null | undefined,
    currentTemperature: number | null | undefined
  ) => {
    // "null" 문자열이나 실제 null일 경우 0으로 변환
    const safeKhaiGrade =
      khaiGrade === "null" || khaiGrade === null || khaiGrade === undefined
        ? 0
        : Number(khaiGrade); // 숫자로 변환

    const safeKhaiValue = khaiValue ?? 0;
    const safeWeatherType = weatherType ?? "0"; // 문자열인 경우 기본값을 '0'으로 설정
    const safeCurrentTemperature = currentTemperature ?? 0;

    // 각 값 확인을 위한 콘솔 로그
    console.log("safeKhaiGrade:", safeKhaiGrade);
    console.log("safeKhaiValue:", safeKhaiValue);
    console.log("safeWeatherType:", safeWeatherType);
    console.log("safeCurrentTemperature:", safeCurrentTemperature);

    try {
      setLoading(true); // 로딩 시작
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/ai/simple?khaiGrade=${safeKhaiGrade}&khaiValue=${safeKhaiValue}&sensitiveGroup=0&weatherType=${safeWeatherType}&currentTemperature=${Math.round(
          safeCurrentTemperature
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.data); // AI 요약 정보 설정
        console.log(data.data); // aiSummary 대신 data.data 출력
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

      console.log("khaiGrade 값:", khaiGrade); // 여기에서 khaiGrade 값을 확인
      console.log("khaiValue 값:", khaiValue); // 마찬가지로 khaiValue도 확인

      fetchSimpleAIResponse(
        khaiGrade,
        khaiValue,
        weatherType,
        currentTemperature
      );
    }
  }, [airQualityData, weatherData]);
  useEffect(() => {
    // 컴포넌트 마운트 시 출석 체크 호출
    const checkAttendance = async () => {
      try {
        await completeDailyAttendance();
        toast.success("출석 미션을 완료했습니다. 도토리 1개가 지급됩니다.");
      } catch (error) {
        toast.error("이미 완료된 미션입니다."); // 에러 시 처리
      }
    };

    checkAttendance();
  }, [completeDailyAttendance, isLoggedIn, login]);

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
  const airQualityGrades: {
    [key: string]: { icon: JSX.Element; status: string };
  } = {
    "1": {
      status: "좋음",
      icon: <PiSmileyWinkLight />,
    },
    "2": {
      status: "보통",
      icon: <PiSmileyLight />,
    },
    "3": { status: "나쁨", icon: <PiSmileyMehLight /> },
    "4": {
      status: "매우 나쁨",
      icon: <PiSmileySadLight />,
    },
    "5": {
      status: "위험",
      icon: <PiSmileyXEyesLight />,
    },
  };

  // 대기질 값을 바탕으로 등급을 결정하는 함수 수정
  const getAirQualityGrade = (value: string | number | null | undefined) => {
    // null, undefined, "null", 또는 값이 없을 경우 "데이터 없음"을 반환
    if (
      value === null ||
      value === undefined ||
      value === "null" ||
      value == 0
    ) {
      return { status: "데이터 없음", icon: <PiSmileyMeltingLight /> };
    }

    // 문자열인 경우 숫자로 변환
    const numericValue = typeof value === "string" ? Number(value) : value;

    // 숫자 범위에 따른 등급 반환
    if (numericValue <= 50) return airQualityGrades["1"];
    if (numericValue <= 100) return airQualityGrades["2"];
    if (numericValue <= 250) return airQualityGrades["3"];
    if (numericValue <= 350) return airQualityGrades["4"];
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
      <div className="homeinfo-container">
        <LocationDropdown onLocationSelect={handleLocationSelect} />
        <div className="upper-container">
          <div className="additional-info">
            {loading ? (
              <p className="loading-text">
                추가적인 정보를 불러오는 중입니다...
              </p>
            ) : (
              airQualityData &&
              weatherData && (
                <>
                  <ul>
                    {aiSummary?.actionRecommendation &&
                      formatRecommendations(aiSummary.actionRecommendation)}
                  </ul>
                </>
              )
            )}
            <div className="to-squirrel">
              <p>더 상세한 정보는</p>
              <div className="to-squirrel-button" onClick={gosq}>
                다람쥐와 대화하기
              </div>
            </div>
          </div>
          <div className="main-squirrel">
            <img src={randomImage} alt="다람쥐 이미지" />
          </div>
        </div>
        <div className="home-swiper">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            spaceBetween={50}
            slidesPerView={1}
          >
            {/* 대기질 정보 슬라이드 */}
            <SwiperSlide>
              <div className="home-slide-section">
                <div className="air-quality-container">
                  <div className="air-quality-container-left">
                    <h1 className="home-slide-title">통합대기환경지수</h1>
                    {airQualityData ? (
                      <div className="air-quality-info">
                        {/* khaiValue가 null, undefined, 또는 값이 없을 경우 처리 */}
                        <p className="air-quality-value">
                          {airQualityData.khaiValue === null ||
                          airQualityData.khaiValue === undefined ||
                          airQualityData.khaiValue === "null" ||
                          airQualityData.khaiValue === 0
                            ? "데이터 없음"
                            : airQualityData.khaiValue}
                        </p>
                        <p className="air-quality-status">
                          {getAirQualityGrade(airQualityData.khaiValue).status}
                        </p>
                      </div>
                    ) : (
                      <p className="loading-text-status">
                        대기질 정보를 불러오는 중입니다...
                      </p>
                    )}
                  </div>
                  {airQualityData ? (
                    <div className="home-air-quality-icon">
                      <img
                        src={loading_gif}
                        alt="통합대기환경지수 로딩 이미지"
                        // style={{ width: "65px", height: "60px" }}
                      />
                    </div>
                  ) : (
                    <div className="home-air-quality-icon">
                      {airQualityData?.khaiValue === null ||
                      airQualityData?.khaiValue === undefined ||
                      airQualityData?.khaiValue === "null" ||
                      airQualityData?.khaiValue === 0 ? (
                        <img
                          src={loading_gif}
                          alt="통합대기환경지수 로딩 이미지"
                          // style={{ width: "65px", height: "60px" }}
                        />
                      ) : (
                        getAirQualityGrade(airQualityData.khaiValue).icon
                      )}
                    </div>
                  )}
                </div>
                {airQualityData ? (
                  <>
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
              <div className="home-slide-section">
                <div className="weather-container">
                  <div className="weather-info-container">
                    <h1 className="home-slide-title">날씨</h1>
                    {weatherData ? (
                      <div className="weather-info-section">
                        <div className="weather-temperature">
                          <p className="home-weather-current-temperature">
                            {Math.round(weatherData.current.temp)}°
                          </p>
                          <p className="weather-range">
                            {Math.round(weatherData.daily[0].temp.max)}° /{" "}
                            {Math.round(weatherData.daily[0].temp.min)}°
                          </p>
                        </div>
                        <p className="home-weather-status">
                          {
                            weatherMainToKorean[
                              weatherData.current.weather[0]
                                .main as keyof typeof weatherMainToKorean
                            ]
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="loading-text">
                        날씨 데이터를 불러오는 중입니다...
                      </p>
                    )}
                  </div>
                  <div className="home-weather-icon">
                    {executeIcon(
                      weatherData?.current?.weather[0]
                        ?.main as keyof typeof weatherIconMap
                    )}
                  </div>
                </div>

                {weatherData ? (
                  <>
                    <p className="weather-description">
                      {aiSummary?.weatherComment}
                    </p>
                  </>
                ) : (
                  <p className="loading-text">
                    날씨 정보를 불러오는 중입니다...
                  </p>
                )}
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Home;
