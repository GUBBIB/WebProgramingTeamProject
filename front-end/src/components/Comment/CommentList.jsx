import React from 'react';
import CommentItem from './CommentItem';
import './Comment.css';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="no-comments">아직 댓글이 없습니다.</p>;
  }

  return (
    <div className="comment-list">
      <h3 className="comment-list-title">댓글 ({comments.length})</h3>
      {/* API 응답에서 각 comment 객체는 COM_id를 고유 키로 가질 것으로 예상 */}
      {comments.map((comment) => (
        <CommentItem key={comment.COM_id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;

