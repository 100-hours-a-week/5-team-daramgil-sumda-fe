import React, { useState } from "react";
import './styles/Notice.css';

interface NoticeItemProps {
  title: string;
  date: string;
  content: string;
}

const Notice: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleContent = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const notices: NoticeItemProps[] = [
    {
      title: "[공지] 공지 제목입니다.",
      date: "2024.07.31",
      content: "안녕하세요. 숨쉬는 다람쥐 운영진입니다. 공지사항을 알려드립니다. 이건 공지사항 예시입니다. 여러분 오늘도 화이팅!"
    },
    {
      title: "[공지] 또 다른 공지입니다.",
      date: "2024.08.13",
      content: "이것은 또 다른 공지사항의 내용입니다. 추가적인 정보를 제공합니다."
    },
    {
      title: "[공지] 또또 다른 공지입니다.",
      date: "2024.08.13",
      content: "이것은 또또 다른 공지사항의 내용입니다. 사실 별 내용 없습니다."
    },
    // 다른 공지사항들도 여기에 추가할 수 있습니다.
  ];
  return (
    <div className="notice-container">
      <h2 className="title">공지사항</h2>
      <div className="notice-list">
        {notices.map((notice, index) => (
          <div key={index}>
            <div className="notice-item">
              <div className="notice-header" onClick={() => toggleContent(index)}>
                <div className="notice-title-text">{notice.title}</div>
                <div className="notice-date">{notice.date}</div>
              </div>
            </div>
            {openIndex === index && (
              <div className="notice-item">
                <div className="notice-content">
                  {notice.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notice;