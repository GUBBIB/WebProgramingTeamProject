import React, { useState } from 'react';
import './Comment.css';

const CommentForm = ({ onSubmitComment, currentUser }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (!currentUser || !currentUser.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await onSubmitComment(commentText); // 문자열만 넘김
      setCommentText(''); // 작성 후 초기화
    } catch (err) {
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="comment-form">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={
          currentUser?.isLoggedIn
            ? `${currentUser.details?.USR_nickname || '사용자'}님, 댓글을 입력하세요...`
            : '댓글을 입력하려면 로그인하세요...'
        }
        rows="3"
        disabled={!currentUser?.isLoggedIn}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!currentUser?.isLoggedIn || !commentText.trim()}
      >
        {currentUser?.isLoggedIn ? '댓글 작성' : '로그인 필요'}
      </button>
    </div>
  );
};

export default CommentForm;
