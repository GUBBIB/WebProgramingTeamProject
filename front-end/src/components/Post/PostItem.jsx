import React from 'react';
import { Link } from 'react-router-dom'; // react-router-dom에서 Link를 import 합니다.
import './PostItem.css';

const PostItem = ({ post }) => {
  // 날짜 형식을 'YYYY-MM-DD'로 변경하는 함수 (필요에 따라 구현)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR'); // 한국 날짜 형식
  };

  return (
    <tr className="post-item-row">
      <td className="post-title">
        {/* 제목을 클릭하면 해당 게시글의 상세 페이지로 이동합니다. */}
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </td>
      <td className="post-author">{post.author || '익명'}</td>
      <td className="post-date">{formatDate(post.createdAt)}</td>
      <td className="post-views">{post.views || 0}</td>
    </tr>
  );
};

export default PostItem;
