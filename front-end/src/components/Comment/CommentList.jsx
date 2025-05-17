import React from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm'; // 댓글 작성 폼 import
import './Comment.css';

const CommentList = ({ comments, onSubmitComment, currentUser }) => {
  return (
    <div className="comment-list">
      <h3 className="comment-list-title">댓글 ({comments?.length || 0})</h3>

      {(!comments || comments.length === 0) && (
        <p className="no-comments">아직 댓글이 없습니다.</p>
      )}

      {comments?.map((comment) => (
        <CommentItem key={comment.COM_id} comment={comment} />
      ))}

      {/* 댓글 입력 폼 추가 */}
      <CommentForm
        currentUser={currentUser}
        onSubmitComment={onSubmitComment}
      />
    </div>
  );
};

export default CommentList;