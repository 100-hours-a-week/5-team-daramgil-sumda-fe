import React, { useState } from "react";
import "./styles/TagCollection.css";

const tags = [
  {
    id: 1,
    name: "슈퍼 J 성향",
    content: "대기 오염 조회나 날씨 정보 조회를 10번 이상 방문했을 경우",
  },
  {
    id: 2,
    name: "다람쥐 수집가",
    content: "다람쥐를 5마리 이상 컬렉션에 모았을 경우",
  },
  {
    id: 3,
    name: "한 여름 밤의 꿈",
    content: "열대야인 날 밤 9시 이후 날씨를 2회 확인한 경우",
  },
  { id: 4, name: "분가", content: "키우던 다람쥐를 2마리 독립시켰을 경우" },
  {
    id: 5,
    name: "제 2 외국어는 다람쥐 언어",
    content: "다람쥐와 대화를 10번 했을 경우",
  },
  {
    id: 6,
    name: "날아라 개근왕",
    content: "1주일 동안 빠지지 않고 일일 미션 전부 완료했을 경우",
  },
];

const TagCollection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleContent = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="tag-collection">
      <h2 className="tag-title">당신의 태그는...</h2>
      <div className="tag-list">
        {tags.map((tag, index) => (
          <div key={tag.id}>
            <div className="tag-item" onClick={() => toggleContent(index)}>
              <span className="tag-icon">🌞</span>{" "}
              <span className="tag-name">{tag.name}</span>
            </div>
            {openIndex === index && (
              <div className="tag-content">
                <span>{tag.content}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagCollection;
