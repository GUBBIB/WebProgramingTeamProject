import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CommentList from '../components/Comment/CommentList';
import CommentForm from '../components/Comment/CommentForm';
import '../components/Comment/Comment.css';
import './PostDetailPage.css';

// App.jsx에 있는 allPosts 목 데이터를 가져오기 위한 임시 방편
// 실제 앱에서는 props, Context API, 또는 Redux/Zustand 등을 사용해야 합니다.
// 이 부분은 App.jsx에서 currentUser와 함께 게시글 데이터를 내려주는 방식으로 변경하는 것이 이상적입니다.
const AppMockPosts = [
    { id: '1', title: '리액트 질문입니다!', author: '개발자A', createdAt: '2024-05-10T10:00:00Z', views: 150, boardType: 'qna', content: '리액트에서 상태 관리는 어떻게 하는게 좋을까요? `Redux`, `Zustand`, `Context API` 등 선택지가 많네요. \n\n## 코드 예시\n```javascript\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n*감사합니다.*', comments: [{id: 'c1', author: '답변자1', text: 'Context API도 좋은 선택입니다.', createdAt: '2024-05-10T11:00:00Z'}] },
    { id: '2', title: '자바스크립트 클로저 심층 분석', author: '코딩마스터', createdAt: '2024-05-09T14:30:00Z', views: 250, boardType: 'code', content: '클로저는 자바스크립트의 강력한 기능 중 하나입니다. 이 글에서는 클로저의 동작 원리와 활용법을 자세히 다룹니다.', comments: [] },
    // ... (다른 목업 게시물들) ...
];

// 임시 데이터 함수 (실제 앱에서는 API 호출)
const getSamplePost = (postId) => {
    // PostWritePage에서 localStorage에 임시 저장한 게시글을 먼저 찾아봅니다.
    // 이 부분은 App.jsx에서 관리하는 allPosts를 직접 참조하거나 props로 받는 것이 좋습니다.
    // 여기서는 AppMockPosts를 사용합니다.
    const postFromMock = AppMockPosts.find(p => p.id === postId);
    if (postFromMock) {
        return JSON.parse(JSON.stringify(postFromMock)); // 깊은 복사하여 원본 데이터 불변성 유지
    }

    // 그래도 없으면 기본 샘플 데이터 반환
    return {
        id: postId,
        title: `게시글 제목 ${postId} (기본 샘플)`,
        author: '작성자 예시',
        createdAt: new Date().toISOString(),
        views: 100,
        content: `# 기본 샘플 게시글 ${postId}\n\n이것은 **기본** 마크다운 내용입니다.`,
        boardType: '자유게시판',
        comments: [] // 기본 댓글은 없음
    };
};

const PostDetailPage = ({ currentUser }) => { // currentUser prop 수신
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const currentPostData = getSamplePost(postId);
    setPost(currentPostData);
  }, [postId]);

  const handleAddComment = (newCommentData) => { // newCommentData는 { author: 'username', text: 'comment text' } 형태
    const commentToAdd = {
      id: `c${Date.now()}`,
      ...newCommentData, // author와 text 포함
      createdAt: new Date().toISOString(),
    };
    setPost(prevPost => ({
      ...prevPost,
      comments: [...(prevPost.comments || []), commentToAdd]
    }));
    // TODO: 실제 API가 있다면, 서버에 댓글을 저장하는 로직이 필요합니다.
  };

  if (!post) {
    return <div className="post-detail-container">게시글을 불러오는 중...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="post-detail-container">
      <h1 className="post-detail-title">{post.title}</h1>
      <div className="post-meta">
        <span className="post-author">작성자: {post.author}</span>
        <span className="post-date">작성일: {formatDate(post.createdAt)}</span>
        <span className="post-views">조회수: {post.views}</span>
        <span className="post-board-type">게시판: {post.boardType}</span>
      </div>
      <hr className="divider"/>
      <div className="post-detail-content markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
      <hr className="divider"/>
      <div className="comments-section">
        <h2>댓글</h2>
        <CommentList comments={post.comments || []} />
        {/* CommentForm에 currentUser prop 전달 */}
        <CommentForm onSubmitComment={handleAddComment} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PostDetailPage;

