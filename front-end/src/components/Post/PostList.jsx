import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/boards/{BRD_id}?page=1'); // 실제 API 주소로 수정 필요
        if (!response.ok) throw new Error('서버 응답 오류');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">에러 발생: {error}</div>;
  if (!posts || posts.length === 0) return <div className="no-posts">게시글이 없습니다.</div>;

  return (
    <div className="post-list-container">
      <table className="post-table">
        <thead>
          <tr>
            <th>게시판</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.slice(0, 8).map((post) => (
            <PostItem key={post.PST_id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  );
};