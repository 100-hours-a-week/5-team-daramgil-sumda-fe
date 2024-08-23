import React, { useState, useEffect } from "react";
import "./styles/Favorites.css";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<
    { id: number; location: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: number; location: string }[]
  >([]);

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 즐겨찾기를 불러옴
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/locations/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();

        setSearchResults(
          data.data.map((item: any) => ({
            id: item.id,
            location: item.locationName || item.district, // 백엔드에서 반환하는 위치 정보 필드 이름에 따라 조정
          }))
        );
      } else {
        alert("검색 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const handleAddFavorite = (id: number, location: string) => {
    const newFavorite = { id, location };
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // 로컬 스토리지에 저장
  };

  const handleDelete = (id: number) => {
    const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // 로컬 스토리지에 저장
  };

  return (
    <div className="favorites-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-bar-input"
          placeholder="검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-bar-button" onClick={handleSearch}>
          검색
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="search-result-container">
          <ul>
            {searchResults.map((result) => (
              <li key={result.id} className="favorite-item">
                {result.location}
                <button
                  className="favorite-item-delete-button"
                  onClick={() => handleAddFavorite(result.id, result.location)}
                >
                  추가
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
