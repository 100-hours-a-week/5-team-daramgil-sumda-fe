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
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
    } else {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/locations/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        const results = data.data.map((item: any) => ({
          id: item.id,
          location: item.locationName || item.district,
        }));
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleAddFavorite = (id: number, location: string) => {
    if (!favorites.some((favorite) => favorite.id === id)) {
      const newFavorite = { id, location };
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const handleDelete = (id: number) => {
    const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
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
          onFocus={() => setShowSearchResults(true)}
        />
        <button className="search-bar-button" onClick={handleSearch}>
          검색
        </button>
      </div>
      {showSearchResults && (
        <div className="search-result-container">
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id} className="favorite-item">
                  {result.location}
                  <button
                    className="favorite-item-delete-button"
                    onClick={() =>
                      handleAddFavorite(result.id, result.location)
                    }
                  >
                    추가
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results">검색 결과 없음</p>
          )}
        </div>
      )}
      <h3 className="favorites-header">즐겨찾기 목록</h3>
      {favorites.length > 0 ? (
        <ul className="favorites-list">
          {favorites.map((favorite) => (
            <li key={favorite.id} className="favorite-item">
              <span className="favorite-item-location">
                {favorite.location}
              </span>
              <button
                className="favorite-item-delete-button"
                onClick={() => handleDelete(favorite.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-favorites">즐겨찾기한 지역이 없습니다</p>
      )}
    </div>
  );
};

export default Favorites;
