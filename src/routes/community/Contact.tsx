import React, { useState } from "react";
import "./styles/Contact.css";

const Contact: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !email) {
      setErrorMessage("*제목, 내용, 이메일을 입력해주세요.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, email }),
      });

      if (response.ok) {
        setSuccessMessage("문의가 성공적으로 등록되었습니다.");
        setTitle("");
        setContent("");
        setEmail("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "문의 등록에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버와의 통신에 실패했습니다.");
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        {errorMessage && <p className="form-error">{errorMessage}</p>}
        {successMessage && <p className="form-success">{successMessage}</p>}
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? "보내는 중..." : "보내기"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
