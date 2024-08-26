import React, { useState } from "react";
import "./styles/Contact.css";

const Contact: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!title) {
      setTitleError("*제목을 입력해주세요.");
      isValid = false;
    } else if (title.length > 32) {
      setTitleError("*제목은 32글자 이내로 입력해주세요.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!content) {
      setContentError("*내용을 입력해주세요.");
      isValid = false;
    } else if (content.length > 1000) {
      setContentError("*내용은 1000글자 이내로 입력해주세요.");
      isValid = false;
    } else {
      setContentError("");
    }

    if (!email) {
      setEmailError("*이메일을 입력해주세요.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("*유효한 이메일을 입력해주세요.");
      isValid = false;
    } else if (email.length > 50) {
      setEmailError("*이메일은 50글자 이내로 입력해주세요.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!isValid) {
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/inquiry`, {
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 32) {
      setTitle(value);
      setTitleError(""); // Clear error message when typing within the limit
    } else {
      setTitleError("*제목은 32글자 이내로 입력해주세요.");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setContent(value);
      setContentError(""); // Clear error message when typing within the limit
    } else {
      setContentError("*내용은 1000글자 이내로 입력해주세요.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
      setEmailError(""); // Clear error message when typing within the limit
    } else {
      setEmailError("*이메일은 50글자 이내로 입력해주세요.");
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">문의하기</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form-group">
          <label htmlFor="title" className="contact-form-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="contact-form-input"
            placeholder="제목을 입력하세요"
            disabled={isLoading}
          />
          {titleError && (
            <p className="contact-form-helpertext">{titleError}</p>
          )}
        </div>
        <div className="contact-form-group">
          <label htmlFor="content" className="contact-form-label">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="contact-form-textarea"
            placeholder="내용을 입력하세요"
            disabled={isLoading}
          />
          {contentError && (
            <p className="contact-form-helpertext">{contentError}</p>
          )}
        </div>
        <div className="contact-form-group">
          <label htmlFor="email" className="contact-form-label">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="contact-form-input"
            placeholder="이메일을 입력하세요"
            disabled={isLoading}
          />
          {emailError && (
            <p className="contact-form-helpertext">{emailError}</p>
          )}
        </div>
        {errorMessage && <p className="contact-form-error">{errorMessage}</p>}
        {successMessage && (
          <p className="contact-form-success">{successMessage}</p>
        )}
        <button
          type="submit"
          className="contact-form-button"
          disabled={isLoading}
        >
          {isLoading ? "보내는 중..." : "보내기"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
