import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostWritePage.css'; // CSS 파일 임포트

// 실제 애플리케이션에서는 API를 통해 게시판 종류를 가져오거나, 고정된 목록을 사용할 수 있습니다.
const boardTypesData = [
  { id: 'code', name: '코드 게시판' },
  { id: 'free', name: '자유게시판' },
  { id: 'qna', name: '질문 게시판' },
];

const PostWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(boardTypesData[0]?.id || ''); // 기본값 설정
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: API 호출하여 게시글 저장 로직 구현
    console.log('새 게시글 정보:', { title, content, boardType: selectedBoard });
    alert('게시글이 등록되었습니다. (실제로는 API 연동 필요)');
    // 성공적으로 등록 후 메인 페이지나 해당 게시판으로 이동
    navigate('/'); 
  };

  return (
    <div className="post-write-container">
      <h1 className="page-title">새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className="post-write-form">
        <div className="form-group">
          <label htmlFor="boardType">게시판 선택</label>
          <select 
            id="boardType" 
            value={selectedBoard} 
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="form-control"
          >
            {boardTypesData.map(board => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="제목을 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea 
            id="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="내용을 입력하세요" 
            required 
            rows="15"
            className="form-control"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">등록</button>
          <button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</button>
        </div>
      </form>
    </div>
  );
};

export default PostWritePage;
