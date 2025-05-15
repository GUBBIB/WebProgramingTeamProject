import React from 'react';
import PostItem from './PostItem';
import './PostList.css';

const PostList = ({ posts }) => {
  // Laravel의 paginate 응답 구조에 맞춰서 posts.data 사용
  const postArray = posts?.data ?? posts; // 둘 중 뭐든 배열로 처리

  // posts가 없거나 비어있으면 메시지 출력
  if (!postArray || postArray.length === 0) {
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
          {postArray.slice(0, 8).map((post) => (
            <PostItem key={post.PST_id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;