import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardControls.css';

const BoardControls = ({ 
  onSearch, 
  // boardTypesForDropdown, // 이제 사용하지 않음
  selectedSearchType,   // 변경: 검색 유형 (title, author)
  onSelectSearchType    // 변경: 검색 유형 변경 핸들러
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    // onSearch는 부모 컴포넌트(App.jsx)에서 실제 API 호출을 포함하므로, 
    // 해당 함수가 비동기 처리를 할 것을 대비하여 async로 선언합니다.
    // 이제 onSearch는 searchTerm과 selectedSearchType을 모두 받아야 합니다.
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
          {/* 검색 유형 선택 드롭다운 (제목/작성자) */}
          <select 
            value={selectedSearchType} 
            onChange={handleSearchTypeChange} 
            className="search-scope-select" // 클래스명은 유지하거나 변경 가능
          >
            <option value="title">제목 검색</option>
            <option value="author">작성자 검색</option>
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

