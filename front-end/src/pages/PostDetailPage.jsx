import React from 'react';
import { useParams } from 'react-router-dom';
import './PostDetailPage.css'; // CSS 파일 임포트

// 실제 애플리케이션에서는 API를 통해 게시글 데이터를 가져옵니다.
// 여기서는 예시 데이터를 사용합니다.
const getSamplePost = (postId) => {
  return {
    id: postId,
    title: `게시글 제목 ${postId}`,
    author: '작성자 예시',
    createdAt: new Date().toISOString(),
    views: 100,
    content: `여기는 게시글 ${postId}의 상세 내용입니다. Markdown 형식으로 작성될 수도 있고, 일반 텍스트일 수도 있습니다. API 연동 시 실제 데이터로 대체됩니다.`,
    boardType: '자유게시판'
  };
};

const PostDetailPage = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId를 가져옵니다.
  const post = getSamplePost(postId); // 예시 데이터 가져오기

  if (!post) {
    return <div className="post-detail-container">게시글을 찾을 수 없습니다.</div>;
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
      <div className="post-detail-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}>
        {/* HTML 내용을 직접 삽입할 경우 dangerouslySetInnerHTML 사용 */}
        {/* 일반 텍스트의 경우: <p>{post.content}</p> */}
      </div>
      {/* 댓글, 수정/삭제 버튼 등 추가 기능이 들어갈 수 있습니다. */}
    </div>
  );
};

export default PostDetailPage;
