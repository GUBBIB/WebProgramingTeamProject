import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BoardTypeSelector.css';
import PostList from '../Post/PostList';

const API_BASE_URL = '/api';// 실제 API 주소에 맞게 수정

const BoardTypeSelector = ({ selectedBoard, onSelectedBoard, searchedPosts}) => {
  const [boardTypes, setBoardTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // API 호출로 게시판 목록 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/boards`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('게시판 목록을 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        setBoardTypes(data);
        setLoading(false);
      } catch (error) {
        console.error('게시판 목록 불러오기 실패:', error);
        setError('게시판 목록을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const handleSelectBoard = (id) => {
    // 상태 업데이트
    onSelectedBoard(id);
    
    // URL 변경 없이 상태만 업데이트하여 리렌더링 유도
    console.log(`선택된 게시판 ID: ${id}`);
  };
  const handleSelectAllBoard = (id) => {
    onSelectedBoard(id);
    console.log(`선택된 게시판 ID: ${id}`);
  };

  if (loading) return <div className="loading">게시판 목록을 불러오는 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="board-type-selector-container">
        {/* 전체 게시판 버튼 (BRD_id=1) */}
        <button
          className={`board-type-button ${selectedBoard === 1 ? 'active' : ''}`}
          onClick={() => handleSelectBoard(1)}
        >
          전체
        </button>
        
        {/* API에서 가져온 나머지 게시판 */}
        {boardTypes.map((type) => (
          type.BRD_id !== 1 && (
            <button
              key={type.BRD_id}
              className={`board-type-button ${selectedBoard === type.BRD_id ? 'active' : ''}`}
              onClick={() => handleSelectBoard(type.BRD_id)}
            >
              {type.BRD_name}
            </button>
          )
        ))}
      </div>
      {/* 선택된 게시판에 따라 PostList를 조건부 렌더링 */}
      {selectedBoard && <PostList BRD_id={selectedBoard} searchedPosts={searchedPosts} />}
    </div>
  );
};

export default BoardTypeSelector;