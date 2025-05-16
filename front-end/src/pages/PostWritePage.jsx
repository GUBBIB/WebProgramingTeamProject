import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import './PostWritePage.css';
import { createNewPost } from '../services/api'; // Import createNewPost from api.js

// API_BASE_URL is now managed within api.js

const boardTypesData = [
  { BRD_id: 'code', BRD_name: '코드 게시판' },
  { BRD_id: 'free', BRD_name: '자유게시판' },
  { BRD_id: 'qna', BRD_name: '질문 게시판' },
];

const PostWritePage = ({ currentUser }) => {
  const [PST_title, setTitle] = useState('');
  const [PST_content, setContent] = useState('');
  const [BRD_id, setSelectedBoard] = useState(boardTypesData[0]?.BRD_id || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePostSubmit = async () => {
    setError('');

    if (!currentUser || !currentUser.isLoggedIn) {
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
        PST_title: PST_title,
        PST_content: PST_content,
        BRD_id: BRD_id,
        // USR_id should be handled by the backend if not using token-based auth (e.g., via session)
        // If your backend expects USR_id in the payload, you might need to add it:
        // USR_id: currentUser.details?.USR_id, 
      };

      // Use createNewPost from api.js
      const data = await createNewPost(newPostData);

      // The createNewPost function in api.js will throw an error if response is not ok.
      // If successful, data will be the parsed JSON response, expected to contain PST_id.
      if (data.PST_id) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate(`/post/${data.PST_id}?boardType=${BRD_id}`); 
      } else {
        // This case might indicate a successful HTTP response but unexpected data structure
        setError(data.message || '게시글 등록에 성공했으나, 응답 데이터가 올바르지 않습니다.');
      }
    } catch (err) { // Catch error thrown by fetchApi in api.js
      console.error('게시글 등록 API 호출 오류:', err.message);
      setError(err.data?.message || err.message || '게시글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="post-write-container">
      <h1 className="page-title">새 게시글 작성</h1>
      {error && <p className="error-message">{error.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
      <div className="post-write-form">
        <div className="form-group">
          <label htmlFor="boardType">게시판 선택</label>
          <select 
            id="boardType" 
            value={BRD_id}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="form-control"
            required
          >
            {boardTypesData.map(board => (
              <option key={board.BRD_id} value={board.BRD_id}>{board.BRD_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input 
            type="text" 
            id="title" 
            value={PST_title}
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="제목을 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group" data-color-mode="light">
          <label htmlFor="content">내용 (Markdown)</label>
          <MDEditor
            value={PST_content}
            onChange={setContent}
            height={400}
            previewOptions={{
              rehypePlugins: [],
            }}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handlePostSubmit} className="submit-button">등록</button>
          <button type="button" onClick={() => navigate(-1)} className="cancel-button">취소</button>
        </div>
      </div>
    </div>
  );
};

export default PostWritePage;

