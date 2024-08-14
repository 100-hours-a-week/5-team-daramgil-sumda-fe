import React, { useState, useEffect } from "react";
import "./styles/ActivityRecommed.css";
import good from "../assets/grade/good.png";
import sun from "../assets/weather/sun.png";
import running from "../assets/icons/running.png";
import dogwalk from "../assets/icons/dogwalk.png";
import bicycle from "../assets/icons/bicycle.png";
import yoga from "../assets/icons/yoga.png";
import LocationDropdown from "../../components/LocationDropdown";

const ActivityRecommed: React.FC = () => {
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
    } else {
      setSelectedLocation(location);
      const [lat, lng] = location
        .split(",")
        .map((item) => parseFloat(item.split(": ")[1]));
      setCoordinates({ lat, lng });
    }
    setDropdownOpen(false);
  };

  const loadCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setSelectedLocation(
            `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
          );
        },
        (error) => {
          console.error("위치 권한이 거부되었습니다. 기본 위치로 설정합니다.");
          const seoulCityHall = { lat: 37.5665, lng: 126.978 };
          setCoordinates(seoulCityHall);
          setSelectedLocation("위도: 37.5665, 경도: 126.9780");
        }
      );
    } else {
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
      const seoulCityHall = { lat: 37.5665, lng: 126.978 };
      setCoordinates(seoulCityHall);
      setSelectedLocation("위도: 37.5665, 경도: 126.9780");
    }
  };

  return (
    <div className="activityRecommend-page">
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />

      <div className="info-container-activity">
        <div className="air-quality-section-activity">
          <div className="fine-dust-section-activity">
            <h1 className="air-quality-title-activity">미세먼지</h1>
            <img
              className="air-quality-image-activity"
              src={good}
              alt="통합대기환경지수 이미지"
            />
            <p className="air-quality-status-activity">좋음</p>
            <p className="air-quality-value-activity">23</p>
          </div>
          <div className="fine-dust-section-activity">
            <h1 className="air-quality-title-activity">초미세먼지</h1>
            <img
              className="air-quality-image-activity"
              src={good}
              alt="통합대기환경지수 이미지"
            />
            <p className="air-quality-status-activity">좋음</p>
            <p className="air-quality-value-activity">6</p>
          </div>
        </div>
        <div className="weather-section-activity">
          <img className="weather-icon-activity" src={sun} alt="날씨 이미지" />
          <p className="weather-current-temperature-activity">32°C</p>
          <p className="weather-range-activity">33°C / 26°C</p>
        </div>
      </div>

      <div className="activity-recommendations">
        <div className="activity-item">
          <img src={running} alt="운동 추천 아이콘" />
          <p>
            기온이 높으니 짧고 가벼운 조깅을 추천합니다. 바람이 불어주니 조금은
            시원하게 운동할 수 있을 거예요. 꼭 수분을 충분히 섭취하세요!
          </p>
        </div>
        <div className="activity-item">
          <img src={dogwalk} alt="산책 추천 아이콘" />
          <p>
            바람이 불어 더위를 덜 느낄 수 있는 산책을 추천합니다. 그늘진 곳을
            찾아 천천히 걸으며 자연을 즐겨보세요.
          </p>
        </div>
        <div className="activity-item">
          <img src={bicycle} alt="자전거 추천 아이콘" />
          <p>
            기온이 높아 장거리 라이딩을 피하는 것이 좋습니다. 가까운 거리를
            자전거로 가볍게 돌리며 바람을 느껴보세요.
          </p>
        </div>
        <div className="activity-item">
          <img src={yoga} alt="요가 추천 아이콘" />
          <p>
            더운 날씨에는 격렬한 운동보다 잔잔한 요가를 추천합니다. 그늘진
            곳에서 요가로 마음을 힐링해보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityRecommed;
