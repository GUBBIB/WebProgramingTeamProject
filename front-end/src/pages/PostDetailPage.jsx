import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentList from '../components/Comment/CommentList';
import CommentForm from '../components/Comment/CommentForm';
import '../components/Comment/Comment.css';
import './PostDetailPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

const PostDetailPage = ({ currentUser }) => {
  const { postId } = useParams(); // This will be PST_id
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get('boardType') || 'all'; // This will be BRD_id
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/posts/${postId}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: '게시글을 불러오는데 실패했습니다.' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // API 응답이 { "data": { ...post_details... } } 형태일 수 있음, 또는 바로 post 객체일 수 있음.
        // PHP 모델을 보면 PostController@posts_Details_Search 가 직접 Post 모델을 반환할 가능성이 높음.
        // 우선 data가 바로 post 객체라고 가정. 만약 data.data 형태라면 data.data로 수정.
        setPost(data); 
        
        fetchComments();
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostDetail();
    }
  }, [postId, boardId]);

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/comments?post_id=${postId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '댓글을 불러오는데 실패했습니다.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setComments(data.data || []); // API 응답이 { data: [...] } 형태라고 가정
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // 새 댓글 추가
  const handleAddComment = async (newCommentData) => {
    if (!currentUser || !currentUser.isLoggedIn) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }

      const commentPayload = {
        PST_id: postId, // Post ID
        BRD_id: boardId, // Board ID, API 명세에 따라 필요 없을 수도 있음. Comments 모델은 PST_id, USR_id만 fillable
        COM_content: newCommentData.text // Comment content from form
        // USR_id는 백엔드에서 토큰으로 처리
      };

      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commentPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '댓글 등록에 실패했습니다.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      fetchComments(); // Refresh comments list
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(`댓글 등록 중 오류가 발생했습니다: ${err.message}`);
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

  // API 응답에서 post.user.USR_nickname, post.board.BRD_name 형태로 올 수 있음
  const authorNickname = post.user?.USR_nickname || '정보 없음';
  const boardName = post.board?.BRD_name || boardId; // boardId는 'code', 'free' 등, BRD_name은 '코드 게시판'

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

