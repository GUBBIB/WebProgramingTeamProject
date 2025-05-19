// BoardController.jsx (예시)
import React, { useState } from "react";
import "./BoardController.css"; // 스타일 파일 경로 주의

const BoardController = ({ onResultClick }) => {
  const [keyword, setKeyword] = useState('');
  const [field, setField] = useState('title');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 키워드 입력 변경
  const handleKeywordChange = (e) => setKeyword(e.target.value);

  // 검색 필드 변경
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
      // axios 등으로 API 호출
      // 예시: const response = await axios.get('/api/posts/search', { params: { field, keyword } });
      // setResults(response.data.results || []);
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <select value={field} onChange={handleFieldChange} className="search-select">
          <option value="title">제목</option>
          <option value="user">작성자</option>
        </select>
        <input
          type="text"
          placeholder={`${field === 'title' ? '제목' : '작성자'}으로 검색...`}
          value={keyword}
          onChange={handleKeywordChange}
          onKeyPress={handleKeyPress}
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
      {/* 검색 결과 렌더링 */}
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

export default BoardController;
