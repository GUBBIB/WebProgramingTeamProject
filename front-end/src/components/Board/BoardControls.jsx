import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardControls.css';

const BoardControls = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleWritePost = () => {
    navigate('/write'); // 게시글 작성 페이지로 이동
  };

  return (
    <div className="board-controls-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="게시글 제목 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">검색</button>
      </form>
      <button onClick={handleWritePost} className="write-post-button">
        게시글 작성
      </button>
    </div>
  );
};

export default BoardControls;
