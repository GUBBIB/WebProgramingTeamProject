import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem';
import './Comment.css';

const CommentList = ({ BRD_id, PST_id }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://13.60.93.77/boards/'+ BRD_id + '/posts/' + PST_id + '/comments');
        setComments(response.data);
      } catch (error) {
        console.error('댓글 불러오기 실패:', error);
      }
    };

    fetchComments();
  }, [BRD_id, PST_id]);

  if (!comments || comments.length === 0) {
    return <p className="no-comments">아직 댓글이 없습니다.</p>;
  }

  return (
    <div className="comment-list">
      <h3 className="comment-list-title">댓글 ({comments.length})</h3>
      {comments.map((comment) => (
        <CommentItem key={comment.COM_id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
