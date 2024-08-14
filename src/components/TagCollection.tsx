import React from "react";
import "./styles/TagCollection.css";

const tags = [
  { id: 1, name: "슈퍼 J 성향" },
  { id: 2, name: "다람쥐 수집가" },
  { id: 3, name: "한 여름 밤의 꿈" },
  { id: 4, name: "분가" },
  { id: 5, name: "제 2 외국어는 다람쥐 언어" },
  { id: 6, name: "날아라 개근왕" },
];

const TagCollection: React.FC = () => {
  return (
    <div className="tag-collection">
      <h2 className="tag-title">당신의 태그는...</h2>
      <div className="tag-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-item">
            <span className="tag-icon">🌞</span>{" "}
            {/* 여기에 아이콘을 이미지로 대체할 수도 있습니다 */}
            <span className="tag-name">{tag.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagCollection;
