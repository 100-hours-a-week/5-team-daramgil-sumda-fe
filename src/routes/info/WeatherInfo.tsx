import React, { useState, useEffect, useRef } from "react";
import "./styles/WeatherInfo.css";
import humidityIcon from "../../assets/weather/humidity.png";
import precipitationIcon from "../../assets/weather/precipitation.png";
import windIcon from "../../assets/weather/wind.png";
import uvIcon from "../../assets/weather/uv.png";
import pressureIcon from "../../assets/weather/pressure.png";
import visibilityIcon from "../../assets/weather/visibility.png";
import LocationDropdown from "../../components/LocationDropdown";
import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiFog,
  WiShowers,
  WiStormShowers,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

interface WeatherIconMap {
  [key: string]: JSX.Element;
}

const weatherMainToKorean: { [key: string]: string } = {
  Thunderstorm: "천둥번개",
  Drizzle: "이슬비",
  Rain: "비",
  Snow: "눈",
  Mist: "엷은 안개",
  Smoke: "연기",
  Haze: "실안개",
  Dust: "먼지",
  Fog: "안개",
  Sand: "모래",
  Ash: "화산재",
  Squall: "돌풍",
  Tornado: "토네이도",
  Clear: "맑음",
  Clouds: "구름",
};

const weatherIconMap: WeatherIconMap = {
  Thunderstorm: <WiThunderstorm />,
  Drizzle: <WiShowers />,
  Rain: <WiShowers />,
  Snow: <WiSnow />,
  Mist: <WiFog />,
  Smoke: <WiFog />,
  Haze: <WiFog />,
  Dust: <WiFog />,
  Fog: <WiFog />,
  Sand: <WiFog />,
  Ash: <WiFog />,
  Squall: <WiStormShowers />,
  Tornado: <WiStormShowers />,
  Clear: <WiDaySunny />,
  Clouds: <WiCloudy />,
};

const WeatherInfo: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const forecastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchWeatherData(id)
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
        `${process.env.REACT_APP_API_URL}/acweather?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        console.error("날씨 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류가 발생했습니다:", error);
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

  const scrollLeft = () => {
    if (forecastRef.current) {
      forecastRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (forecastRef.current) {
      forecastRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  const formatUnixTime = (unixTime: number, index: number) => {
    const date = new Date(unixTime * 1000);
    if (index === 0) return "오늘";
    if (index === 1) return "내일";
    if (index === 2) return "모레";
    return `${index}일후`;
  };

  const executeIcon = (weatherMain: string) => {
    if (!weatherMain) {
      console.warn("No weatherMain provided");
      return <WiDaySunny />;
    }
    const icon = weatherIconMap[weatherMain];
    if (!icon) {
      console.warn(`No icon mapped for weatherMain: ${weatherMain}`);
      return <WiDaySunny />;
    }
    return icon;
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
              <div className="weather-icon-container">
                {executeIcon(
                  weatherData?.weatherDataJson?.current?.weather[0]?.main
                )}
              </div>
              <p className="weather-status">
                {
                  weatherMainToKorean[
                    weatherData?.weatherDataJson?.current?.weather[0]?.main
                  ]
                }
              </p>
              <p className="weather-current-temperature">
                {Math.round(weatherData?.weatherDataJson?.current?.temp)}°C
              </p>
              <p className="weather-precipitation">
                체감온도{" "}
                {Math.round(weatherData?.weatherDataJson?.current?.feels_like)}
                °C
              </p>
            </div>

            <div className="detail-forecast-section">
              <h3 className="forecast-title">상세 날씨 정보</h3>
              <div className="detail-forecast-items">
                {[
                  {
                    label: "습도",
                    value: `${weatherData?.weatherDataJson?.current?.humidity}%`,
                    icon: humidityIcon,
                  },
                  {
                    label: "기압",
                    value: `${weatherData?.weatherDataJson?.current?.pressure} hPa`,
                    icon: pressureIcon,
                  },
                  {
                    label: "바람",
                    value: `${weatherData?.weatherDataJson?.current?.wind_speed} m/s`,
                    icon: windIcon,
                  },
                  {
                    label: "가시거리",
                    value: `${weatherData?.weatherDataJson?.current?.visibility} m`,
                    icon: visibilityIcon,
                  },
                  {
                    label: "자외선",
                    value: `${weatherData?.weatherDataJson?.current?.uvi}`,
                    icon: uvIcon,
                  },
                  {
                    label: "이슬점",
                    value: `${weatherData?.weatherDataJson?.current?.dew_point}°C`,
                    icon: precipitationIcon, // Example icon, you can replace it
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
            <div className="forecast-section">
              <h3 className="forecast-title">일별 예보</h3>
              <div className="daily-forecast-items">
                {weatherData?.weatherDataJson?.daily?.map(
                  (forecast: any, index: number) => {
                    const weatherMain = forecast.weather[0]?.main;
                    const icon = executeIcon(weatherMain);
                    return (
                      <div key={index} className="daily-forecast-item">
                        <div className="day-info">
                          <p className="day">
                            {formatUnixTime(forecast.dt, index)}
                          </p>
                        </div>
                        <div className="forecast-icon-container">{icon}</div>
                        <p className="weather-status">
                          {weatherMainToKorean[forecast.weather[0]?.main]}
                        </p>
                        <p className="temperature">
                          최저 {Math.round(forecast.temp.min)}° / 최고{" "}
                          {Math.round(forecast.temp.max)}°
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherInfo;
