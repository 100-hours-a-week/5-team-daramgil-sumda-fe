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
  ResponsiveContainer,
  Legend,
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
import callout from "../../assets/info.png";

const AQIDetails: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [airPollutionData, setAirPollutionData] = useState<any[]>([]);
  const [airQualityData, setAirQualityData] = useState<any | null>(null);
  const [airPollutionImages, setAirPollutionImages] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchAirPollutionData(id);
      fetchAirQualityData(id);
      fetchAirPollutionImages();
    }
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
      console.log(data);
      const transformedData = data.data.map((entry: any) => ({
        time: entry.dataTime,
        khai: entry.khaiValue,
        pm10: entry.pm10,
        pm25: entry.pm25,
        o3: entry.o3,
        no2: entry.no2,
        co: entry.co,
        so2: entry.so2,
      }));
      setAirPollutionData(transformedData);
      console.log(airPollutionData);
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

  const handleLocationSelect = (location: string, id: number) => {
    setId(id); // LocationDropdown에서 전달된 ID로 데이터를 가져옴
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

  const pollutantNames: { [key: string]: string } = {
    pm10: "미세먼지",
    pm25: "초미세먼지",
    no2: "이산화질소",
    o3: "오존",
    co: "일산화탄소",
    so2: "아황산가스",
    khai: "통합대기환경지수",
  };

  // if (!airQualityData) {
  //   return (
  //     <div className="AQI-Loading-container">
  //       대기 정보를 조회 중입니다. <br />
  //       잠시만 기다려 주세요
  //     </div>
  //   );
  // }

  return (
    <div className="aqidetails-page">
      <div className="info-container">
        <LocationDropdown onLocationSelect={handleLocationSelect} />
        <div className="aqidetails-container-unique">
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
                      <h2>{pollutantNames[key] || key.toUpperCase()}</h2>
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
                  <h4>
                    {pollutantNames[pollutant] || pollutant.toUpperCase()}
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={airPollutionData.sort(
                        (a, b) =>
                          new Date(a.time).getTime() -
                          new Date(b.time).getTime()
                      )}
                      margin={{ top: 10, left: -10, right: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dateTime" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey={pollutant}
                        stroke="#8884d8"
                        strokeWidth={2}
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
          <div className="allert-container-unique">
            <img style={{ width: "12%", height: "12%" }} src={callout} />
            <p>
              * 데이터는 실시간 관측된 자료이며
              <br />
              측정소 현지 사정이나 데이터의 <br />
              수신상태에 따라 미수신 될 수 있습니다. <br />
              <br />
              출처 : 환경부/한국환경공단
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIDetails;
