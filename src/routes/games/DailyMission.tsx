import React from "react";
import "./styles/DailyMission.css";
import Acorn_img from "../../assets/acorn.png";
import Check_img from "../../assets/check.png";
const DaliyMission: React.FC = () => {
  return (
    <div className="dailymission-container">
      <h3 className="dailymission-header">일일 미션</h3>
      <div className="dailymission-page-meta">
        <img src={Acorn_img} alt="도도리 이미지" className="acron-img" />
        <p className="dailymission-explanation-text">
          퀘스트를 완료하면, 도토리를 받을 수 있습니다. <br />
          아래 미션을 수행하고 도토리를 주워가세요!!
          <br />
        </p>
      </div>
      <div className="mission-container">
        <p>출석하기</p>
        <img className="check-img" src={Check_img} alt="체크 이미지" />
      </div>
      <div className="mission-container">
        <p>다람쥐와 대화하기</p>
        <img className="check-img" src={Check_img} alt="체크 이미지" />
      </div>
      <div className="mission-container">
        <p>OX 퀴즈 참여하기</p>
        <img className="check-img" src={Check_img} alt="체크 이미지" />
      </div>
      <div className="mission-container">
        <p>대기 오염 정보 조회하기</p>
        <img className="check-img" src={Check_img} alt="체크 이미지" />
      </div>
    </div>
  );
};

export default DaliyMission;
