import React from "react";
import "./styles/OutfitByTemp.css";
const temperatureRanges = [
  {
    temp: "30°C~",
    description: "에어컨 옆에 붙어있자...",
    colorClass: "color-very-high",
  },
  {
    temp: "27°C~30°C",
    description: "나시티, 반바지, 민소매 원피스",
    colorClass: "color-high",
  },
  {
    temp: "23°C~26°C",
    description: "반팔, 얇은 셔츠, 얇은 긴팔, 반바지, 면바지",
    colorClass: "color-mid-high",
  },
  {
    temp: "20°C~22°C",
    description: "긴팔티, 가디건, 후드티, 면바지, 슬랙스",
    colorClass: "color-mid-mid",
  },
  {
    temp: "17°C~19°C",
    description: "니트, 가디건, 후드티, 맨투맨, 청바지",
    colorClass: "color-mid",
  },
  {
    temp: "12°C~16°C",
    description: "자켓, 셔츠, 가디건, 간절기 야상, 스타킹",
    colorClass: "color-mid-low",
  },
  {
    temp: "6°C~9°C",
    description: "코트, 가죽자켓",
    colorClass: "color-low",
  },
  {
    temp: "5°C~1°C",
    description: "겨울옷: 야상, 패딩, 목도리 등등",
    colorClass: "color-very-low",
  },
  {
    temp: "0°C 이하",
    description: "나가지 말것! 집에만 있자...",
    colorClass: "color-very-very-low",
  },
];

const OutfitByTemp: React.FC = () => {
  return (
    <div className="outfitbytemp-page">
      <h2 className="title">기온별 옷차림 추천</h2>
      <div className="outfitbytemp-container">
        <div className="color-container" />
        <div className="outfit-container">
          {temperatureRanges.map((range, index) => (
            <div key={index} className="outfit-item">
              <div className="temp-text">
                <div className="temp-title">{range.temp}</div>
                <div className={`outfit-description ${range.colorClass}`}>
                  {range.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitByTemp;
