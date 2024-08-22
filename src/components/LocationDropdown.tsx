import React, { useEffect, useState } from "react";
import gps from "../assets/icons/gps.png";
import "./styles/LocationDropdown.css";

interface LocationDropdownProps {
  selectedLocation: string;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  selectLocation: (location: string) => void;
  loadCurrentLocation: () => Promise<{
    latitude: number;
    longitude: number;
  } | null>; // 수정: Promise로 위치 반환
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  selectedLocation,
  isDropdownOpen,
  toggleDropdown,
  selectLocation,
  loadCurrentLocation,
}) => {
  const [favorites, setFavorites] = useState<
    { id: number; location: string }[]
  >([]);

  const handleLoadCurrentLocation = async () => {
    try {
      const location = await loadCurrentLocation(); // 상위 컴포넌트에서 위치 가져오기

      if (location) {
        const { latitude, longitude } = location;

        const response = await fetch(
          `http://localhost:3030/api/locations/convert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: `{
      "latitude": ${latitude},
      "longitude": ${longitude}
    }`, // 직접 문자열로 구성
          }
        );

        const data = await response.json();

        if (response.ok && data.status === "success") {
          selectLocation(data.data.district); // 성공 시 위치 선택
        } else {
          alert(data.message || "주소 정보를 찾을 수 없습니다.");
        }
      } else {
        alert("위치를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("위치 정보를 가져오는 중 오류가 발생했습니다:", error);
      alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 즐겨찾기 데이터를 불러옴
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div className="location-dropdown">
      <div className="dropdown-controls">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {selectedLocation}
        </button>
        <button className="gps-button" onClick={handleLoadCurrentLocation}>
          <img className="gps-icon" src={gps} alt="gps icon" />
        </button>
      </div>

      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {/* 로컬 스토리지에서 불러온 즐겨찾기 목록 출력 */}
          {favorites.map((favorite) => (
            <li
              key={favorite.id}
              onClick={() => selectLocation(favorite.location)}
            >
              {favorite.location}
            </li>
          ))}
          {/* 기본 항목 */}
          <li onClick={() => selectLocation("등록하기")}>등록하기</li>
        </ul>
      )}
    </div>
  );
};

export default LocationDropdown;
