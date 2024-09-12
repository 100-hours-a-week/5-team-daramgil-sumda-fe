import React, { useState, useEffect, useRef } from "react";
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
} from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

import {
  PiSmileyWinkLight,
  PiSmileyLight,
  PiSmileyMehLight,
  PiSmileySadLight,
  PiSmileyXEyesLight,
  PiSmileyMeltingLight,
} from "react-icons/pi";

import callout from "../../assets/info.png";

import { toast } from "react-toastify";
import useMissionStore from "../../store/useMissionStore";

const AQIDetails: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [airPollutionData, setAirPollutionData] = useState<any[]>([]);
  const [airQualityData, setAirQualityData] = useState<any | null>(null);
  const [airPollutionImages, setAirPollutionImages] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [id, setId] = useState<number | null>(null);

  const prevIdRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { completeDailyAir } = useMissionStore();

  // id가 변경될 때마다 데이터 요청
  useEffect(() => {
    if (id !== null && id !== undefined && id !== prevIdRef.current) {
      prevIdRef.current = id;

      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // 새로운 데이터 요청
      fetchAirPollutionData(id, abortControllerRef.current.signal);
      fetchAirQualityData(id, abortControllerRef.current.signal);
      fetchAirPollutionImages(abortControllerRef.current.signal);
    }
  }, [id]);

  // 대기 오염 데이터 요청 함수
  const fetchAirPollutionData = async (id: number, signal: AbortSignal) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/time?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
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
    } catch (error) {
      handleFetchError(error);
    }
  };

  // 대기질 데이터 요청 함수
  const fetchAirQualityData = async (id: number, signal: AbortSignal) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/current?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAirQualityData(data.data);
    } catch (error) {
      handleFetchError(
        error,
        "현재 위치의 대기질 데이터를 가져오는데 실패했습니다."
      );
    }
  };

  // 대기 오염 이미지 요청 함수
  const fetchAirPollutionImages = async (signal: AbortSignal) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/air/image`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
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
      handleFetchError(error);
    }
  };

  // 데이터 요청 오류 처리 함수
  const handleFetchError = (error: any, customErrorMessage?: string) => {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error(error);
        if (customErrorMessage) setError(customErrorMessage);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
  };

  // 이미지 슬라이더 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 출석 체크 호출
    const checkAir = async () => {
      try {
        await completeDailyAir();
        toast.success("출석 미션을 완료했습니다. 도토리 1개가 지급됩니다.");
      } catch (error) {
        toast.error("이미 완료된 미션입니다."); // 에러 시 처리
      }
    };

    checkAir();
  }, [completeDailyAir]);

  // 위치 선택 핸들러
  const handleLocationSelect = (location: string, id: number) => {
    setId(id);
  };

  // 대기질 등급에 따른 이미지와 상태 정보
  const airQualityGrades: {
    [key: string]: { icon: JSX.Element; status: string };
  } = {
    "1": {
      status: "좋음",
      icon: <PiSmileyWinkLight style={{ color: "white" }} />,
    },
    "2": {
      status: "보통",
      icon: <PiSmileyLight style={{ color: "white" }} />,
    },
    "3": {
      status: "나쁨",
      icon: <PiSmileyMehLight style={{ color: "white" }} />,
    },
    "4": {
      status: "매우 나쁨",
      icon: <PiSmileySadLight style={{ color: "white" }} />,
    },
    "5": {
      status: "위험",
      icon: <PiSmileyXEyesLight style={{ color: "white" }} />,
    },
  };
  const getAirQualityInfo = (value: string | null, grade: string | null) => {
    if (!value || !grade) {
      return { icon: null, status: "데이터 없음", value: "데이터 없음" };
    }
    const info = airQualityGrades[grade] || {
      icon: null,
      status: "데이터 없음",
    };
    return { ...info, value };
  };

  // 대기질 정보 객체
  const pollutantInfo = {
    khai: getAirQualityInfo(
      airQualityData?.khaiValue || "데이터 없음",
      airQualityData?.khaiGrade || "데이터 없음"
    ),
    pm10: getAirQualityInfo(
      airQualityData?.pm10 || "데이터 없음",
      airQualityData?.pm10Grade || "데이터 없음"
    ),
    pm25: getAirQualityInfo(
      airQualityData?.pm25 || "데이터 없음",
      airQualityData?.pm25Grade || "데이터 없음"
    ),
    no2: getAirQualityInfo(
      airQualityData?.no2 || "데이터 없음",
      airQualityData?.no2Grade || "데이터 없음"
    ),
    o3: getAirQualityInfo(
      airQualityData?.o3 || "데이터 없음",
      airQualityData?.o3Grade || "데이터 없음"
    ),
    co: getAirQualityInfo(
      airQualityData?.co || "데이터 없음",
      airQualityData?.coGrade || "데이터 없음"
    ),
    so2: getAirQualityInfo(
      airQualityData?.so2 || "데이터 없음",
      airQualityData?.so2Grade || "데이터 없음"
    ),
  };

  // 오염물질 이름과 단위 정보
  const pollutantNames: { [key: string]: string } = {
    pm10: "미세먼지",
    pm25: "초미세먼지",
    no2: "이산화질소",
    o3: "오존",
    co: "일산화탄소",
    so2: "아황산가스",
    khai: "통합대기환경지수",
  };

  const getUnit = (key: string) => {
    if (key === "pm10" || key === "pm25") return "㎍/㎥";
    if (key === "khai") return "";
    return "ppm";
  };
  // 데이터가 업데이트될 때 최대값 계산
  const calculateMaxValue = (data: any[], pollutant: string) => {
    return Math.max(...data.map((entry) => entry[pollutant] || 0));
  };
  // 대기질 등급에 따른 클래스명을 설정하는 함수
  const airQualityLevelClass = `level${airQualityData?.khaiGrade || 1}`; // 기본값을 1로 설정

  return (
    <div className={`aqidetails-page ${airQualityLevelClass}`}>
      <div className="aqidetail-container">
        <LocationDropdown onLocationSelect={handleLocationSelect} />
        <div className="aqidetails-container-unique">
          <div className="info-container-unique">
            <div className="air-quality-section-unique">
              {/* <h1 className="air-quality-title-unique">통합대기환경지수</h1> */}
              <div className="air-quality-status-container-unique">
                <p className="air-quality-status-unique">
                  {pollutantInfo.khai.status}
                </p>
                {pollutantInfo.khai.icon ? (
                  <div className="air-quality-icon-unique">
                    {pollutantInfo.khai.icon}
                  </div>
                ) : (
                  <p>데이터 없음</p>
                )}
              </div>
              <p className="air-quality-value-unique">
                {pollutantInfo.khai.value} {getUnit("khai")}
              </p>
              <p className="air-quality-name">통합대기환경지수</p>
            </div>

            <div className="pollutants-container-unique">
              <div className="pollutants-items-unique">
                {Object.entries(pollutantInfo).map(
                  ([key, info]) =>
                    key !== "khai" && (
                      <div className="pollutant-item-unique" key={key}>
                        <h2>{pollutantNames[key] || key.toUpperCase()}</h2>
                        {info.icon ? (
                          <div className="pollutant-icon-unique">
                            {info.icon}
                          </div>
                        ) : (
                          <p>데이터 없음</p>
                        )}
                        <p className="pollutant-status-unique">{info.status}</p>
                        <p className="pollutant-value-unique">
                          {info.value} {getUnit(key)}
                        </p>
                      </div>
                    )
                )}
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
              {["pm10", "pm25", "no2", "o3", "co", "so2"].map((pollutant) => {
                // 최대값 계산
                const maxPollutantValue = calculateMaxValue(
                  airPollutionData,
                  pollutant
                );

                return (
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
                        <XAxis dataKey="dataTime" />
                        <YAxis domain={[0, maxPollutantValue]} />{" "}
                        {/* YAxis domain 수정 */}
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={pollutant}
                          stroke="#45857d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </SwiperSlide>
                );
              })}
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
                      style={{
                        margin: "0 auto",
                        width: "290px",
                        height: "100%",
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="allert-container-unique">
            <img style={{ width: "12%", height: "12%" }} src={callout} />
            <p>
              데이터는 실시간 관측된 자료이며
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
