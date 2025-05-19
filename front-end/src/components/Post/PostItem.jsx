import React from "react";
import { Link } from "react-router-dom";
import "./PostItem.css";

const PostItem = ({ post }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  const authorNickname = post.user?.USR_nickname || "익명";

  return (
    <tr className="post-item-row">
      <td className="post-type">{post.board?.BRD_name || "없음"}</td>
      <td className="post-title">
        <Link to={`/boards/${post.BRD_id}/posts/${post.PST_id}`}>
          {post.PST_title}
        </Link>
      </td>
      <td className="post-author">{authorNickname}</td>
      <td className="post-date">{formatDate(post.created_at)}</td>
      <td className="post-views">{post.PST_views || 0}</td>
    </tr>
  );
};

export default PostItem;
