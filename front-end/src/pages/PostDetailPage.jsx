import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentList from '../components/Comment/CommentList';
import '../components/Comment/Comment.css';
import './PostDetailPage.css';

const API_BASE_URL = 'http://13.60.93.77/api';

const PostDetailPage = ({ currentUser }) => {
  const { BRD_id, PST_id } = useParams();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 조회수 증가
      await fetch(`${API_BASE_URL}/boards/${BRD_id}/posts/${PST_id}/view`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      // 게시글 가져오기
      const postRes = await fetch(`${API_BASE_URL}/boards/${BRD_id}/posts/${PST_id}`);
      console.log("게시글 상세보기 1")
      if (!postRes.ok) throw new Error('게시글 조회 실패');
      console.log("게시글 상세보기 2")
      const postData = await postRes.json();
      
      setPost(postData);
    } catch (err) {
      setError(err.message || '게시글 로딩 실패');
    } finally {
      setIsLoading(false);
    }
  }, [BRD_id, PST_id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <div className="post-detail-container">로딩 중...</div>;
  if (error) return <div className="post-detail-container error-message">❌ {error}</div>;
  if (!post) return <div className="post-detail-container">게시글이 존재하지 않습니다.</div>;

  return (
    <div className="post-detail-container">
      <h1>{post.PST_title}</h1>
      <div className="post-meta">
        <span>작성자: {post.user?.USR_nickname || '익명'}</span>
        <span>작성일: {formatDate(post.created_at)}</span>
        <span>조회수: {post.PST_views}</span>
        <span>게시판 ID: {BRD_id}</span>
      </div>

      <hr />

      <div className="post-content markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.PST_content}
        </ReactMarkdown>
      </div>

      <hr />

      <div className="comments-section">
        <h2>댓글</h2>
        <CommentList BRD_id={BRD_id} PST_id={PST_id} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PostDetailPage;
