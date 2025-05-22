import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentList from "../components/Comment/CommentList";
import "../components/Comment/Comment.css";
import "./PostDetailPage.css";

const API_BASE_URL = 'http://localhost:8000/api';

const PostDetailPage = ({ currentUser }) => {
  const { BRD_id, PST_id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 조회수 증가
      await fetch(`${API_BASE_URL}/boards/${BRD_id}/posts/${PST_id}/view`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      // 게시글 가져오기
      const postRes = await fetch(
        `${API_BASE_URL}/boards/${BRD_id}/posts/${PST_id}`
      );
      if (!postRes.ok) throw new Error("게시글 조회 실패");
      const postData = await postRes.json();
      setPost(postData);
    } catch (err) {
      setError(err.message || "게시글 로딩 실패");
    } finally {
      setIsLoading(false);
    }
  }, [BRD_id, PST_id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleEdit = () => {
    navigate(`/boards/${BRD_id}/posts/${PST_id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${PST_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "삭제 실패" }));
        throw new Error(errorData.message || `HTTP error ${res.status}`);
      }

      alert("게시글이 삭제되었습니다.");
      navigate("/");
    } catch (err) {
      alert(`삭제 중 오류 발생: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <div className="post-detail-container">로딩 중...</div>;
  if (error)
    return (
      <div className="post-detail-container error-message">❌ {error}</div>
    );
  if (!post)
    return (
      <div className="post-detail-container">게시글이 존재하지 않습니다.</div>
    );

  const isAuthor =
    currentUser && currentUser.USR_id === post?.data?.user?.USR_id;

  return (
    <div className="post-detail-container">
      <h1>{post.data.PST_title}</h1>

      <div className="post-meta">
        <span>작성자: {post.data.user?.USR_nickname || "익명"}</span>
        <span>작성일: {formatDate(post.data.created_at)}</span>
        <span>조회수: {post.data.PST_views}</span>
        <span>게시판 이름: {post.data.board.BRD_name}</span>
      </div>

      {isAuthor && (
        <div className="post-actions">
          <button onClick={handleEdit}>✏️ 수정</button>
          <button onClick={handleDelete} className="delete-btn">
            🗑 삭제
          </button>
        </div>
      )}

      <hr />

      <div className="post-content markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.data.PST_content}
        </ReactMarkdown>
      </div>

      <hr />

      <div className="comments-section">
        <h2>댓글</h2>
        <CommentList
          BRD_id={BRD_id}
          PST_id={PST_id}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;
