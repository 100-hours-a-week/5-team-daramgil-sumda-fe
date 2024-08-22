import React, { useState, useEffect } from "react";
import "./styles/WeatherInfo.css";
import sun from "../assets/weather/sun.png";
import cloud from "../assets/weather/cloud.png";
import rain from "../assets/weather/rainy.png";
import snow from "../assets/weather/snow.png";
import LocationDropdown from "../components/LocationDropdown";

// 날씨 유형에 따른 이미지 매핑 객체
const weatherIcons: { [key: string]: string } = {
  맑음: sun,
  흐림: cloud,
  비: rain,
  눈: snow,
  // 필요한 만큼 추가
};

const WeatherInfo: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });
  const [weatherData, setWeatherData] = useState<any | null>(null);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      fetchWeatherData(coordinates.lat, coordinates.lng);
    }
  }, [coordinates]);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `http://localhost:3030/api/map/weather?latitude=${latitude}&longitude=${longitude}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        console.error("Failed to fetch weather data.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const selectLocation = (location: string) => {
    if (location === "등록하기") {
      console.log("페이지 이동: 등록 페이지로 이동합니다.");
      window.location.href = "/favorites";
    } else {
      setSelectedLocation(location);
      const [lat, lng] = location
        .split(",")
        .map((item) => parseFloat(item.split(": ")[1]));
      setCoordinates({ lat, lng });
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

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  // 날씨 아이콘을 weather_type에 따라 선택
  const weatherIcon =
    weatherIcons[weatherData.currentWeather.weather_type] || sun;

  return (
    <div className="info-container">
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />
      <div className="weather-section">
        <img className="weather-icon" src={weatherIcon} alt="날씨 이미지" />
        <p className="weather-status">
          {weatherData.currentWeather.weather_type}
        </p>
        <p className="weather-current-temperature">
          {weatherData.currentWeather.current_temperature}°C
        </p>
        <p className="weather-range">
          {weatherData.currentWeather.max_temperature}°C /{" "}
          {weatherData.currentWeather.min_temperature}°C
        </p>
        <p className="weather-description">
          {weatherData.currentWeather.description || "날씨 설명 없음"}
        </p>
      </div>

      <div className="forecast-section">
        <h3 className="forecast-title">시간별 예보</h3>
        <div className="forecast-scroll">
          <div className="forecast-items">
            {weatherData.hourlyForecast.map((forecast: any, index: number) => (
              <div key={index} className="forecast-item">
                <p>{forecast.time}</p>
                <img
                  className="forecast-icon"
                  src={weatherIcons[forecast.weather_type] || sun}
                  alt="날씨 아이콘"
                />
                <p>{forecast.TA}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="daily-forecast-section">
        <h3 className="forecast-title">일별 예보</h3>
        <div className="daily-forecast-items">
          {weatherData.dailyForecast.map((forecast: any, index: number) => (
            <div key={index} className="daily-forecast-item">
              <div className="day-info">
                <p className="day">{forecast.day || "날짜"}</p>
                <p className="date">{forecast.date}</p>
              </div>
              <img
                className="forecast-icon"
                src={weatherIcons[forecast.weather_type] || sun}
                alt="날씨 아이콘"
              />
              <p className="temperature">
                최저 온도 {forecast.TA_MIN}° / 최고 온도 {forecast.TA_MAX}°
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="detail-forecast-section">
        <h3 className="forecast-title">상세 날씨</h3>
        <div className="detail-forecast-items">
          <p className="sun-info">
            일출 오전 5:37
            <br />
            일몰 오후 7:32
            <br />
            4시간 30분 후에 일몰이 시작됩니다
          </p>
          {[
            { label: "날씨", value: weatherData.currentWeather.weather_type },
            { label: "체감", value: "39°" },
            { label: "강수", value: "0.0mm | 없음" },
            { label: "바람", value: "5.5ms | 약간 강함" },
            { label: "습도", value: "67% | 높음" },
            { label: "자외선", value: "지수 : 7 | 높음" },
            { label: "달모양", value: "그믐달" },
            { label: "미세먼지", value: "최고" },
            { label: "초미세먼지", value: "좋음" },
          ].map((item, index) => (
            <div key={index} className="detail-forecast-item">
              <div className="detail-forecast-label">
                <img
                  className="detail-icon"
                  src={sun}
                  alt={`${item.label} 아이콘`}
                />
                <p>{item.label}</p>
              </div>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
