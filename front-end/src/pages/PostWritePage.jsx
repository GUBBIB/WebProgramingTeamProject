import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import './PostWritePage.css';

const API_BASE_URL = 'http://13.60.93.77/api';

const PostWritePage = ({ currentUser }) => {
  const [PST_title, setTitle] = useState('');
  const [PST_content, setContent] = useState('');
  const [BRD_id, setSelectedBoard] = useState('');
  const [boardTypes, setBoardTypes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 게시판 목록 로딩
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/boards`, {
          credentials: 'include',
        });
        const data = await response.json();
        setBoardTypes(data);
        if (data.length > 0) {
          setSelectedBoard(data[0].BRD_id);
        }
      } catch (err) {
        console.error('게시판 목록 불러오기 실패:', err);
        setError('게시판 목록을 불러오는 데 실패했습니다.');
      }
    };

    fetchBoards();
  }, []);

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
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          BRD_id: BRD_id,
          USR_id: currentUser.details?.USR_id,
          PST_title,
          PST_content,
        }),
      });

      const data = await response.json();

      if (response.ok && data.PST_id) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate(`/boards/${BRD_id}/posts/${data.PST_id}`);
      } else {
        setError(data.message || '게시글 등록 실패');
      }
    } catch (err) {
      console.error('게시글 등록 실패:', err);
      setError('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="post-write-container">
      <h1 className="page-title">새 게시글 작성</h1>
      {error && (
        <p className="error-message">
          {error.split('\n').map((line, i) => (
            <span key={i}>{line}<br/></span>
          ))}
        </p>
      )}
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
            {boardTypes.map((board) => (
              <option key={board.BRD_id} value={board.BRD_id}>
                {board.BRD_name}
              </option>
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
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handlePostSubmit} className="submit-button">
            등록
          </button>
          <button type="button" onClick={() => navigate(-1)} className="cancel-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostWritePage;
