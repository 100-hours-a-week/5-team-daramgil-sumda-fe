import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/SensitiveCheck.css";
import sensitiveCheck from "../assets/set.png";
import medicine from "../assets/medicine.png";

const SensitiveCheck: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSelect = (option: string) => {
    setSelected(option);
    setShowWarning(false);
  };
  const handleComplete = () => {
    if (selected !== null) {
      localStorage.setItem("sensitiveGroup", selected); // 로컬 스토리지에 값 저장
      alert("민감군 정보가 저장되었습니다."); // 저장 완료 메시지 (옵션)
      navigate("/");
    } else {
      setShowWarning(true); // 선택되지 않았을 때의 메시지
    }
  };

  return (
    <div className="check-page">
      <div className="check-container">
        <h1 className="check-title">대기질 민감군이신가요?</h1>

        <p className="check-info">
          민감군인 경우, 더 낮은 수치를 기준으로 정보를
          <br />
          안내해드립니다.
        </p>
        <img src={sensitiveCheck} />
        <div className="sub-title">
          <img src={medicine} alt="민감군 아이콘" className="icon" />
          <div className="text-content">
            <strong>민감군</strong>
            <p>어린이, 노인, 천식같은 폐질환 및 심장질환을 앓고 있는 경우</p>
          </div>
        </div>

        <div className="check-button-group">
          <button
            className={`option-button2 ${selected === "yes" ? "selected" : ""}`}
            onClick={() => handleSelect("yes")}
          >
            민감군이에요
          </button>
          <button
            className={`option-button1 ${selected === "no" ? "selected" : ""}`}
            onClick={() => handleSelect("no")}
          >
            괜찮아요
          </button>
        </div>

        {selected === null && (
          <p className="warning">* 민감군 여부를 선택해주세요</p>
        )}

        <button className="complete-button" onClick={handleComplete}>
          완료
        </button>
      </div>
    </div>
  );
};

export default SensitiveCheck;
