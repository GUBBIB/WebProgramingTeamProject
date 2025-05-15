import React from 'react';
import './Comment.css';

const CommentItem = ({ comment }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  // API 응답에서 comment 객체는 COM_id, COM_content, created_at, user 객체 (USR_nickname 포함) 등을 가질 것으로 예상합니다.
  // comment.user가 없을 경우를 대비하여 optional chaining과 기본값을 사용합니다.
  const authorNickname = comment.user?.USR_nickname || '익명';

  return (
    <div className="comment-item">
      <div className="comment-author-date">
        <span className="comment-author">{authorNickname}</span>
        <span className="comment-date">{formatDate(comment.created_at)}</span>
      </div>
      <p className="comment-text">{comment.COM_content}</p>
    </div>
  );
};

export default CommentItem;

