import React, { useEffect, useState } from 'react';
import './BoardTypeSelector.css';
import PostList from '../Post/PostList';

const API_BASE_URL = 'http://13.60.93.77/api'; // 실제 API 주소에 맞게 수정

const BoardTypeSelector = ({ selectedBoard, onSelectedBoard}) => {
  const [boardTypes, setBoardTypes] = useState([]);

  // API 호출로 게시판 목록 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/boards`, {
          credentials: 'include',
        });
        const data = await response.json();
        setBoardTypes(data);

      } catch (error) {
        console.error('게시판 목록 불러오기 실패:', error);
      }
    };

    fetchBoards();
  }, []);

  const handleSelectBoard = (id) => {
    onSelectedBoard(id);
    console.log(`선택된 게시판 ID: ${id}`);
  };
  const handleSelectAllBoard = (id) => {
    onSelectedBoard(id);
    console.log(`선택된 게시판 ID: ${id}`);
  };

  return (
    <div>
      <div className="board-type-selector-container">
        {boardTypes.map((type) => (
          <button
            key={type.BRD_id}
            className={`board-type-button ${selectedBoard === type.BRD_id ? 'active' : ''}`}
            onClick={() => handleSelectBoard(type.BRD_id)}
          >
            {type.BRD_name}
          </button>
        ))}
      </div>
      <PostList BRD_id={selectedBoard}/>
    </div>
  );
};

export default BoardTypeSelector;
