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
import sun from "../assets/weather/sun.png";
import LocationDropdown from "../components/LocationDropdown";

const Home: React.FC = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    fetchAirQualityData(id || 1);
    fetchWeatherData(id || 1);
  }, [id]);

  const fetchAirQualityData = async (id: number) => {
    try {
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
      setError("현재 위치의 대기질 데이터를 가져오는데 실패했습니다.");
    }
  };
  const fetchWeatherData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/weather/current?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data.data);
        console.log(data.data);
      } else {
        console.error("Failed to fetch weather data.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const selectLocation = (location: string, id: number) => {
    if (location === "등록하기") {
      navigate("/favorites");
    } else {
      setSelectedLocation(location);
      setId(id);
      setDropdownOpen(false);
    }
  };

  const loadCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    const defaultLocation = { latitude: 37.5665, longitude: 126.978 };
    const fetchLocationData = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/locations/convert?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        const data = await response.json();
        if (data.status === 200 && data.data.district) {
          setSelectedLocation(data.data.district);
          setId(data.data.id);
          return { latitude, longitude };
        } else {
          alert("위치를 찾을 수 없습니다.");
          return null;
        }
      } catch (error) {
        console.error("위치 정보를 가져오는 중 오류가 발생했습니다:", error);
        alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
        return null;
      }
    };

    if (navigator.geolocation) {
      return new Promise<{ latitude: number; longitude: number } | null>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const locationData = await fetchLocationData(latitude, longitude);
              resolve(locationData);
            },
            async () => {
              console.error(
                "위치 권한이 거부되었습니다. 기본 위치로 설정합니다."
              );
              const locationData = await fetchLocationData(
                defaultLocation.latitude,
                defaultLocation.longitude
              );
              resolve(locationData);
            }
          );
        }
      );
    } else {
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
      const locationData = await fetchLocationData(
        defaultLocation.latitude,
        defaultLocation.longitude
      );
      return locationData;
    }
  };

  const airQualityGrades: { [key: string]: { image: string; status: string } } =
    {
      "1": { image: good, status: "좋음" },
      "2": { image: moderate, status: "보통" },
      "3": { image: unhealthy, status: "나쁨" },
      "4": { image: veryUnhealthy, status: "매우 나쁨" },
      "5": { image: hazardous, status: "위험" },
    };

  const getAirQualityGrade = (value: number) => {
    if (value <= 30) return airQualityGrades["1"];
    if (value <= 50) return airQualityGrades["2"];
    if (value <= 100) return airQualityGrades["3"];
    if (value <= 150) return airQualityGrades["4"];
    return airQualityGrades["5"];
  };

  const khaiInfo = airQualityData?.khaiValue
    ? getAirQualityGrade(airQualityData.khaiValue)
    : { image: undefined, status: "데이터 없음" };

  const squirrelImages = [
    basic,
    knight,
    samurai,
    space,
    cook,
    pilot,
    hiphop,
    // 추가 이미지 URL을 여기다 추가하세요
  ];
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * squirrelImages.length);
    setRandomImage(squirrelImages[randomIndex]);
  }, []);

  return (
    <div className="home-page">
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation} // GPS 버튼 클릭 시 현재 위치 로드
      />

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
      >
        <SwiperSlide>
          <div className="home-info-container air-quality-section">
            <h1 className="air-quality-title">통합대기환경지수</h1>
            <img
              className="air-quality-image"
              src={khaiInfo.image}
              alt="통합대기환경지수 이미지"
            />
            {airQualityData ? (
              <>
                <p className="air-quality-status">{khaiInfo.status}</p>
                <p className="air-quality-value">{airQualityData.khaiValue}</p>
                <p className="air-quality-description">
                  오늘은 공기가 정말 맑고 깨끗해요!
                </p>
              </>
            ) : (
              <p>Loading air quality data...</p>
            )}
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="home-info-container weather-section">
            <h1 className="weather-title">날씨</h1>
            <img className="weather-icon" src={sun} alt="날씨 이미지" />
            {weatherData ? (
              <>
                <p className="weather-status">{weatherData.weather}</p>
                <p className="weather-current-temperature">
                  {weatherData.temperature}
                </p>
                {/* <p className="weather-range">
                  {weatherData.min_temperature}°C /{" "}
                  {weatherData.max_temperature}°C
                </p> */}
                <p className="weather-description">{weatherData.humidity}</p>
              </>
            ) : (
              <p>Loading weather data...</p>
            )}
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="additional-info">
        {airQualityData ? (
          <>
            <p>{airQualityData.recommended_action}</p>
            <p>
              더 궁금한 점은 아래 ‘다람쥐와 대화하기’ 를 통해 알려드릴게요!!
            </p>
            <img src={randomImage} alt="다람쥐 이미지" />
          </>
        ) : (
          <p>Loading additional information...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
