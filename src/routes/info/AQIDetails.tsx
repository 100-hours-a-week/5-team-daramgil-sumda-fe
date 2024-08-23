import React, { useState, useEffect } from "react";
import "./styles/AQIDetails.css";
import LocationDropdown from "../../components/LocationDropdown";
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
import good from "../../assets/grade/good.png";
import moderate from "../../assets/grade/moderate.png";
import unhealthy from "../../assets/grade/unhealthy.png";
import veryUnhealthy from "../../assets/grade/very_unhealthy.png";
import hazardous from "../../assets/grade/hazardous.png";

const AQIDetails: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [airPollutionData, setAirPollutionData] = useState<any[]>([]);
  const [airQualityData, setAirQualityData] = useState<any | null>(null);
  const [airPollutionImages, setAirPollutionImages] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    fetchAirPollutionData(id || 1);
    fetchAirQualityData(id || 1);
    fetchAirPollutionImages();
  }, [id]);

  const fetchAirPollutionData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/time?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
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
    } catch (error) {
      console.error("Error fetching air pollution data:", error);
    }
  };

  const fetchAirQualityData = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAirQualityData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("현재 위치의 대기질 데이터를 가져오는데 실패했습니다.");
    }
  };

  const fetchAirPollutionImages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/image`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAirPollutionImages(
          Array.isArray(data.data.airPollutionImages)
            ? data.data.airPollutionImages
            : []
        );
      } else {
        console.error("Failed to fetch air pollution images.");
        setAirPollutionImages([]);
      }
    } catch (error) {
      console.error("Error fetching air pollution images:", error);
      setAirPollutionImages([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const selectLocation = (location: string, id: number) => {
    if (location === "등록하기") {
      window.location.href = "/favorites";
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
              setId(0); // 초기화 시도
              resolve(locationData);
            },
            async (error) => {
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

  const airQualityGrades: { [key: string]: { image: string; status: string } } =
    {
      "1": { image: good, status: "좋음" },
      "2": { image: moderate, status: "보통" },
      "3": { image: unhealthy, status: "나쁨" },
      "4": { image: veryUnhealthy, status: "매우 나쁨" },
      "5": { image: hazardous, status: "위험" },
    };

  const getAirQualityInfo = (value: string, grade: string) => {
    const info = airQualityGrades[grade] || {
      image: "",
      status: "데이터 없음",
    };
    return { ...info, value };
  };

  const pollutantInfo = {
    khai: getAirQualityInfo(
      airQualityData?.khaiValue,
      airQualityData?.khaiGrade
    ),
    pm10: getAirQualityInfo(
      airQualityData?.pm10Value,
      airQualityData?.pm10Grade
    ),
    pm25: getAirQualityInfo(
      airQualityData?.pm25Value,
      airQualityData?.pm25Grade
    ),
    no2: getAirQualityInfo(airQualityData?.no2Value, airQualityData?.no2Grade),
    o3: getAirQualityInfo(airQualityData?.o3Value, airQualityData?.o3Grade),
    co: getAirQualityInfo(airQualityData?.coValue, airQualityData?.coGrade),
    so2: getAirQualityInfo(airQualityData?.so2Value, airQualityData?.so2Grade),
  };

  if (!airQualityData) {
    return <div>Loading...</div>;
  }

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
        <div className="info-container-unique">
          <div className="air-quality-section-unique">
            <h1 className="air-quality-title-unique">통합대기환경지수</h1>
            {pollutantInfo.khai.image ? (
              <img
                className="air-quality-image-unique"
                src={pollutantInfo.khai.image}
                alt="통합대기환경지수 이미지"
              />
            ) : (
              <p>데이터 없음</p>
            )}
            <p className="air-quality-status-unique">
              {pollutantInfo.khai.status}
            </p>
            <p className="air-quality-value-unique">
              {pollutantInfo.khai.value}
            </p>
          </div>

          <div className="pollutants-container-unique">
            {Object.entries(pollutantInfo).map(
              ([key, info]) =>
                key !== "khai" && (
                  <div className="pollutant-item-unique" key={key}>
                    <h2>{key.toUpperCase()}</h2>
                    {info.image ? (
                      <img
                        className="pollutant-image-unique"
                        src={info.image}
                        alt={`${key} 등급 이미지`}
                      />
                    ) : (
                      <p>데이터 없음</p>
                    )}
                    <p className="pollutant-status-unique">{info.status}</p>
                    <p className="pollutant-value-unique">
                      {info.value}{" "}
                      {key === "pm10" || key === "pm25" ? "㎍/㎥" : "ppm"}
                    </p>
                  </div>
                )
            )}
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
            {["pm10", "pm25", "no2", "o3", "co", "so2"].map((pollutant) => (
              <SwiperSlide key={pollutant}>
                <h3>{pollutant.toUpperCase()}</h3>
                <ResponsiveContainer width="100%" height={250}>
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
                    {/* <Legend /> */}
                    <Line
                      type="monotone"
                      dataKey={pollutant}
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SwiperSlide>
            ))}
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
        <div className="map-container-unique">
          <p>
            * 데이터는 실시간 관측된 자료이며
            <br />
            측정소 현지 사정이나 데이터의 <br />
            수신상태에 따라 미수신 될 수 있음 <br />
            <br />
            출처 : 환경부/한국환경공단
          </p>
        </div>
      </div>
    </div>
  );
};

export default AQIDetails;
