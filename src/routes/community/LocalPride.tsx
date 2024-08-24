import React, { useEffect, useState } from "react";
import "./styles/LocalPride.css";
import gps_icon from "../../assets/icons/gps.png";

const Location: React.FC = () => (
  <div className="LocalPride-location">
    <p className="LocalPride-location-text">경남 상주시 남작동</p>
    <button className="LocalPride-gps-button">
      <img className="LocalPride-gps-icon" src={gps_icon} alt="gps icon" />
    </button>
  </div>
);

const ImageUpload: React.FC<{
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: File | null;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ onImageUpload, image, onSubmit, onCancel }) => (
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
          <button className="LocalPride-submit-button" onClick={onSubmit}>
            올리기
          </button>
          <button className="LocalPride-cancel-button" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    )}
  </div>
);

const PostCard: React.FC<{
  communityId: number;
  time: string;
  location: string;
  likes: number;
  imageUrl: string;
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
}> = ({ communityId, time, location, likes, imageUrl, onDelete, onLike }) => (
  <div className="LocalPride-post-card" style={{ position: "relative" }}>
    <span className="LocalPride-post-time">{time}</span>
    <span className="LocalPride-post-location">{location}</span>
    <p className="LocalPride-post-likes">좋아요 {likes}</p>
    <button
      className="LocalPride-delete-button"
      onClick={() => onDelete(communityId)}
    >
      삭제
    </button>
    <img src={imageUrl} alt="post" className="LocalPride-post-img" />
    <button
      className="LocalPride-like-button"
      onClick={() => onLike(communityId)}
    ></button>
  </div>
);

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
  const [posts, setPosts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/community`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setPosts(data.data);
        }
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleDelete = (id: number) => {
    setDeletePostId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deletePostId !== null) {
      fetch(`${process.env.REACT_APP_API_URL}/community/${deletePostId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            setPosts(posts.filter((post) => post.communityId !== deletePostId));
            setDeletePostId(null);
          } else {
            alert(data.message);
          }
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          setShowModal(false);
          setDeletePostId(null);
        });
    }
  };

  const handleSubmit = () => {
    if (image) {
      const postData = {
        imageUrl: "https://via.placeholder.com/150", // 임시 이미지 URL
        userId: "1", // 예시로 고정된 userId 사용
        address: "대구 달서구 월성동", // 예시로 고정된 address 사용
      };

      fetch(`${process.env.REACT_APP_API_URL}/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            setPosts(data.data);
            setImage(null); // 업로드 후 이미지 초기화
          } else {
            alert(data.message);
          }
        })
        .catch((error) => console.error("Error uploading image:", error));
    }
  };

  const onLike = (id: number) => {
    fetch(`${process.env.REACT_APP_API_URL}/community/${id}/like`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.communityId === id
                ? { ...post, likes: post.likes + 1 }
                : post
            )
          );
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  return (
    <div className="LocalPride-container">
      <h3 className="LocalPride-title">우리동네 자랑하기</h3>
      <Location />
      <ImageUpload
        onImageUpload={handleImageUpload}
        image={image}
        onSubmit={handleSubmit}
        onCancel={() => setImage(null)}
      />
      <div className="LocalPride-post-section">
        {posts.map((post) => (
          <PostCard
            key={post.communityId}
            communityId={post.communityId}
            time={`${Math.floor(Math.random() * 10)}분전`}
            location={post.address}
            likes={post.likes}
            imageUrl={post.imageUrl}
            onDelete={handleDelete}
            onLike={onLike}
          />
        ))}
      </div>
      {showModal && (
        <Modal onConfirm={confirmDelete} onCancel={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default LocalPride;
