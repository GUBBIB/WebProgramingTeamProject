import React from 'react';
import PostItem from './PostItem'; // PostItem 컴포넌트를 import 합니다.
import './PostList.css';

const PostList = ({ posts }) => {
  // posts 배열이 비어있거나 없을 경우를 대비한 처리
  if (!posts || posts.length === 0) {
    return <div className="no-posts">게시글이 없습니다.</div>;
  }

  return (
    <div className="post-list-container">
      <table className="post-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.slice(0, 8).map((post) => ( // 최대 8개의 게시글만 보이도록 slice
            <PostItem key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;
