import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";
import good from "../assets/grade/good.png";
import moderate from "../assets/grade/moderate.png";
import unhealthy from "../assets/grade/unhealthy.png";
import veryUnhealthy from "../assets/grade/very_unhealthy.png";
import hazardous from "../assets/grade/hazardous.png";
import sun from "../assets/weather/sun.png";
import default_squirrel_img from "../assets/기본_다람쥐_lv4-removebg-preview.png";
import LocationDropdown from "../components/LocationDropdown";

const Home: React.FC = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  useEffect(() => {
    if (id) {
      fetchFavoriteLocationData(id);
    } else {
      fetchCurrentLocationData(id);
    }
  }, [id]);

  const fetchCurrentLocationData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=12`,
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
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("현재 위치의 대기질 데이터를 가져오는데 실패했습니다.");
    }
  };

  const fetchFavoriteLocationData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=123`, // id를 쿼리 파라미터로 전달
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
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching favorite location data:", error);
      setError("즐겨찾기 위치의 대기질 데이터를 가져오는데 실패했습니다.");
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();

  const selectLocation = (location: string, id: number) => {
    // id도 함께 받아옴
    if (location === "등록하기") {
      console.log("페이지 이동: 등록 페이지로 이동합니다.");
      navigate("/favorites");
    } else {
      setSelectedLocation(location);
      setId(id); // 선택된 location의 id를 설정
      setDropdownOpen(false);
    }
  };
  const loadCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    if (navigator.geolocation) {
      return new Promise<{ latitude: number; longitude: number } | null>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `${process.env.REACT_APP_API_URL}/locations/convert?latitude=${latitude}&longitude=${longitude}`
                );
                if (!response.ok) {
                  throw new Error("Failed to fetch location data");
                }
                const data = await response.json();
                if (data.status === 200 && data.data.district) {
                  setSelectedLocation(data.data.district); // 응답에서 district 값을 설정
                  resolve({ latitude, longitude });
                } else {
                  alert("위치를 찾을 수 없습니다.");
                  resolve(null);
                }
              } catch (error) {
                console.error(
                  "위치 정보를 가져오는 중 오류가 발생했습니다:",
                  error
                );
                alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
                resolve(null);
              }
            },
            (error) => {
              console.error(
                "위치 권한이 거부되었습니다. 기본 위치로 설정합니다."
              );
              const seoulCityHall = { latitude: 37.5665, longitude: 126.978 }; // 속성 이름 수정
              resolve(seoulCityHall);
            }
          );
        }
      );
    } else {
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
      const seoulCityHall = { latitude: 37.5665, longitude: 126.978 }; // 속성 이름 수정
      return seoulCityHall;
    }
  };
  const getAirQualityGrade = (value: number) => {
    if (value <= 30) {
      return { image: good, status: "좋음", value };
    } else if (value <= 50) {
      return { image: moderate, status: "보통", value };
    } else if (value <= 100) {
      return { image: unhealthy, status: "나쁨", value };
    } else if (value <= 150) {
      return { image: veryUnhealthy, status: "매우 나쁨", value };
    } else {
      return { image: hazardous, status: "위험", value };
    }
  };
  // 각 오염 물질의 등급을 계산 (서버에서 받아온 데이터를 사용)
  const khaiInfo = airQualityData?.khaiValue
    ? getAirQualityGrade(airQualityData.khaiValue)
    : { image: null, status: "데이터 없음", value: 0 };

  return (
    <div className="home-page">
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation} // GPS 버튼 클릭 시 현재 위치 로드
      />

      <div className="info-container">
        <div className="air-quality-section">
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
                {/* {airQualityData.air_quality_summary} */}
                오늘은 공기가 정말 맑고 깨끗해요!
              </p>
            </>
          ) : (
            <p>Loading air quality data...</p>
          )}
        </div>
        <div className="weather-section">
          <h1 className="weather-title">날씨</h1>
          <img className="weather-icon" src={sun} alt="날씨 이미지" />
          {airQualityData ? (
            <>
              <p className="weather-status">{airQualityData.weather_type}</p>
              <p className="weather-current-temperature">
                {airQualityData.current_temperature}°C
              </p>
              <p className="weather-range">
                {airQualityData.min_temperature}°C /{" "}
                {airQualityData.max_temperature}°C
              </p>
              <p className="weather-description">
                {airQualityData.weather_summary}
              </p>
            </>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      </div>

      <div className="additional-info">
        {airQualityData ? (
          <>
            <p>{airQualityData.recommended_action}</p>
            <p>
              더 궁금한 점은 아래 ‘다람쥐와 대화하기’ 를 통해 알려드릴게요!!
            </p>
            <img src={default_squirrel_img} alt="다람쥐 이미지" />
          </>
        ) : (
          <p>Loading additional information...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
