import React from 'react';
import { Link } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
  // 날짜 형식 YYYY-MM-DD
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR'); // 예: 2025. 5. 15. 오전 10:00
  };
  

  return (
    <tr className="post-item-row">
      <td className="post-title">
        {/* 게시글 상세 페이지로 이동 */}
        <Link to={`/post/${post.PST_id}`}>{post.PST_title}</Link>
      </td>
      <td className="post-author">{post.user?.USR_email ?? '익명'}</td>
      <td className="post-date">{formatDate(post.created_at)}</td>
      <td className="post-views">{post.PST_views ?? 0}</td>
    </tr>
  );
};

export default PostItem;
