import React, { useState, useEffect } from "react";
import "./styles/WeatherInfo.css";
import sun from "../assets/weather/sun.png";
import LocationDropdown from "../components/LocationDropdown";

const WeatherInfo: React.FC = () => {
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
    <div className="weatherinfo-page">
      {/* 위치 선택 드롭다운 컴포넌트 */}
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />

      {/* 대기 질과 날씨 정보를 표시하는 섹션 */}
      <div className="info-container">
        <div className="weather-section">
          <img className="weather-icon" src={sun} alt="날씨 이미지" />
          <p className="weather-status">맑음</p>
          <p className="weather-current-temperature">32°C</p>
          <p className="weather-range">33°C / 26°C</p>
          <p className="weather-description">날씨는 맑지만 폭염이에요!</p>
        </div>
        {/* 시간별 예보 섹션 */}
        <div className="forecast-section">
          <h3 className="forecast-title">시간별 예보</h3>
          <div className="forecast-scroll">
            <div className="forecast-items">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="forecast-item">
                  <p>{index + 4}시</p>
                  <img className="forecast-icon" src={sun} alt="날씨 아이콘" />
                  <p>25°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 일별 예보 섹션 */}
        <div className="daily-forecast-section">
          <h3 className="forecast-title">일별 예보</h3>
          <div className="daily-forecast-items">
            {[
              { day: "오늘", date: "7.31", minTemp: 25, maxTemp: 32 },
              { day: "수요일", date: "8.1", minTemp: 25, maxTemp: 32 },
              { day: "목요일", date: "8.2", minTemp: 25, maxTemp: 32 },
              { day: "금요일", date: "8.3", minTemp: 25, maxTemp: 32 },
              { day: "토요일", date: "8.4", minTemp: 25, maxTemp: 32 },
              { day: "일요일", date: "8.5", minTemp: 25, maxTemp: 32 },
              { day: "월요일", date: "8.6", minTemp: 25, maxTemp: 32 },
              { day: "화요일", date: "8.7", minTemp: 25, maxTemp: 32 },
            ].map((forecast, index) => (
              <div key={index} className="daily-forecast-item">
                <div className="day-info">
                  <p className="day">{forecast.day}</p>
                  <p className="date">{forecast.date}</p>
                </div>
                <img className="forecast-icon" src={sun} alt="날씨 아이콘" />
                <p className="temperature">
                  최저 온도 {forecast.minTemp}° / 최고 온도 {forecast.maxTemp}°
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 상세날씨 */}
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
              { label: "날씨", value: "맑음" },
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
    </div>
  );
};

export default WeatherInfo;
