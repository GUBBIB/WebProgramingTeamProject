import React, { useState } from 'react';
import './Comment.css';

const CommentForm = ({ onSubmitComment, currentUser }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!currentUser || !currentUser.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    // onSubmitComment에 author와 text를 전달. author는 currentUser.username 사용
    onSubmitComment({ author: currentUser.username, text: comment });
    setComment(''); // 입력 필드 초기화
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {/* 작성자명 입력 필드 제거 */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={currentUser?.isLoggedIn ? `${currentUser.username}님, 댓글을 입력하세요...` : "댓글을 입력하려면 로그인하세요..."}
        rows="3"
        required
        disabled={!currentUser?.isLoggedIn}
      />
      <button type="submit" disabled={!currentUser?.isLoggedIn}>
        {currentUser?.isLoggedIn ? "댓글 작성" : "로그인 후 작성 가능"}
      </button>
    </form>
  );
};

export default CommentForm;

