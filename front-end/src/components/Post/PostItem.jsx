import React from 'react';
import { Link } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
  // ✅ 여기에 날짜 포맷 함수 정의
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  return (
    <tr className="post-item-row">
      <td className="post-title">
        <Link to={`/post/${post.PST_id}`}>{post.PST_title}</Link>
      </td>
      <td className="post-author">{post.user?.USR_email ?? '익명'}</td>
      <td className="post-date">{formatDate(post.created_at)}</td>
      <td className="post-views">{post.PST_views ?? 0}</td>
    </tr>
  );
};

export default PostItem;
