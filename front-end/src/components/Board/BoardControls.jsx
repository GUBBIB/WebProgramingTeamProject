import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./BoardControls.css";

const API_BASE_URL = 'http://localhost:8000/api';


const BoardControls = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [field, setField] = useState('title');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 검색어 입력 핸들링
  const handleKeywordChange = (e) => setKeyword(e.target.value);

  // 검색 기준 변경 (title / user)
  const handleFieldChange = (e) => setField(e.target.value);

  // 검색 실행
  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const query = new URLSearchParams({ field, keyword }).toString();

      const response = await fetch(`${API_BASE_URL}/boards/search?${query}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '검색 실패');
      }

      setResults(data.results || []);
    } catch (err) {
      console.error('검색 오류:', err);
      setError('서버 오류가 발생했습니다.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터키 입력 시 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // form 제출 방지용
      handleSearch();
    }
  };

  // 게시글 작성 페이지 이동
  const handleWritePost = () => {
    navigate('/write');
  };

  return (
    <div className="board-controls-container">
      <div className="search-and-filter-container">
        <select
          value={field}
          onChange={handleFieldChange}
          className="search-select"
        >
          <option value="title">제목</option>
          <option value="user">작성자</option>
        </select>

        <input
          type="text"
          placeholder={`${field === 'title' ? '제목' : '작성자'}으로 검색...`}
          value={keyword}
          onChange={handleKeywordChange}
          onKeyDown={handleKeyDown}
          className="search-input"
        />

        <button
          onClick={() => onSearch(field, keyword, setKeyword)}
          className="search-button"
          disabled={isLoading || !keyword.trim()}
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      <button
        onClick={handleWritePost}
        className="write-post-button"
      >
        게시글 작성
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BoardControls;
