import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardControls.css';

// BoardTypeSelector는 더 이상 여기서 사용하지 않음
// import BoardTypeSelector from './BoardTypeSelector'; 

const BoardControls = ({ 
  onSearch, 
  boardTypesForDropdown, // App.jsx에서 전달된 드롭다운용 게시판 목록
  selectedSearchScope,   // App.jsx에서 전달된 현재 선택된 검색 범위
  onSelectSearchScope    // App.jsx에서 전달된 검색 범위 변경 핸들러
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm); // 검색어만 전달, 검색 범위는 App.jsx의 searchScope 상태 사용
  };

  const handleWritePost = () => {
    navigate('/write');
  };

  const handleScopeChange = (event) => {
    onSelectSearchScope(event.target.value);
  };

  return (
    <div className="board-controls-container">
      <div className="search-and-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          {/* 검색 범위 선택 드롭다운 (셀렉트 바) */}
          <select 
            value={selectedSearchScope} 
            onChange={handleScopeChange} 
            className="search-scope-select"
          >
            {boardTypesForDropdown && boardTypesForDropdown.map(board => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="게시글 제목 검색..."
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

