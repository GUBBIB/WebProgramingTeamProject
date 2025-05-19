import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostItem from './PostItem';
import Pagination from '../Board/Pagination'; // 실제 경로 확인 필요

const API_BASE_URL = '/api'; // 예시 URL

const PostList = ({ BRD_id, onSelectedBoard, searchedPosts }) => { // (변경됨)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParam] = useSearchParams();
  const pageParam = parseInt(searchParam.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    currentPage: pageParam,
    totalPages: 1,
    total: 0,
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url =
        String(BRD_id) === "1"
          ? `${API_BASE_URL}/boards/postAll?page=${pagination.currentPage}`
          : `${API_BASE_URL}/boards/${BRD_id}?page=${pagination.currentPage}`;

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("서버 응답 오류");

      const data = await response.json();
      console.log("API 응답:", data);

      setPosts(data.data || []);
      setPagination({
        currentPage: data.current_page,
        totalPages: data.last_page,
        total: data.total,
      });
    } catch (err) {
      setError(err.message || "게시글 로딩 실패");
    } finally {
      setLoading(false);
    }
  }, [BRD_id, pagination.currentPage]);

  // 🔧 검색 결과 우선 적용
  useEffect(() => {
    if (searchedPosts) {
      setPosts(searchedPosts.results || []);
      setLoading(false);
    } else {
      fetchPosts();
    }
  }, [fetchPosts, searchedPosts]); // (변경됨)

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">에러 발생: {error}</div>;
  if (!posts || posts.length === 0)
    return <div className="no-posts">게시글이 없습니다.</div>;

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
          {posts.map((post) => (
            <PostItem key={post.PST_id} post={post} />
          ))}
        </tbody>
      </table>

      {/* 🔧 검색 시에는 페이지네이션 숨김 */}
      {!searchedPosts && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PostList;