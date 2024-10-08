import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles/Favorites.css";
import { CiSearch } from "react-icons/ci";

interface Location {
  id: number;
  location: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === "") return;

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
  }, [searchQuery]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  const handleAddFavorite = useCallback(
    (id: number, location: string) => {
      if (!favorites.some((favorite) => favorite.id === id)) {
        const newFavorite = { id, location };
        const updatedFavorites = [...favorites, newFavorite];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }

      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
    },
    [favorites]
  );

  const handleDelete = useCallback(
    (id: number) => {
      const updatedFavorites = favorites.filter(
        (favorite) => favorite.id !== id
      );
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    },
    [favorites]
  );

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="search-container">
          <div className="search-bar">
            <CiSearch className="search-icon" />
            <input
              type="text"
              className="search-bar-input"
              placeholder="지역명을 검색하세요 (읍/면/동)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
            />
            {/* <button className="search-bar-button" onClick={handleSearch}>
              검색
            </button> */}
          </div>
          {showSearchResults && searchQuery.trim() !== "" && (
            <div className="search-result-container">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => (
                    <li key={result.id} className="search-result-item">
                      <span className="search-result-item-location">
                        {result.location}
                      </span>
                      <button
                        className="search-result-item-delete-button"
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
        </div>
        <div className="favorites-items-title">등록한 지역</div>
        {favorites.length > 0 ? (
          <div className="favorites-item-container">
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
          </div>
        ) : (
          <div className="no-item-container">
            <p className="no-items">즐겨찾기한 지역이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
