import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentList from '../components/Comment/CommentList';
import CommentForm from '../components/Comment/CommentForm';
import '../components/Comment/Comment.css';
import './PostDetailPage.css';

const API_BASE_URL = 'http://13.60.93.77/api';

const PostDetailPage = () => {
  const { BRD_id, PST_id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 유저 세션 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('세션 없음');
      const data = await res.json();
      setCurrentUser(data);
    } catch {
      setCurrentUser(null);
    }
  };

  // 게시글, 댓글, 조회수 불러오기
  const loadPostAndComments = useCallback(async () => {
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
      if (!postRes.ok) throw new Error('게시글 조회 실패');
      const postData = await postRes.json();
      setPost(postData);

      // 댓글 가져오기
      const commentRes = await fetch(`${API_BASE_URL}/boards/${BRD_id}/posts/${PST_id}/comments`);
      if (!commentRes.ok) throw new Error('댓글 조회 실패');
      const commentData = await commentRes.json();
      setComments(commentData.comments || []);
    } catch (err) {
      setError(err.message || '게시글 또는 댓글 로딩 실패');
    } finally {
      setIsLoading(false);
    }
  }, [BRD_id, PST_id]);

  // 댓글 작성
  const handleAddComment = async (newCommentData) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          PST_id,
          COM_content: newCommentData.text,
        }),
      });

      if (!res.ok) throw new Error('댓글 등록 실패');
      await loadPostAndComments(); // 댓글 다시 불러오기
    } catch (err) {
      alert('댓글 등록 실패: ' + err.message);
    }
  };

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

  useEffect(() => {
    fetchCurrentUser();
    loadPostAndComments();
  }, [loadPostAndComments]);

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
        <CommentList comments={comments} />
        <CommentForm onSubmitComment={handleAddComment} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PostDetailPage;
