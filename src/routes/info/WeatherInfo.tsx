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
  WiDaySunnyOvercast,
  WiDayHaze,
  WiDayCloudy,
  WiCloud,
  WiCloudy,
  WiFog,
  WiShowers,
  WiDayShowers,
  WiStormShowers,
  WiDayStormShowers,
  WiRain,
  WiCloudyGusts,
  WiDayCloudyGusts,
  WiSnow,
  WiDaySnow,
  WiSnowflakeCold,
  WiSleet,
  WiHail,
  WiRainMix,
  WiThermometer,
  WiThermometerExterior,
  WiWindy,
  WiNightClear,
  WiNightAltPartlyCloudy,
  WiNightAltCloudyHigh,
  WiNightAltCloudy,
  WiNightAltShowers,
  WiNightAltStormShowers,
  WiNightAltCloudyGusts,
  WiNightAltSnow,
} from "react-icons/wi";

interface WeatherIconMap {
  [key: number]: JSX.Element;
}

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

  const weatherIconMap: WeatherIconMap = {
    1: <WiDaySunny />,
    2: <WiDaySunnyOvercast />,
    3: <WiDaySunnyOvercast />,
    4: <WiDaySunnyOvercast />,
    5: <WiDayHaze />,
    6: <WiDayCloudy />,
    7: <WiCloud />,
    8: <WiCloudy />,
    11: <WiFog />,
    12: <WiShowers />,
    13: <WiDayShowers />,
    14: <WiDayShowers />,
    15: <WiStormShowers />,
    16: <WiDayStormShowers />,
    17: <WiDayStormShowers />,
    18: <WiRain />,
    19: <WiCloudyGusts />,
    20: <WiDayCloudyGusts />,
    21: <WiDayCloudyGusts />,
    22: <WiSnow />,
    23: <WiDaySnow />,
    24: <WiSnowflakeCold />,
    25: <WiSleet />,
    26: <WiHail />,
    29: <WiRainMix />,
    30: <WiThermometer />,
    31: <WiThermometerExterior />,
    32: <WiWindy />,
    33: <WiNightClear />,
    34: <WiNightAltPartlyCloudy />,
    35: <WiNightAltPartlyCloudy />,
    36: <WiNightAltPartlyCloudy />,
    37: <WiNightAltCloudyHigh />,
    38: <WiNightAltCloudy />,
    39: <WiNightAltShowers />,
    40: <WiNightAltShowers />,
    41: <WiNightAltStormShowers />,
    42: <WiNightAltStormShowers />,
    43: <WiNightAltCloudyGusts />,
    44: <WiNightAltSnow />,
    500: <WiRain />, // Example for Rain
    501: <WiStormShowers />, // Example for Heavy Rain
    802: <WiCloud />, // Example for Cloudy
    803: <WiCloudy />, // Example for Mostly Cloudy
    804: <WiCloudyGusts />, // Example for Overcast
  };

  const executeIcon = (weatherIcon: number) => {
    if (!weatherIcon) {
      console.warn("No weatherIcon provided");
      return <WiDaySunny />;
    }
    const icon = weatherIconMap[weatherIcon];
    if (!icon) {
      console.warn(`No icon mapped for weatherIcon: ${weatherIcon}`);
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
                  weatherData?.weatherDataJson?.current?.weather[0]?.id
                )}
              </div>
              <p className="weather-status">
                {weatherData?.weatherDataJson?.current?.weather[0]?.description}
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
                    label: "UV Index",
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
                    const weatherId = forecast.weather[0]?.id;
                    const icon = executeIcon(weatherId);
                    return (
                      <div key={index} className="daily-forecast-item">
                        <div className="day-info">
                          <p className="day">
                            {formatUnixTime(forecast.dt, index)}
                          </p>
                        </div>
                        <div className="forecast-icon-container">{icon}</div>
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
