import React, { useState, useEffect, useRef } from "react";
import "./styles/WeatherInfo.css";
import sun from "../../assets/weather/sun.png";
import cloud from "../../assets/weather/cloud.png";
import rain from "../../assets/weather/rainy.png";
import snow from "../../assets/weather/snow.png";
import humidityIcon from "../../assets/weather/humidity.png";
import precipitationIcon from "../../assets/weather/precipitation.png";
import windIcon from "../../assets/weather/wind.png";
import LocationDropdown from "../../components/LocationDropdown";

// 날씨 유형에 따른 아이콘 매핑
const weatherIcons: { [key: string]: string } = {
  맑음: sun,
  흐림: cloud,
  비: rain,
  눈: snow,
  구름많음: cloud,
};

const WeatherInfo: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가

  const forecastRef = useRef<HTMLDivElement>(null); // Ref를 사용하여 forecast-scroll에 접근

  // 컴포넌트가 처음 렌더링될 때 현재 위치 로드
  useEffect(() => {
    loadCurrentLocation();
  }, []);

  // 위치 ID가 변경될 때마다 날씨 데이터 가져오기
  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        fetchWeatherData(id),
        fetchHourlyWeatherData(id),
        fetchDailyWeatherData(id),
      ])
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("데이터 로드 중 오류 발생:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const fetchWeatherData = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/weather/current?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData((prevData: any) => ({
          ...prevData,
          currentWeather: {
            weather_type: data.data.weather,
            current_temperature: parseFloat(data.data.temperature),
            precipitation: data.data.precipitationLastHour,
            wind_speed: data.data.windSpeed,
            wind_direction: data.data.windDirection,
            humidity: data.data.humidity,
            description: "", // 필요 시 데이터 조정
          },
        }));
      } else {
        console.error("날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  const fetchHourlyWeatherData = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/weather/time?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.data.sort(
          (a: any, b: any) =>
            a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
        );

        setWeatherData((prevData: any) => ({
          ...prevData,
          hourlyForecast: sortedData.map((item: any) => ({
            time: `${item.time.slice(0, 2)}:${item.time.slice(2, 4)}`,
            weather_type: item.weather.sky,
            TA: "", // 온도 데이터가 있으면 여기서 매핑
            ...item.weather,
          })),
        }));
      } else {
        console.error("시간별 날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error(
        "시간별 날씨 데이터를 가져오는 중 오류가 발생했습니다:",
        error
      );
    }
  };

  const fetchDailyWeatherData = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/weather/days?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData((prevData: any) => ({
          ...prevData,
          dailyForecast: data.data.map((item: any, index: number) => {
            let dayLabel = `Day ${index + 1}`;
            switch (index) {
              case 0:
                dayLabel = "내일";
                break;
              case 1:
                dayLabel = "모레";
                break;
              case 2:
                dayLabel = "3일 후";
                break;
              case 3:
                dayLabel = "4일 후";
                break;
              default:
                dayLabel = `${index + 1}일 후`;
            }
            return {
              day: dayLabel,
              max_temperature: parseFloat(item.maxTemperature),
              min_temperature: parseFloat(item.minTemperature),
              weather_type: item.weatherPm || item.weatherAm, // weatherPm이 없으면 weatherAm 사용
            };
          }),
        }));
      } else {
        console.error("일별 날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error(
        "일별 날씨 데이터를 가져오는 중 오류가 발생했습니다:",
        error
      );
    }
  };

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
          throw new Error("위치 데이터를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        if (data.status === 200 && data.data.district) {
          setSelectedLocation(data.data.district);
          setId(data.data.id);
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

  // 날씨 아이콘 선택
  const weatherIcon =
    weatherIcons[weatherData?.currentWeather?.weather_type] || sun;

  // 스크롤을 왼쪽으로 이동하는 함수
  const scrollLeft = () => {
    if (forecastRef.current) {
      forecastRef.current.scrollBy({
        left: -100, // 스크롤할 픽셀 값 (왼쪽으로)
        behavior: "smooth",
      });
    }
  };

  // 스크롤을 오른쪽으로 이동하는 함수
  const scrollRight = () => {
    if (forecastRef.current) {
      forecastRef.current.scrollBy({
        left: 100, // 스크롤할 픽셀 값 (오른쪽으로)
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="weatherinfo-page">
      <div className="info-container">
        <LocationDropdown
          selectedLocation={selectedLocation}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          selectLocation={selectLocation}
          loadCurrentLocation={loadCurrentLocation}
        />
        {loading ? (
          <div className="loading">
            <p>날씨 정보를 불러오는 중입니다. 잠시만 기다려 주세요...</p>
          </div>
        ) : (
          <>
            <div className="weather-section">
              <img
                className="weather-icon"
                src={weatherIcon}
                alt="날씨 아이콘"
              />
              <p className="weather-status">
                {weatherData?.currentWeather?.weather_type}
              </p>
              <p className="weather-current-temperature">
                {weatherData?.currentWeather?.current_temperature}°C
              </p>
              <p className="weather-precipitation">
                {weatherData?.currentWeather?.precipitation}
              </p>
              <p className="weather-description"></p>
            </div>

            {/* 시간별 예보 섹션 */}
            <div className="forecast-section">
              <h3 className="forecast-title">시간별 예보</h3>
              <div className="forecast-controls">
                <button onClick={scrollLeft} className="scroll-button">
                  &#10094;
                </button>
                <div className="forecast-scroll" ref={forecastRef}>
                  <div className="forecast-items">
                    {weatherData?.hourlyForecast?.map(
                      (forecast: any, index: number) => {
                        return (
                          <div key={index} className="forecast-item">
                            <p>{forecast.time}</p>
                            <img
                              className="forecast-icon"
                              src={weatherIcons[forecast.weather_type] || sun}
                              alt="날씨 아이콘"
                            />
                            <p>{forecast.weather_type}</p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <button onClick={scrollRight} className="scroll-button">
                  &#10095;
                </button>
              </div>
            </div>

            {/* 일별 예보 섹션 */}
            <div className="daily-forecast-section">
              <h3 className="forecast-title">일별 예보</h3>
              <div className="daily-forecast-items">
                {weatherData?.dailyForecast?.map(
                  (forecast: any, index: number) => (
                    <div key={index} className="daily-forecast-item">
                      <div className="day-info">
                        <p className="day">{forecast.day || "일자"}</p>
                      </div>
                      <img
                        className="forecast-icon"
                        src={weatherIcons[forecast.weather_type] || sun}
                        alt="날씨 아이콘"
                      />
                      <p className="temperature">
                        최저 {forecast.min_temperature}° / 최고{" "}
                        {forecast.max_temperature}°
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 상세 날씨 섹션 */}
            <div className="detail-forecast-section">
              <h3 className="forecast-title">상세 날씨 정보</h3>
              <div className="detail-forecast-items">
                {[
                  {
                    label: "날씨",
                    value: weatherData?.currentWeather?.weather_type,
                    icon: weatherIcon,
                  },
                  {
                    label: "강수량",
                    value: weatherData?.currentWeather?.precipitation,
                    icon: precipitationIcon,
                  },
                  {
                    label: "바람",
                    value: `${weatherData?.currentWeather?.wind_speed} m/s | ${weatherData?.currentWeather?.wind_direction}`,
                    icon: windIcon,
                  },
                  {
                    label: "습도",
                    value: `${weatherData?.currentWeather?.humidity}%`,
                    icon: humidityIcon,
                  },
                ].map((item, index) => (
                  <div key={index} className="detail-forecast-item">
                    <div className="detail-forecast-label">
                      <img
                        className="detail-icon"
                        src={item.icon}
                        alt={`${item.label} 아이콘`}
                      />
                      <p>{item.label}</p>
                    </div>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherInfo;
