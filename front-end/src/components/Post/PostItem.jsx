import React from 'react';
import { Link } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // API 응답에서 post 객체는 PST_id, PST_title, PST_views, created_at, BRD_id, user 객체 (USR_nickname 포함) 등을 가질 것으로 예상합니다.
  // post.user가 없을 경우를 대비하여 optional chaining과 기본값을 사용합니다.
  const authorNickname = post.user?.USR_nickname || '익명';

  return (
    <tr className="post-item-row">
      <td className="post-title">
        {/* 상세 페이지 이동 시 boardType도 전달해야 PostDetailPage에서 API 호출 가능 */}
        <Link to={`/post/${post.PST_id}?boardType=${post.BRD_id}`}>{post.PST_title}</Link>
      </td>
      <td className="post-author">{authorNickname}</td>
      <td className="post-date">{formatDate(post.created_at)}</td>
      <td className="post-views">{post.PST_views || 0}</td>
    </tr>
  );
};

export default PostItem;
