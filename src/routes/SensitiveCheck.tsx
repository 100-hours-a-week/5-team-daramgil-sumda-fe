import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/SensitiveCheck.css";

const SensitiveCheck: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelect = (option: string) => {
    setSelected(option);
  };
  const handleComplete = () => {
    if (selected !== null) {
      localStorage.setItem("sensitiveGroup", selected); // 로컬 스토리지에 값 저장
      alert("민감군 정보가 저장되었습니다."); // 저장 완료 메시지 (옵션)
      navigate("/");
    } else {
      alert("먼저 민감군 여부를 선택해주세요."); // 선택되지 않았을 때의 메시지
    }
  };

  return (
    <div className="check-container">
      <h1 className="check-title">대기질 민감군이신가요?</h1>
      <p className="sub-title">
        <span className="highlight">※ 민감군:</span>
        어린이, 노인, 천식같은 폐질환 및
        <br />
        심장질환을 앓고 있는 경우
      </p>

      <div className="button-group">
        <button
          className={`option-button2 ${selected === "yes" ? "selected" : ""}`}
          onClick={() => handleSelect("yes")}
        >
          예
        </button>
        <button
          className={`option-button1 ${selected === "no" ? "selected" : ""}`}
          onClick={() => handleSelect("no")}
        >
          아니요
        </button>
      </div>

      {selected === null && (
        <p className="warning">* 예 / 아니요를 선택해주세요</p>
      )}

      <p className="info">
        민감군인 경우, 더 낮은 수치를 기준으로
        <br />
        정보를 안내해드립니다.
      </p>

      <button className="complete-button" onClick={handleComplete}>
        완료
      </button>
    </div>
  );
};

export default SensitiveCheck;
