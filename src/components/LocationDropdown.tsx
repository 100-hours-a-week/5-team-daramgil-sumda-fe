import React, { useEffect, useState } from "react";
import gps from "../assets/icons/gps.png";
import "./styles/LocationDropdown.css";

interface LocationDropdownProps {
  onLocationSelect: (location: string, id: number) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  onLocationSelect,
}) => {
  const [favorites, setFavorites] = useState<
    { id: number; location: string }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    loadCurrentLocation();
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

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
          selectLocation(data.data.district, data.data.id);
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

  const handleLoadCurrentLocation = async () => {
    try {
      const location = await loadCurrentLocation();
      if (!location) {
        alert("위치를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("위치 정보를 가져오는 중 오류가 발생했습니다:", error);
      alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const selectLocation = (location: string, id: number) => {
    setSelectedLocation(location);
    onLocationSelect(location, id); // 선택된 위치를 부모 컴포넌트로 전달
    setDropdownOpen(false);
  };

  return (
    <div className="location-dropdown">
      <div className="dropdown-controls">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {selectedLocation || "위치 선택"}
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
              onClick={() => selectLocation(favorite.location, favorite.id)}
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
