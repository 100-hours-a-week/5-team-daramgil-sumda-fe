import React, { useState, useEffect } from "react";
import "./styles/Notice.css";

interface NoticeItemProps {
  title: string;
  createdAt: string;
  content: string;
}

const Notice: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [notices, setNotices] = useState<NoticeItemProps[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleContent = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 더미 데이터를 가져오는 함수
  const fetchNotices = async () => {
    try {
      // 서버가 구현되면 아래 URL을 실제 API 엔드포인트로 변경 /api/official
      const response = await fetch(`${process.env.REACT_APP_API_URL}/official`);

      if (response.ok) {
        const data = await response.json();
        setNotices(data.data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      setErrorMessage("정보를 불러오지 못했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="notice-container">
      <h2 className="title">공지사항</h2>
      <div className="notice-list">
        {notices.map((notice, index) => (
          <div key={index}>
            <div className="notice-item">
              <div
                className="notice-header"
                onClick={() => toggleContent(index)}
              >
                <div className="notice-title-text">{notice.title}</div>
                <div className="notice-date">{notice.createdAt}</div>
              </div>
            </div>
            {openIndex === index && (
              <div className="notice-item">
                <div
                  className="notice-content"
                  dangerouslySetInnerHTML={{ __html: notice.content }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Notice;
