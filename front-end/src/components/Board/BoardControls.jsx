import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardControls.css';

const BoardControls = ({ 
  onSearch, 
  selectedSearchType, 
  onSelectSearchType 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => { 
    if (searchTerm.trim()) {
      await onSearch(searchTerm, selectedSearchType);
    }
  };

  // 엔터 키 입력 시 검색 실행
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleWritePost = () => {
    navigate('/write');
  };

  const handleSearchTypeChange = (event) => {
    onSelectSearchType(event.target.value);
  };

  return (
    <div className="board-controls-container">
      <div className="search-and-filter-container">
        <div className="search-form"> 
          <select 
            value={selectedSearchType} 
            onChange={handleSearchTypeChange} 
            className="search-scope-select"
          >
            <option value="title">제목 검색</option>
            <option value="author">작성자 검색</option>
          </select>
          <input
            type="text"
            placeholder={selectedSearchType === 'title' ? "제목으로 검색..." : "작성자명으로 검색..."}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button 
            type="button" 
            onClick={handleSearchSubmit} 
            className="search-button"
            disabled={!searchTerm.trim()}
          >
            검색
          </button>
        </div>
      </div>
      
      <button onClick={handleWritePost} className="write-post-button">
        게시글 작성
      </button>
    </div>
  );
};

export default BoardControls;