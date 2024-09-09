import React, { useEffect } from "react";
import "./styles/SquirrelCollection.css";
import pedestal from "../../../assets/pedestal.png"; // 단상 이미지는 src 내에 있는 것으로 가정
import useCollectionStore from "../../../store/useCollectionStore";

const SquirrelCollection: React.FC = () => {
  const { squirrels, error, fetchCollection } = useCollectionStore();

  useEffect(() => {
    fetchCollection(); // 컴포넌트가 마운트될 때 다람쥐 데이터를 가져옵니다.
  }, [fetchCollection]);

  // 다람쥐 이미지 URL 생성 함수
  const getSquirrelImageUrl = (squirrelType: string) => {
    const formattedType = squirrelType.replace(/ /g, "_"); // 공백을 _로 변환
    return `/squirrels/main/${formattedType}_lv4-removebg-preview.png`;
  };

  if (error) {
    return <div className="error-message">{error}</div>; // 에러 메시지 표시
  }

  if (squirrels.length === 0) {
    return <div className="empty-message">독립한 다람쥐가 없습니다.</div>; // 다람쥐가 없을 때 표시
  }

  return (
    <div className="squirrel-collection">
      {squirrels.map((squirrel, index) => (
        <div key={index} className="squirrel-item">
          <div className="image-container">
            <img src={pedestal} alt="단상" className="pedestal" />
            <img
              src={getSquirrelImageUrl(squirrel.sqrType)} // 다람쥐 종류에 맞는 이미지 경로 사용
              alt={squirrel.sqrType}
              className="squirrel"
            />
          </div>
          <p className="squirrel-name">{squirrel.sqrType}</p>
          <p className="squirrel-date">
            분양 날짜 : {new Date(squirrel.startDate).toLocaleDateString()}
          </p>
          <p className="squirrel-date">
            독립 날짜 : {new Date(squirrel.endDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SquirrelCollection;
