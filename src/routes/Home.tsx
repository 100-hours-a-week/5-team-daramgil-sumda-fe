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
import cloud from "../assets/weather/cloud.png";
import rain from "../assets/weather/rainy.png";
import snow from "../assets/weather/snow.png";
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
        `${process.env.REACT_APP_API_URL}/acweather?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data.weatherDataJson);
        console.log(weatherData.current.temp);
        console.log(weatherData.daily[0].temp.max);
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
          console.log(longitude, latitude);
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

  // 날씨 유형에 따른 아이콘 매핑
  const weatherIcons: { [key: string]: string } = {
    맑음: sun,
    흐림: cloud,
    비: rain,
    눈: snow,
    구름많음: cloud,
  };
  // 날씨 아이콘 선택
  const weatherIcon = weatherIcons[weatherData?.current?.weather?.icon] || sun;
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
  // 대기질 메시지 설정 함수
  const getAirQualityMessage = (value: number) => {
    if (value <= 30) {
      return "오늘의 공기는 깨끗하고 상쾌해요! 야외 활동하기에 딱 좋은 날입니다.";
    } else if (value <= 50) {
      return "오늘은 공기가 무난해요. 평소처럼 야외 활동을 즐기셔도 좋습니다.";
    } else if (value <= 100) {
      return "오늘은 공기가 다소 탁하네요. 민감한 분들은 실내 활동을 추천드려요.";
    } else if (value <= 150) {
      return "오늘은 공기가 많이 안 좋아요. 가능하면 야외 활동을 피하시고, 외출 시 마스크를 꼭 착용하세요.";
    } else {
      return "오늘은 공기가 매우 나쁩니다. 꼭 실내에서 활동하시고, 창문을 닫아두세요.";
    }
  };

  // 날씨 메시지 설정 함수
  const getWeatherMessage = (weather: string) => {
    switch (weather) {
      case "맑음":
        return (
          <>
            날씨도 맑고 화창하니,
            <br />
            가벼운 옷차림으로 산책을 즐겨보세요.
          </>
        );
      case "구름조금":
        return (
          <>
            오늘은 구름이 많고 흐려요.
            <br />
            간혹 우산이 필요할 수도 있으니 챙기세요.
          </>
        );
      case "비":
        return (
          <>
            오늘은 비가 내리니 우산을 꼭 챙기세요.
            <br />
            빗길 운전 시 조심하세요!
          </>
        );
      case "눈":
        return (
          <>
            오늘은 눈이 내려요.
            <br />
            미끄럼에 주의하시고, 따뜻하게 입으세요.
          </>
        );
      case "더위":
        return (
          <>
            오늘은 기온이 많이 올라 더운 날씨입니다.
            <br />
            충분한 수분을 섭취하고, 실내에서 쉬는 것이 좋아요.
          </>
        );
      default:
        return <>오늘의 날씨 정보를 확인하세요.</>;
    }
  };

  // 다람쥐와 대화하는 부분에 대한 메시지 설정 함수
  const getSquirrelMessage = (airQualityValue: number, weather: string) => {
    let message = "";

    // 대기질과 날씨를 모두 고려한 메시지 생성
    if (airQualityValue > 100) {
      message = "공기가 나빠요. 실내에서 활동하는 것이 좋아요.";
    } else if (airQualityValue > 50 && airQualityValue <= 100) {
      message = "공기가 약간 탁해요. 외출 시 주의가 필요해요.";
    } else {
      message = "공기가 좋으니 활동하기 좋은 날이에요!";
    }

    return message;
  };

  return (
    <div className="home-page">
      <div className="info-container">
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
            <div className="home-air-quality-section">
              <h1 className="air-quality-title">통합대기환경지수</h1>
              <img
                className="home-air-quality-image"
                src={khaiInfo.image}
                alt="통합대기환경지수 이미지"
              />
              {airQualityData ? (
                <>
                  <p className="air-quality-status">{khaiInfo.status}</p>
                  <p className="air-quality-value">
                    {airQualityData.khaiValue}
                  </p>
                  <p className="air-quality-description">
                    {getAirQualityMessage(airQualityData.khaiValue)}
                  </p>
                </>
              ) : (
                <p>Loading air quality data...</p>
              )}
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="home-weather-section">
              <h1 className="weather-title">날씨</h1>
              <img className="home-weather-icon" src={sun} alt="날씨 이미지" />
              {weatherData ? (
                <>
                  <p className="weather-status">
                    {weatherData.current.weather[0].description}
                  </p>
                  <p className="home-weather-current-temperature">
                    {weatherData.current.temp}°C
                  </p>
                  <p className="weather-range">
                    {weatherData.daily[0].temp.max}°C /{" "}
                    {weatherData.daily[0].temp.min}°C
                  </p>
                  <p className="weather-description">
                    {getWeatherMessage(
                      weatherData.current.weather[0].description
                    )}
                  </p>
                </>
              ) : (
                <p>Loading weather data...</p>
              )}
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="additional-info">
          {airQualityData && weatherData ? (
            <>
              <p>
                {getSquirrelMessage(
                  airQualityData.khaiValue,
                  weatherData.weather
                )}
              </p>
              <p>
                더 궁금한 점이 있다면, 아래 '다람쥐와 대화하기'를 통해
                알려드릴게요!
              </p>
              <img src={randomImage} alt="다람쥐 이미지" />
            </>
          ) : (
            <p>Loading additional information...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
