import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "./BoardControls.css";

const BoardControls = ({ onResultClick }) => {
  const [keyword, setKeyword] = useState('');
  const [field, setField] = useState('title');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 검색어 입력 핸들링
  const handleKeywordChange = (e) => setKeyword(e.target.value);

  // 검색 기준(제목/작성자) 변경
  const handleFieldChange = (e) => setField(e.target.value);

  // 검색 실행
  // 검색 실행
const handleSearch = async () => {
  if (!keyword.trim()) {
    setError('검색어를 입력해주세요.');
    return;
  }

  console.log('검색 실행됨');
  console.log('field:', field);
  console.log('keyword:', keyword);

  try {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams({ field, keyword }).toString();
    console.log('요청 URL:', `/api/boards/search?${query}`);

    const response = await fetch(`/api/boards/search?${query}`, {
      method: 'GET',
    });

    const data = await response.json();

    console.log('서버 응답:', data);

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
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
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
          onKeyDown={handleKeyDown} // 엔터키 검색 지원
          className="search-input"
        />

        <button
          onClick={handleSearch}
          className="search-button"
          disabled={isLoading || !keyword.trim()}
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="search-results">
          <h3>검색 결과 ({results.length}건)</h3>
          <div className="results-container">
            {results.map((post) => (
              <div
                key={post.PST_id || post.id}
                className="search-result-item"
                onClick={() => onResultClick(post.BRD_id, post.PST_id)}
              >
                <h4>{post.title}</h4>
                {post.content && <p className="post-content">{post.content}</p>}
                <div className="post-meta">
                  <span>{post.author || post.username || '익명'}</span>
                  {post.created_at && (
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && results.length === 0 && keyword.trim() && !error && (
        <div className="no-results">검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default BoardControls;
