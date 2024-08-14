import React, { useState, useEffect } from "react";
import "./styles/OutfitDaily.css";
import sun from "../../assets/weather/sun.png";
import dressIcon from "../../assets/icons/mission.png";
import LocationDropdown from "../../components/LocationDropdown";

const OutfitDaily: React.FC = () => {
  // 드롭다운 메뉴의 열림 상태를 관리하는 state
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // 선택된 위치와 관련된 state
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // 현재 위치의 위도와 경도를 관리하는 state, 초기값은 서울 시청 좌표로 설정
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  // 컴포넌트가 마운트될 때 현재 위치를 로드
  useEffect(() => {
    loadCurrentLocation();
  }, []);

  // 드롭다운 메뉴를 토글하는 함수
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // 드롭다운 메뉴에서 위치를 선택할 때 호출되는 함수
  const selectLocation = (location: string) => {
    if (location === "등록하기") {
      console.log("페이지 이동: 등록 페이지로 이동합니다."); // 등록 페이지로 이동하는 로직을 추가 가능
    } else {
      setSelectedLocation(location);
      // 위치 정보를 파싱하여 위도와 경도 값을 업데이트
      const [lat, lng] = location
        .split(",")
        .map((item) => parseFloat(item.split(": ")[1]));
      setCoordinates({ lat, lng });
    }
    setDropdownOpen(false); // 드롭다운 메뉴를 닫음
  };

  // 현재 위치를 로드하는 함수
  const loadCurrentLocation = () => {
    if (navigator.geolocation) {
      // Geolocation API를 사용하여 현재 위치를 가져옴
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setSelectedLocation(
            `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
          );
          console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
        },
        (error) => {
          // 위치 권한이 거부되면 기본 위치를 서울 시청으로 설정
          console.error("위치 권한이 거부되었습니다. 기본 위치로 설정합니다.");
          const seoulCityHall = { lat: 37.5665, lng: 126.978 };
          setCoordinates(seoulCityHall);
          setSelectedLocation("위도: 37.5665, 경도: 126.9780");
        }
      );
    } else {
      // 브라우저가 Geolocation API를 지원하지 않는 경우
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
      const seoulCityHall = { lat: 37.5665, lng: 126.978 };
      setCoordinates(seoulCityHall);
      setSelectedLocation("위도: 37.5665, 경도: 126.9780");
    }
  };

  return (
    <div className="home-page">
      {/* 위치 선택 드롭다운 컴포넌트 */}
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />
      <h2 className="daily-title">오늘의 옷차림 추천</h2>
      {/* 대기 질과 날씨 정보를 표시하는 섹션 */}
      <div className="info-container">
        <div className="weather-section">
          <img className="weather-icon" src={sun} alt="날씨 이미지" />
          <p className="weather-status">맑음</p>
          <p className="weather-current-temperature">32°C</p>
          <p className="weather-range">33°C / 26°C</p>
          <p className="weather-description">날씨는 맑지만 폭염이에요!</p>
        </div>
        <h2 className="recommend-title">
          오늘 같은 날씨에 이런 옷을 입으면 좋아요!
        </h2>
        <div className="outfit-icons">
          <img src={dressIcon} alt="드레스 아이콘" className="outfit-icon" />
          <img src={dressIcon} alt="민소매 아이콘" className="outfit-icon" />
          <img src={dressIcon} alt="반바지 아이콘" className="outfit-icon" />
        </div>
        <div className="daily-outfit-section">
          <div className="outfit-recommendations">
            <p>민소매</p>
            <p>반팔</p>
            <p>반바지</p>
            <p>짧은 옷</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitDaily;
