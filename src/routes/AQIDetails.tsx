import React, { useState, useEffect } from "react";
import "./styles/AQIDetails.css";
import LocationDropdown from "../components/LocationDropdown";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

// 등급 이미지 임포트
import good from "../assets/grade/good.png";
import moderate from "../assets/grade/moderate.png";
import unhealthy from "../assets/grade/unhealthy.png";
import veryUnhealthy from "../assets/grade/very_unhealthy.png";
import hazardous from "../assets/grade/hazardous.png";

const dummyAirPollutionData = [
  {
    dateTime: "2024-08-14 10:00",
    pm10: 55,
    pm25: 30,
    no2: 0.03,
    o3: 0.04,
    co: 0.6,
    so2: 0.005,
  },
  {
    dateTime: "2024-08-14 11:00",
    pm10: 60,
    pm25: 35,
    no2: 0.04,
    o3: 0.03,
    co: 0.7,
    so2: 0.006,
  },
  {
    dateTime: "2024-08-14 12:00",
    pm10: 70,
    pm25: 40,
    no2: 0.02,
    o3: 0.05,
    co: 0.8,
    so2: 0.004,
  },
  {
    dateTime: "2024-08-14 13:00",
    pm10: 65,
    pm25: 38,
    no2: 0.05,
    o3: 0.04,
    co: 0.9,
    so2: 0.005,
  },
  {
    dateTime: "2024-08-14 14:00",
    pm10: 75,
    pm25: 42,
    no2: 0.03,
    o3: 0.06,
    co: 1.0,
    so2: 0.007,
  },
  {
    dateTime: "2024-08-14 15:00",
    pm10: 80,
    pm25: 45,
    no2: 0.04,
    o3: 0.07,
    co: 1.1,
    so2: 0.008,
  },
];

const getAirQualityGrade = (value: number) => {
  if (value <= 30) {
    return { image: good, status: "좋음", value };
  } else if (value <= 50) {
    return { image: moderate, status: "보통", value };
  } else if (value <= 100) {
    return { image: unhealthy, status: "나쁨", value };
  } else if (value <= 150) {
    return { image: veryUnhealthy, status: "매우 나쁨", value };
  } else {
    return { image: hazardous, status: "위험", value };
  }
};

const AQIDetails: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });

  // 가장 최근 데이터를 추출
  const latestData = dummyAirPollutionData[dummyAirPollutionData.length - 1];

  // 각 오염 물질의 등급을 계산
  const pm10Info = getAirQualityGrade(latestData.pm10);
  const pm25Info = getAirQualityGrade(latestData.pm25);
  const no2Info = getAirQualityGrade(latestData.no2 * 1000); // ppm을 ug/m3로 가정하여 등급 설정
  const o3Info = getAirQualityGrade(latestData.o3 * 1000); // ppm을 ug/m3로 가정하여 등급 설정
  const coInfo = getAirQualityGrade(latestData.co * 1000); // ppm을 ug/m3로 가정하여 등급 설정
  const so2Info = getAirQualityGrade(latestData.so2 * 1000); // ppm을 ug/m3로 가정하여 등급 설정

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
          console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
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
    <div className="aqidetails-container-unique">
      <h1 className="page-title-unique">대기 오염 정보 조회</h1>
      <p className="page-description-unique">
        현재 위치 또는 선택한 위치의 대기 오염 정보를 확인하세요.
      </p>
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />

      {/* 대기 질과 오염 물질 정보를 표시하는 섹션 */}
      <div className="info-container-unique">
        {/* 통합대기환경지수 섹션 */}
        <div className="air-quality-section-unique">
          <h1 className="air-quality-title-unique">통합대기환경지수</h1>
          <img
            className="air-quality-image-unique"
            src={pm10Info.image}
            alt="통합대기환경지수 이미지"
          />
          <p className="air-quality-status-unique">{pm10Info.status}</p>
          <p className="air-quality-value-unique">{pm10Info.value} µg/m³</p>
        </div>

        {/* 각 오염 물질 수치 표시 */}
        <div className="pollutants-container-unique">
          <div className="pollutants-row-unique">
            {/* PM10 */}
            <div className="pollutant-item-unique">
              <h2>PM10</h2>
              <img
                className="pollutant-image-unique"
                src={pm10Info.image}
                alt="PM10 등급 이미지"
              />
              <p className="pollutant-status-unique">{pm10Info.status}</p>
              <p className="pollutant-value-unique">{pm10Info.value} µg/m³</p>
            </div>
            {/* PM2.5 */}
            <div className="pollutant-item-unique">
              <h2>PM2.5</h2>
              <img
                className="pollutant-image-unique"
                src={pm25Info.image}
                alt="PM2.5 등급 이미지"
              />
              <p className="pollutant-status-unique">{pm25Info.status}</p>
              <p className="pollutant-value-unique">{pm25Info.value} µg/m³</p>
            </div>
            {/* NO2 */}
            <div className="pollutant-item-unique">
              <h2>NO2</h2>
              <img
                className="pollutant-image-unique"
                src={no2Info.image}
                alt="NO2 등급 이미지"
              />
              <p className="pollutant-status-unique">{no2Info.status}</p>
              <p className="pollutant-value-unique">{no2Info.value} ppm</p>
            </div>
          </div>
          <div className="pollutants-row-unique">
            {/* O3 */}
            <div className="pollutant-item-unique">
              <h2>O3</h2>
              <img
                className="pollutant-image-unique"
                src={o3Info.image}
                alt="O3 등급 이미지"
              />
              <p className="pollutant-status-unique">{o3Info.status}</p>
              <p className="pollutant-value-unique">{o3Info.value} ppm</p>
            </div>
            {/* CO */}
            <div className="pollutant-item-unique">
              <h2>CO</h2>
              <img
                className="pollutant-image-unique"
                src={coInfo.image}
                alt="CO 등급 이미지"
              />
              <p className="pollutant-status-unique">{coInfo.status}</p>
              <p className="pollutant-value-unique">{coInfo.value} ppm</p>
            </div>
            {/* SO2 */}
            <div className="pollutant-item-unique">
              <h2>SO2</h2>
              <img
                className="pollutant-image-unique"
                src={so2Info.image}
                alt="SO2 등급 이미지"
              />
              <p className="pollutant-status-unique">{so2Info.status}</p>
              <p className="pollutant-value-unique">{so2Info.value} ppm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container-unique">
        <h3>시간별 대기 오염 수치</h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}
        >
          {/* PM10 */}
          <SwiperSlide>
            <h3>PM10</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyAirPollutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pm10" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </SwiperSlide>
          {/* PM2.5 */}
          <SwiperSlide>
            <h3>PM2.5</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyAirPollutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pm25" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </SwiperSlide>
          {/* NO2 */}
          <SwiperSlide>
            <h3>NO2</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyAirPollutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="no2" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </SwiperSlide>
          {/* O3 */}
          <SwiperSlide>
            <h3>O3</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyAirPollutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="o3" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </SwiperSlide>
          {/* CO */}
          <SwiperSlide>
            <h3>CO</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyAirPollutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="co" stroke="#0088FE" />
              </LineChart>
            </ResponsiveContainer>
          </SwiperSlide>
          {/* SO2 */}
          <SwiperSlide>
            <h3>SO2</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dummyAirPollutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="so2" stroke="#FF0000" />
              </LineChart>
            </ResponsiveContainer>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default AQIDetails;
