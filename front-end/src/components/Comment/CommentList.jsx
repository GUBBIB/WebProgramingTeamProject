import React, { useState, useEffect, useCallback } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './Comment.css';

const API_BASE_URL = '/api';

const CommentList = ({ BRD_id, PST_id, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  // 댓글 목록 불러오기
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/boards/${BRD_id}/posts/${PST_id}/comments`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('댓글 조회 실패');
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      setError(err.message || '댓글 로딩 중 오류 발생');
    }
  }, [BRD_id, PST_id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성 후 콜백
  const onSubmitComment = async (COM_content) => {
    if (!currentUser?.isLoggedIn) return;
    console.log('COM_content: ', COM_content);
    console.log('PST_id: ', PST_id);
    console.log('USR_id: ', currentUser?.USR_id);
    
    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USR_id: currentUser?.USR_id,
          PST_id: PST_id,
          COM_content: COM_content,
        }),
      });
      const data = await res.json();

      if (!res.ok){
        console.error('에러 응답:', data); // 🔥 이거 꼭 추가
        throw new Error('댓글 작성 실패');
      } 
      await fetchComments(); // 새 댓글 작성 후 목록 갱신
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="comment-list">
      <h3 className="comment-list-title">댓글 ({comments?.length || 0})</h3>

      {error && <p className="error-message">❌ {error}</p>}

      {(!comments || comments.length === 0) && (
        <p className="no-comments">아직 댓글이 없습니다.</p>
      )}

      {comments?.map((comment) => (
        <CommentItem key={comment.COM_id} comment={comment} />
      ))}

      {/* 댓글 작성 폼 */}
      <CommentForm currentUser={currentUser} onSubmitComment={onSubmitComment} />
    </div>
  );
};

export default CommentList;
