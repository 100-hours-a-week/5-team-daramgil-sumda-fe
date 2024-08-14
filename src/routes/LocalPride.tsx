import React, { useState } from "react";
import "./styles/LocalPride.css";
import gps_icon from "../assets/gps.png";

// Location Component
const Location: React.FC = () => (
  <div className="LocalPride-location">
    <p className="LocalPride-location-text">경남 상주시 남작동</p>
    <button className="LocalPride-gps-button">
      <img className="LocalPride-gps-icon" src={gps_icon} alt="gps icon" />
    </button>
  </div>
);

// Image Upload Component
const ImageUpload: React.FC<{
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: File | null;
  onCancel: () => void;
}> = ({ onImageUpload, image, onCancel }) => (
  <div className="LocalPride-upload-section">
    <label className="LocalPride-upload-button">
      업로드
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="LocalPride-upload-input"
      />
    </label>
    {image && (
      <div className="LocalPride-preview-section">
        <div className="LocalPride-image-preview">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="LocalPride-preview-img"
          />
        </div>
        <div className="LocalPride-action-buttons">
          <button className="LocalPride-submit-button">올리기</button>
          <button className="LocalPride-cancel-button" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    )}
  </div>
);

// Post Card Component
const PostCard: React.FC<{
  time: string;
  location: string;
  likes: number;
  imageUrl: string;
  onDelete: () => void;
}> = ({ time, location, likes, imageUrl, onDelete }) => (
  <div className="LocalPride-post-card" style={{ position: "relative" }}>
    <span className="LocalPride-post-time">{time}</span>
    <span className="LocalPride-post-location">{location}</span>
    <p className="LocalPride-post-likes">좋아요 {likes}</p>
    <button className="LocalPride-delete-button" onClick={onDelete}>
      삭제
    </button>
    <img src={imageUrl} alt="post" className="LocalPride-post-img" />
    <button className="LocalPride-like-button"></button>
  </div>
);

// Modal Component
const Modal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="LocalPride-modal">
    <p className="LocalPride-modal-text">정말로 삭제하시겠습니까?</p>
    <button className="LocalPride-modal-button" onClick={onConfirm}>
      예
    </button>
    <button className="LocalPride-modal-button" onClick={onCancel}>
      아니오
    </button>
  </div>
);

const LocalPride: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleDelete = () => {
    setShowModal(false);
    // 실제 삭제 로직을 여기에 추가하세요
  };

  return (
    <div className="LocalPride-container">
      <h3 className="LocalPride-title">우리동네 날씨자랑</h3>
      <Location />
      <ImageUpload
        onImageUpload={handleImageUpload}
        image={image}
        onCancel={() => setImage(null)}
      />
      <div className="LocalPride-post-section">
        <PostCard
          time="3분전"
          location="경남 상주시 남작동"
          likes={33}
          imageUrl="https://via.placeholder.com/150"
          onDelete={() => setShowModal(true)}
        />
        <PostCard
          time="5분전"
          location="경남 상주시 남작동"
          likes={22}
          imageUrl="https://via.placeholder.com/150"
          onDelete={() => setShowModal(true)}
        />
        <PostCard
          time="10분전"
          location="경남 상주시 남작동"
          likes={10}
          imageUrl="https://via.placeholder.com/150"
          onDelete={() => setShowModal(true)}
        />
      </div>
      {showModal && (
        <Modal onConfirm={handleDelete} onCancel={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default LocalPride;
