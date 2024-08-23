import React, { useState } from "react";
import "./styles/Contact.css";

const Contact: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !email) {
      setErrorMessage("*제목, 내용, 이메일을 입력해주세요.");
    } else {
      setErrorMessage("");
      // 여기서 폼 데이터를 서버로 전송하는 로직을 추가
      console.log("Form Submitted", { title, content, email });
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">문의하기</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="form-label">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
            placeholder="내용을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="이메일을 입력하세요"
          />
        </div>
        {errorMessage && <p className="form-error">{errorMessage}</p>}
      </form>
      <button type="submit" className="form-button" onClick={handleSubmit}>
        보내기
      </button>
    </div>
  );
};

export default Contact;
