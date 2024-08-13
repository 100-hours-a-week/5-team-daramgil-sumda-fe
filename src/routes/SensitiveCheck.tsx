import React, { useState } from "react";
import "./styles/SensitiveCheck.css";

const SensitiveCheck: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
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
          className={`option-button ${selected === "yes" ? "selected" : ""}`}
          onClick={() => handleSelect("yes")}
        >
          예
        </button>
        <button
          className={`option-button ${selected === "no" ? "selected" : ""}`}
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

      <button className="complete-button">완료</button>
    </div>
  );
};

export default SensitiveCheck;
