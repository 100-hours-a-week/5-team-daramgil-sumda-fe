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
  const [airPollutionData, setAirPollutionData] = useState<any[]>([]);
  const [airQualityData, setAirQualityData] = useState<any | null>(null);
  const [airPollutionImages, setAirPollutionImages] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      fetchAirPollutionData(coordinates.lat, coordinates.lng);
      fetchAirQualityData(1234); // id를 하드코딩된 1234로 전달
      fetchAirPollutionImages(); // 이미지 데이터 요청 값 필요없음
    }
  }, [coordinates]);

  const fetchAirPollutionData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `http://localhost:3030/api/air/time?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // data.data 배열에서 차트에 사용할 데이터로 변환
      const transformedData = data.data.map((entry: any) => ({
        time: entry.dataTime,
        khai: entry.khaiValue,
        pm10: entry.pm10Value,
        pm25: entry.pm25Value,
        o3: entry.o3Value,
        no2: entry.no2Value,
        co: entry.coValue,
        so2: entry.so2Value,
      }));
      setAirPollutionData(transformedData);
      console.log(transformedData);
    } catch (error) {
      console.error("Error fetching air pollution data:", error);
    }
  };

  const fetchAirQualityData = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3030/api/air/current?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAirQualityData(data.data); // data.data를 사용하여 상태 업데이트
        console.log(airQualityData);
      } else {
        console.error("Failed to fetch air quality data.");
      }
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  };
  const fetchAirPollutionImages = async () => {
    try {
      const response = await fetch(`http://localhost:3030/api/air/images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAirPollutionImages(data.data);
      } else {
        console.error("Failed to fetch air pollution images.");
      }
    } catch (error) {
      console.error("Error fetching air pollution images:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % 3); // 3개의 이미지 순환
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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

  if (!airQualityData) {
    return <div>Loading...</div>;
  }

  // 각 오염 물질의 등급을 계산 (서버에서 받아온 데이터를 사용)
  const khaiInfo = airQualityData.khaiValue
    ? getAirQualityGrade(airQualityData.khaiValue)
    : { image: null, status: "데이터 없음", value: 0 };
  const pm10Info = airQualityData.pm10Value
    ? getAirQualityGrade(airQualityData.pm10Value)
    : { image: null, status: "데이터 없음", value: 0 };
  const pm25Info = airQualityData.pm25Value
    ? getAirQualityGrade(airQualityData.pm25Value)
    : { image: null, status: "데이터 없음", value: 0 };
  const no2Info = airQualityData.no2Value
    ? getAirQualityGrade(airQualityData.no2Value * 1000)
    : { image: null, status: "데이터 없음", value: 0 };
  const o3Info = airQualityData.o3Value
    ? getAirQualityGrade(airQualityData.o3Value * 1000)
    : { image: null, status: "데이터 없음", value: 0 };
  const coInfo = airQualityData.coValue
    ? getAirQualityGrade(airQualityData.coValue * 1000)
    : { image: null, status: "데이터 없음", value: 0 };
  const so2Info = airQualityData.so2Value
    ? getAirQualityGrade(airQualityData.so2Value * 1000)
    : { image: null, status: "데이터 없음", value: 0 };

  return (
    <div className="aqidetails-page">
      <LocationDropdown
        selectedLocation={selectedLocation}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectLocation={selectLocation}
        loadCurrentLocation={loadCurrentLocation}
      />
      <div className="aqidetails-container-unique">
        <h1 className="page-title-unique">대기 오염 정보 조회</h1>
        <p className="page-description-unique">
          현재 위치 또는 선택한 위치의 대기 오염 정보를 확인하세요.
        </p>
        {/* 대기 질과 오염 물질 정보를 표시하는 섹션 */}
        <div className="info-container-unique">
          {/* 통합대기환경지수 섹션 */}
          <div className="air-quality-section-unique">
            <h1 className="air-quality-title-unique">통합대기환경지수</h1>
            {khaiInfo.image ? (
              <img
                className="air-quality-image-unique"
                src={khaiInfo.image}
                alt="통합대기환경지수 이미지"
              />
            ) : (
              <p>데이터 없음</p>
            )}
            <p className="air-quality-status-unique">{khaiInfo.status}</p>
            <p className="air-quality-value-unique">{khaiInfo.value} µg/m³</p>
          </div>

          {/* 각 오염 물질 수치 표시 */}
          <div className="pollutants-container-unique">
            <div className="pollutants-row-unique">
              {/* PM10 */}
              <div className="pollutant-item-unique">
                <h2>PM10</h2>
                {pm10Info.image ? (
                  <img
                    className="pollutant-image-unique"
                    src={pm10Info.image}
                    alt="PM10 등급 이미지"
                  />
                ) : (
                  <p>데이터 없음</p>
                )}
                <p className="pollutant-status-unique">{pm10Info.status}</p>
                <p className="pollutant-value-unique">{pm10Info.value} µg/m³</p>
              </div>
              {/* PM2.5 */}
              <div className="pollutant-item-unique">
                <h2>PM2.5</h2>
                {pm25Info.image ? (
                  <img
                    className="pollutant-image-unique"
                    src={pm25Info.image}
                    alt="PM2.5 등급 이미지"
                  />
                ) : (
                  <p>데이터 없음</p>
                )}
                <p className="pollutant-status-unique">{pm25Info.status}</p>
                <p className="pollutant-value-unique">{pm25Info.value} µg/m³</p>
              </div>
              {/* NO2 */}
              <div className="pollutant-item-unique">
                <h2>NO2</h2>
                {no2Info.image ? (
                  <img
                    className="pollutant-image-unique"
                    src={no2Info.image}
                    alt="NO2 등급 이미지"
                  />
                ) : (
                  <p>데이터 없음</p>
                )}
                <p className="pollutant-status-unique">{no2Info.status}</p>
                <p className="pollutant-value-unique">{no2Info.value} ppm</p>
              </div>
            </div>
            <div className="pollutants-row-unique">
              {/* O3 */}
              <div className="pollutant-item-unique">
                <h2>O3</h2>
                {o3Info.image ? (
                  <img
                    className="pollutant-image-unique"
                    src={o3Info.image}
                    alt="O3 등급 이미지"
                  />
                ) : (
                  <p>데이터 없음</p>
                )}
                <p className="pollutant-status-unique">{o3Info.status}</p>
                <p className="pollutant-value-unique">{o3Info.value} ppm</p>
              </div>
              {/* CO */}
              <div className="pollutant-item-unique">
                <h2>CO</h2>
                {coInfo.image ? (
                  <img
                    className="pollutant-image-unique"
                    src={coInfo.image}
                    alt="CO 등급 이미지"
                  />
                ) : (
                  <p>데이터 없음</p>
                )}
                <p className="pollutant-status-unique">{coInfo.status}</p>
                <p className="pollutant-value-unique">{coInfo.value} ppm</p>
              </div>
              {/* SO2 */}
              <div className="pollutant-item-unique">
                <h2>SO2</h2>
                {so2Info.image ? (
                  <img
                    className="pollutant-image-unique"
                    src={so2Info.image}
                    alt="SO2 등급 이미지"
                  />
                ) : (
                  <p>데이터 없음</p>
                )}
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
            {/* PM10 미세먼지*/}
            <SwiperSlide>
              <h3>PM10</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={airPollutionData.sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pm10" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </SwiperSlide>
            {/* PM2.5 초미세먼지*/}
            <SwiperSlide>
              <h3>PM2.5</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={airPollutionData.sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pm25" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </SwiperSlide>
            {/* NO2 이산화질소 */}
            <SwiperSlide>
              <h3>NO2</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={airPollutionData.sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="no2" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </SwiperSlide>
            {/* O3 오존 */}
            <SwiperSlide>
              <h3>O3</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={airPollutionData.sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="o3" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </SwiperSlide>
            {/* CO 일산화탄소 */}
            <SwiperSlide>
              <h3>CO</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={airPollutionData.sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="co" stroke="#0088FE" />
                </LineChart>
              </ResponsiveContainer>
            </SwiperSlide>
            {/* SO2 아황산가스 */}
            <SwiperSlide>
              <h3>SO2</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={airPollutionData.sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                  )}
                >
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
        <div className="map-container-unique">
          <h3>대기질 예측 지도</h3>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={50}
            slidesPerView={1}
          >
            {airPollutionImages.map((pollutionData) => (
              <SwiperSlide key={pollutionData.informCode}>
                <div style={{ width: "100%", height: 400 }}>
                  <img
                    src={pollutionData.images[imageIndex]}
                    alt={pollutionData.informCode}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AQIDetails;
