import React, { useEffect, useState } from "react";
import gps from "../assets/icons/gps.png";
import "./styles/LocationDropdown.css";

interface LocationDropdownProps {
  selectedLocation: string;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  selectLocation: (location: string, id: number) => void;
  loadCurrentLocation: () => Promise<{
    latitude: number;
    longitude: number;
  } | null>;
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
      const location = await loadCurrentLocation();
      if (!location) {
        alert("위치를 가져올 수 없습니다.");
      }
      // `location`은 이미 `loadCurrentLocation`에서 처리되었기 때문에 추가 작업이 필요하지 않음.
    } catch (error) {
      console.error("위치 정보를 가져오는 중 오류가 발생했습니다:", error);
      alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

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
          {favorites.map((favorite) => (
            <li
              key={favorite.id}
              onClick={() => selectLocation(favorite.location, favorite.id)} // id와 location을 함께 전달
            >
              {favorite.location}
            </li>
          ))}
          <li onClick={() => selectLocation("등록하기", 0)}>등록하기</li>
        </ul>
      )}
    </div>
  );
};

export default LocationDropdown;
