import React, { useEffect, useState } from 'react';
import './BoardTypeSelector.css';

const API_BASE_URL = 'http://13.60.93.77/api'; // 실제 API 주소에 맞게 수정

const BoardTypeSelector = () => {
  const [boardTypes, setBoardTypes] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  // API 호출로 게시판 목록 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/boards`, {
          credentials: 'include',
        });
        const data = await response.json();
        setBoardTypes(data);
        if (data.length > 0) {
          setSelectedBoard(data[0].BRD_id); // 기본 선택값 설정
        }
      } catch (error) {
        console.error('게시판 목록 불러오기 실패:', error);
      }
    };

    fetchBoards();
  }, []);

  const handleSelectBoard = (id) => {
    setSelectedBoard(id);
    // 여기서 선택된 게시판으로 게시글 리스트를 갱신하려면 props나 context로 연결해야 함
    console.log(`선택된 게시판 ID: ${id}`);
  };

  return (
    <div className="board-type-selector-container">
      {boardTypes.map((type) => (
        <button
          key={type.BRD_id}
          className={`board-type-button ${selectedBoard === type.BRD_id ? 'active' : 'dd'}`}
          onClick={() => handleSelectBoard(type.BRD_id)}
        >
          {type.BRD_name}
        </button>
      ))}
    </div>
  );
};

export default BoardTypeSelector;
