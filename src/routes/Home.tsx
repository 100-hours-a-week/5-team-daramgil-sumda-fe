import React, { useState, useEffect } from "react";
import "./styles/Home.css";
import good from "../assets/grade/good.png";
import sun from "../assets/weather/sun.png";
import default_squirrel_img from "../assets/기본_다람쥐_lv4-removebg-preview.png";
import LocationDropdown from "../components/LocationDropdown";

const Home: React.FC = () => {
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentLocationData();
  }, []);

  const fetchCurrentLocationData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/latest/current-location/general`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAirQualityData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFavoriteLocationData = async (location: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/latest/favorite-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stationName: location }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAirQualityData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching favorite location data:", error);
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const selectLocation = (location: string) => {
    if (location === "등록하기") {
      console.log("페이지 이동: 등록 페이지로 이동합니다.");
      window.location.href = "/favorites";
    } else {
      setSelectedLocation(location);
      // 선택된 위치에 따라 데이터 로드
      fetchFavoriteLocationData(location);
    }
    setDropdownOpen(false);
  };

  const loadCurrentLocation = async () => {
    if (navigator.geolocation) {
      return new Promise<{ latitude: number; longitude: number } | null>(
        (resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCoordinates({ lat: latitude, lng: longitude });
              setSelectedLocation(
                `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
              );
              console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);

              // 현재 위치 정보를 반환
              resolve({ latitude, longitude });
            },
            (error) => {
              console.error(
                "위치 권한이 거부되었습니다. 기본 위치로 설정합니다."
              );
              const seoulCityHall = { lat: 37.5665, lng: 126.978 };
              setCoordinates(seoulCityHall);
              setSelectedLocation("위도: 37.5665, 경도: 126.9780");

              // 기본 위치를 반환 (에러 발생 시)
              resolve({ latitude: 37.5665, longitude: 126.978 });
            }
          );
        }
      );
    } else {
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
      const seoulCityHall = { lat: 37.5665, lng: 126.978 };
      setCoordinates(seoulCityHall);
      setSelectedLocation("위도: 37.5665, 경도: 126.9780");

      // 기본 위치를 반환 (Geolocation API 미지원 시)
      return { latitude: 37.5665, longitude: 126.978 };
    }
  };

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
            src={good}
            alt="통합대기환경지수 이미지"
          />
          {airQualityData ? (
            <>
              <p className="air-quality-status">
                {airQualityData.air_quality_grade}
              </p>
              <p className="air-quality-value">
                {airQualityData.air_quality_index}
              </p>
              <p className="air-quality-description">
                {airQualityData.air_quality_summary}
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
