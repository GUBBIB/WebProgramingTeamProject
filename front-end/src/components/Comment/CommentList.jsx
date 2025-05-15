import React from 'react';
import CommentItem from './CommentItem';
import './Comment.css'; // CommentList에 대한 CSS (추후 생성)

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="no-comments">아직 댓글이 없습니다.</p>;
  }

  return (
    <div className="comment-list">
      <h3 className="comment-list-title">댓글 ({comments.length})</h3>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;

