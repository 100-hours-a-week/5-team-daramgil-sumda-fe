import React, { useState, useEffect, useRef } from "react";
import "./styles/WeatherInfo.css";
import humidityIcon from "../../assets/weather/humidity.png";
import precipitationIcon from "../../assets/weather/precipitation.png";
import windIcon from "../../assets/weather/wind.png";
import uvIcon from "../../assets/weather/uv.png";
import pressureIcon from "../../assets/weather/pressure.png";
import visibilityIcon from "../../assets/weather/visibility2.png";
import LocationDropdown from "../../components/LocationDropdown";
import {
  WiDaySunny,
  WiCloudy,
  WiFog,
  WiShowers,
  WiStormShowers,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

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

// WeatherInfo.tsx
const weatherClassMap: { [key: string]: string } = {
  Clear: "daysunny",
  Clouds: "cloudy",
  Rain: "showers",
  Snow: "snow",
  Thunderstorm: "thunderstorm",
  Fog: "fog",
  StormShowers: "stormshowers",
  // 필요한 경우 더 많은 매핑 추가
};

const weatherIconMap: WeatherIconMap = {
  Thunderstorm: <WiThunderstorm style={{ color: "white" }} />,
  Drizzle: <WiShowers style={{ color: "white" }} />,
  Rain: <WiShowers style={{ color: "white" }} />,
  Snow: <WiSnow style={{ color: "white" }} />,
  Mist: <WiFog style={{ color: "white" }} />,
  Smoke: <WiFog style={{ color: "white" }} />,
  Haze: <WiFog style={{ color: "white" }} />,
  Dust: <WiFog style={{ color: "white" }} />,
  Fog: <WiFog style={{ color: "white" }} />,
  Sand: <WiFog style={{ color: "white" }} />,
  Ash: <WiFog style={{ color: "white" }} />,
  Squall: <WiStormShowers style={{ color: "white" }} />,
  Tornado: <WiStormShowers style={{ color: "white" }} />,
  Clear: <WiDaySunny style={{ color: "white" }} />,
  Clouds: <WiCloudy style={{ color: "white" }} />,
};

const WeatherInfo: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const forecastRef = useRef<HTMLDivElement>(null);

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

  const handleLocationSelect = (location: string, id: number) => {
    setId(id); // LocationDropdown에서 전달된 ID로 데이터를 가져옴
  };

  const formatUnixTime = (unixTime: number) => {
    const date = new Date(unixTime * 1000); // unixTime을 Date 객체로 변환
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = date.getDate(); // 일을 추출
    return `${month}/${day}`; // "월/일" 형식으로 반환
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

  const getWeatherClass = (weatherMain: string | undefined) => {
    if (!weatherMain) {
      return "default";
    }
    return weatherClassMap[weatherMain] || "default";
  };

  // 스크롤할 요소를 참조하기 위해 useRef 사용
  const scrollRef = useRef<HTMLDivElement>(null);
  // 왼쪽으로 스크롤
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -110, // 스크롤할 픽셀 값 조정 가능
        behavior: "smooth",
      });
    }
  };
  // 오른쪽으로 스크롤
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 110, // 스크롤할 픽셀 값 조정 가능
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`weatherinfo-page ${getWeatherClass(
        weatherData?.weatherDataJson?.current?.weather[0]?.main
      )}`}
    >
      <div className="weatherinfo-container">
        <LocationDropdown onLocationSelect={handleLocationSelect} />
        {loading ? (
          <div className="loading">
            <p>날씨 정보를 불러오는 중입니다. 잠시만 기다려 주세요...</p>
          </div>
        ) : (
          <>
            <div className="weather-section">
              <div className="weather-p">
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
              </div>
              <p className="weather-current-temperature">
                {Math.round(weatherData?.weatherDataJson?.current?.temp)}°
              </p>
              <div className="weather-p">
                <p className="weather-precipitation">
                  체감온도 :{" "}
                  {Math.round(
                    weatherData?.weatherDataJson?.current?.feels_like
                  )}
                  °
                </p>
              </div>
            </div>

            <div className="detail-forecast-section">
              {/* <h3 className="forecast-title">상세 날씨 정보</h3> */}
              <BsChevronCompactLeft className="left" onClick={scrollLeft} />
              <div className="detail-forecast-items" ref={scrollRef}>
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
                      {/* <p>{item.label}</p> */}
                    </div>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
              <BsChevronCompactRight className="right" onClick={scrollRight} />
            </div>
            <div className="forecast-section">
              <h3 className="forecast-title">일별 예보</h3>
              <div className="daily-forecast-items">
                {weatherData?.weatherDataJson?.daily?.map(
                  (forecast: any, index: number) => {
                    const weatherMain = forecast.weather[0]?.main;
                    const icon = executeIcon(weatherMain);
                    return (
                      <div
                        key={index}
                        className={`daily-forecast-item ${
                          index === 0 ? "first-item" : ""
                        }`}
                      >
                        <div className="day-info">
                          <p className="day">{formatUnixTime(forecast.dt)}</p>
                        </div>
                        <div className="forecast-icon-container">{icon}</div>
                        {/* <p className="weather-status">
                          {weatherMainToKorean[forecast.weather[0]?.main]}
                        </p> */}
                        <p className="temperature">
                          {Math.round(forecast.temp.min)}° /{" "}
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
