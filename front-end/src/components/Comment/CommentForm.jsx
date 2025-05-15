import React, { useState } from 'react';
import './Comment.css';

const CommentForm = ({ onSubmitComment, currentUser }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!currentUser || !currentUser.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    // onSubmitComment는 부모 컴포넌트(PostDetailPage.jsx)에서 실제 API 호출을 포함할 수 있으므로,
    // 해당 함수가 비동기 처리를 할 것을 대비하여 async로 선언하고 await를 사용합니다.
    await onSubmitComment({ author: currentUser.username, text: comment });
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

