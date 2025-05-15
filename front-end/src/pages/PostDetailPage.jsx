import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentList from '../components/Comment/CommentList';
import CommentForm from '../components/Comment/CommentForm';
import '../components/Comment/Comment.css';
import './PostDetailPage.css';
import {
  fetchPostDetails,
  fetchCommentsForPost,
  createNewComment,
  fetchCurrentUserSession
} from '../services/api';

const PostDetailPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get('boardType') || 'all';

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 📌 세션 기반 로그인 사용자 정보 요청
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUserSession();
        setCurrentUser(userData);
      } catch (err) {
        console.warn('사용자 세션 없음');
        setCurrentUser(null);
      }
    };
    loadUser();
  }, []);

  // 📌 게시글 + 댓글 로딩
  const loadPostAndComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const postData = await fetchPostDetails(boardId, postId);
      setPost(postData);

      const commentsData = await fetchCommentsForPost(boardId, postId);
      setComments(commentsData.data || []);
    } catch (err) {
      console.error("Error fetching post or comments:", err.message);
      setError(err.data?.message || err.message || '게시글 또는 댓글을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [postId, boardId]);

  useEffect(() => {
    if (postId) {
      loadPostAndComments();
    }
  }, [loadPostAndComments, postId]);

  // 📌 댓글 등록 핸들러
  const handleAddComment = async (newCommentData) => {
    if (!currentUser) {
      alert('댓글 작성은 로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }

    try {
      const payload = {
        PST_id: postId,
        COM_content: newCommentData.text
        // ⚠️ USR_id는 세션으로 백엔드가 처리함
      };

      await createNewComment(payload);

      const updatedCommentsData = await fetchCommentsForPost(boardId, postId);
      setComments(updatedCommentsData.data || []);
    } catch (err) {
      console.error("댓글 작성 실패:", err.message);
      alert(`댓글 등록 중 오류 발생: ${err.data?.message || err.message}`);
    }
  };

  // 📌 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // 📌 로딩/에러/없음 처리
  if (isLoading) return <div className="post-detail-container">게시글 로딩 중...</div>;
  if (error) return <div className="post-detail-container error-message">오류: {error}</div>;
  if (!post) return <div className="post-detail-container">게시글이 존재하지 않습니다.</div>;

  const authorNickname = post.user?.USR_nickname || '정보 없음';
  const boardName = post.board?.BRD_name || boardId;

  return (
    <div className="post-detail-container">
      {/* 📝 제목 및 메타 정보 */}
      <h1 className="post-detail-title">{post.PST_title}</h1>
      <div className="post-meta">
        <span className="post-author">작성자: {authorNickname}</span>
        <span className="post-date">작성일: {formatDate(post.created_at)}</span>
        <span className="post-views">조회수: {post.PST_views}</span>
        <span className="post-board-type">게시판: {boardName}</span>
      </div>

      <hr className="divider" />

      {/* 📄 게시글 내용 */}
      <div className="post-detail-content markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.PST_content}
        </ReactMarkdown>
      </div>

      <hr className="divider" />

      {/* 💬 댓글 섹션 */}
      <div className="comments-section">
        <h2>댓글</h2>
        <CommentList comments={comments} />
        <CommentForm onSubmitComment={handleAddComment} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PostDetailPage;
