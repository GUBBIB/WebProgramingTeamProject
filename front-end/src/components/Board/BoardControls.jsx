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

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await onSearch(searchTerm, selectedSearchType);
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
        <form onSubmit={handleSearchSubmit} className="search-form">
          <select 
            value={selectedSearchType} 
            onChange={handleSearchTypeChange} 
            className="search-scope-select"
          >
            <option value="title">제목 검색</option>
            <option value="user">작성자 검색</option>
          </select>
          <input
            type="text"
            placeholder={selectedSearchType === 'title' ? "제목으로 검색..." : "작성자명으로 검색..."}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">검색</button>
        </form>
      </div>
      <button onClick={handleWritePost} className="write-post-button">
        게시글 작성
      </button>
    </div>
  );
};

export default BoardControls;
