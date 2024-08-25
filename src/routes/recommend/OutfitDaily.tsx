import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/OutfitDaily.css";
import sun from "../../assets/weather/sun.png";
import cloud from "../../assets/weather/cloud.png";
import rain from "../../assets/weather/rainy.png";
import snow from "../../assets/weather/snow.png";
import LocationDropdown from "../../components/LocationDropdown";

// 날씨 유형에 따른 아이콘 매핑
const weatherIcons: { [key: string]: string } = {
  맑음: sun,
  흐림: cloud,
  비: rain,
  눈: snow,
  구름많음: cloud,
};

const OutfitDailyPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (id) {
      fetchWeatherData(id);
    }
  }, [id]);

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

  const fetchWeatherData = async (locationId: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}weather/current?id=${locationId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      if (data.status === 200) {
        setWeatherData(data.data);
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
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />
      <h2 className="outfit-daily-title">오늘의 옷차림 추천</h2>
      <div className="outfit-info-container">
        <div className="outfit-weather-section">
          {weatherData ? (
            <>
              <img
                className="outfit-weather-icon"
                src={weatherIcons[weatherData.weather]}
                alt={`${weatherData.weather} 이미지`}
              />
              <p className="outfit-weather-status">{weatherData.weather}</p>
              <p className="outfit-weather-current-temperature">
                {weatherData.temperature}
              </p>
              <p className="outfit-weather-humidity">
                습도 {weatherData.humidity}
              </p>
              <h2 className="outfit-recommend-title">추천 옷차림</h2>
              <ul className="outfit-recommendations-list">
                {getOutfitRecommendation(
                  parseFloat(weatherData.temperature),
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
