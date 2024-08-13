import React, { useState } from "react";
import "./styles/Favorites.css";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState([
    { id: 1, location: "경기도 시흥시 정왕2동" },
    { id: 2, location: "세종특별자치시 조치원읍" },
    { id: 3, location: "서울특별시 서초구 서초동" },
  ]);

  const handleDelete = (id: number) => {
    setFavorites(favorites.filter((favorite) => favorite.id !== id));
  };

  return (
    <div className="favorites-container">
      <div className="search-bar">
        <input type="text" className="search-bar-input" placeholder="검색" />
        <button className="search-bar-button">검색</button>
      </div>
      <h3 className="favorites-header">즐겨찾기 목록</h3>
      <ul className="favorites-list">
        {favorites.map((favorite) => (
          <li key={favorite.id} className="favorite-item">
            <span className="favorite-item-location">{favorite.location}</span>
            <button
              className="favorite-item-delete-button"
              onClick={() => handleDelete(favorite.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
