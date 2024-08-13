import React from "react";
import gps from "../assets/gps.png";
import "./styles/LocationDropdown.css";

// LocationDropdown 컴포넌트가 받을 props의 타입 정의
interface LocationDropdownProps {
  selectedLocation: string; // 현재 선택된 위치를 표시하는 문자열
  isDropdownOpen: boolean; // 드롭다운 메뉴의 열림 상태를 나타내는 boolean 값
  toggleDropdown: () => void; // 드롭다운 메뉴를 열거나 닫는 함수
  selectLocation: (location: string) => void; // 사용자가 위치를 선택했을 때 호출되는 함수
  loadCurrentLocation: () => void; // 현재 위치를 로드하는 함수
}

// LocationDropdown 컴포넌트 정의
const LocationDropdown: React.FC<LocationDropdownProps> = ({
  selectedLocation,
  isDropdownOpen,
  toggleDropdown,
  selectLocation,
  loadCurrentLocation,
}) => {
  return (
    <div className="location-dropdown">
      {/* 드롭다운 메뉴를 열고 닫는 버튼과 현재 선택된 위치를 표시 */}
      <div className="dropdown-controls">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {selectedLocation} {/* 현재 선택된 위치 표시 */}
        </button>
        {/* GPS 아이콘 버튼을 클릭하면 현재 위치를 로드 */}
        <button className="gps-button" onClick={loadCurrentLocation}>
          <img className="gps-icon" src={gps} alt="gps icon" />
        </button>
      </div>

      {/* 드롭다운 메뉴가 열려 있을 때 위치 목록을 표시 나중에 로컬 스토리지에서 가져오기 포함시켜야함 */}
      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {/* 각 위치 항목을 클릭하면 selectLocation 함수가 호출되어 해당 위치가 선택됨 */}
          <li onClick={() => selectLocation("서울시 종로구 청운효자동")}>
            등록한 위치1
          </li>
          <li onClick={() => selectLocation("서울시 강남구 논현동")}>
            등록한 위치2
          </li>
          {/* '등록하기'를 클릭하면 사용자에게 위치 등록 페이지로 이동할 수 있는 기능 제공 */}
          <li onClick={() => selectLocation("등록하기")}>등록하기</li>
        </ul>
      )}
    </div>
  );
};

export default LocationDropdown;
