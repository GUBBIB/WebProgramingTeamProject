
import React from 'react';
import './Comment.css';

const CommentItem = ({ comment }) => {
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 작성자 닉네임 (없으면 익명)
  const authorNickname = comment.user?.USR_nickname || '익명';

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{authorNickname}</span>
        <span className="comment-date">{formatDate(comment.created_at)}</span>
      </div>
      <div className="comment-body">
        <p className="comment-text">{comment.CMT_content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
