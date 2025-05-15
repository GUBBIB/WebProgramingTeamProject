import React from 'react';
import './Comment.css'; // CommentItem에 대한 CSS (추후 생성)

const CommentItem = ({ comment }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="comment-item">
      <div className="comment-author-date">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  );
};

export default CommentItem;

