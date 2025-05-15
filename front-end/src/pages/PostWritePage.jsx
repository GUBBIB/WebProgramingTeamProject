import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import './PostWritePage.css';

const API_BASE_URL = 'http://localhost:8000/api';

// boardTypesData should now align with BRD_id and BRD_name from App.jsx or an API call
// For now, using the same structure as App.jsx's headerBoardTypes for consistency
const boardTypesData = [
  { BRD_id: 'code', BRD_name: '코드 게시판' },
  { BRD_id: 'free', BRD_name: '자유게시판' },
  { BRD_id: 'qna', BRD_name: '질문 게시판' },
];

const PostWritePage = ({ currentUser }) => {
  const [PST_title, setTitle] = useState(''); // State name can remain 'title' for simplicity, but payload key must be PST_title
  const [PST_content, setContent] = useState(''); // State name can remain 'content'
  const [BRD_id, setSelectedBoard] = useState(boardTypesData[0]?.BRD_id || ''); // State name can remain 'selectedBoard'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('게시글을 작성하려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!PST_title.trim() || !PST_content.trim()) {
        setError('제목과 내용을 모두 입력해주세요.');
        return;
    }

    try {
      const newPostData = {
        PST_title: PST_title,       // Use PHP model property name
        PST_content: PST_content,   // Use PHP model property name
        BRD_id: BRD_id,             // Use PHP model property name
        // USR_id will be handled by the backend via token
      };

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPostData),
      });

      const data = await response.json();

      if (response.ok && data.PST_id) {
        alert('게시글이 성공적으로 등록되었습니다.');
        // Navigate to the detail page of the newly created post
        // The boardId (BRD_id) is already stored in the 'BRD_id' state (selectedBoard)
        navigate(`/post/${data.PST_id}?boardType=${BRD_id}`); 
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setError(errorMessages);
        } else {
          setError(data.message || '게시글 등록에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('게시글 등록 API 호출 오류:', error);
      setError('게시글 등록 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    }
  };

  return (
    <div className="post-write-container">
      <h1 className="page-title">새 게시글 작성</h1>
      {error && <p className="error-message">{error.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
      <form onSubmit={handleSubmit} className="post-write-form">
        <div className="form-group">
          <label htmlFor="boardType">게시판 선택</label>
          <select 
            id="boardType" 
            value={BRD_id} // Bind to BRD_id state
            onChange={(e) => setSelectedBoard(e.target.value)} // Update BRD_id state
            className="form-control"
            required
          >
            {boardTypesData.map(board => (
              // Use BRD_id for key and value, BRD_name for display
              <option key={board.BRD_id} value={board.BRD_id}>{board.BRD_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input 
            type="text" 
            id="title" 
            value={PST_title} // Bind to PST_title state
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="제목을 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group" data-color-mode="light">
          <label htmlFor="content">내용 (Markdown)</label>
          <MDEditor
            value={PST_content} // Bind to PST_content state
            onChange={setContent}
            height={400}
            previewOptions={{
              rehypePlugins: [],
            }}
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

