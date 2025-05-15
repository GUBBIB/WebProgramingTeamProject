import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentList from '../components/Comment/CommentList';
import CommentForm from '../components/Comment/CommentForm';
import '../components/Comment/Comment.css';
import './PostDetailPage.css';
// Import API functions
import { fetchPostDetails, fetchCommentsForPost, createNewComment } from '../services/api';

// API_BASE_URL is now managed within api.js

const PostDetailPage = ({ currentUser }) => {
  const { postId } = useParams(); // PST_id
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get('boardType') || 'all'; // BRD_id
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPostAndComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const postData = await fetchPostDetails(boardId, postId);
      setPost(postData); // Assuming API returns post object directly or data.data if wrapped
      
      const commentsData = await fetchCommentsForPost(boardId, postId);
      setComments(commentsData.data || []); // Assuming API returns { data: [...] }
    } catch (err) {
      console.error("Error fetching post details or comments:", err.message);
      setError(err.data?.message || err.message || '게시글 또는 댓글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [postId, boardId]);

  useEffect(() => {
    if (postId) {
      loadPostAndComments();
    }
  }, [loadPostAndComments, postId]); // Added postId to dependencies for safety, though covered by loadPostAndComments

  const handleAddComment = async (newCommentData) => {
    if (!currentUser || !currentUser.isLoggedIn) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      navigate('/login'); // Redirect to login if not logged in
      return;
    }

    try {
      const commentPayload = {
        PST_id: postId, 
        BRD_id: boardId, // May not be needed by backend if it can infer from PST_id
        COM_content: newCommentData.text,
        // USR_id should be handled by the backend (e.g., via session)
        // If your backend expects USR_id in the payload, you might need to add it:
        // USR_id: currentUser.details?.USR_id, 
      };

      // Use createNewComment from api.js
      await createNewComment(commentPayload);
      // Refresh comments list by re-fetching
      const updatedCommentsData = await fetchCommentsForPost(boardId, postId);
      setComments(updatedCommentsData.data || []);

    } catch (err) {
      console.error("Error adding comment:", err.message);
      alert(`댓글 등록 중 오류가 발생했습니다: ${err.data?.message || err.message}`);
    }
  };

  if (isLoading) {
    return <div className="post-detail-container">게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="post-detail-container error-message">오류: {error}</div>;
  }

  if (!post) {
    return <div className="post-detail-container">게시글을 찾을 수 없습니다.</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const authorNickname = post.user?.USR_nickname || '정보 없음';
  const boardName = post.board?.BRD_name || boardId;

  return (
    <div className="post-detail-container">
      <h1 className="post-detail-title">{post.PST_title}</h1>
      <div className="post-meta">
        <span className="post-author">작성자: {authorNickname}</span>
        <span className="post-date">작성일: {formatDate(post.created_at)}</span>
        <span className="post-views">조회수: {post.PST_views}</span>
        <span className="post-board-type">게시판: {boardName}</span>
      </div>
      <hr className="divider"/>
      <div className="post-detail-content markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.PST_content}</ReactMarkdown>
      </div>
      <hr className="divider"/>
      <div className="comments-section">
        <h2>댓글</h2>
        <CommentList comments={comments} />
        <CommentForm onSubmitComment={handleAddComment} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PostDetailPage;

