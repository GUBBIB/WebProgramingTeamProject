<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PostItem from "./PostItem";
import "./PostList.css";
import Pagination from "../Board/Pagination";
=======
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
import './PostList.css';
import Pagination from '../Board/Pagination';
>>>>>>> d31105bd25ce59fcbca9b76d83ac04598bc48357

const API_BASE_URL = "http://13.60.93.77/api";

const PostList = ({ BRD_id }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [searchParam] = useSearchParams();
  const pageParam = parseInt(searchParam.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    currentPage: pageParam,
=======
  const [pagination, setPagination] = useState({
    currentPage: 1,
>>>>>>> d31105bd25ce59fcbca9b76d83ac04598bc48357
    totalPages: 1,
    total: 0,
  });

<<<<<<< HEAD
  // ✅ fetchPosts를 useCallback으로 바깥에 정의
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

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
=======
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = parseInt(searchParam.get('page') || '1', 10);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const url =
          String(BRD_id) === '1'
            ? `${API_BASE_URL}/boards/postAll?page=${currentPage}`
            : `${API_BASE_URL}/boards/${BRD_id}?page=${currentPage}`;

        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) throw new Error('서버 응답 오류');

        const data = await response.json();
        console.log('API 응답:', data);

        setPosts(data.data || []);
        setPagination({
          currentPage: data.current_page,
          totalPages: data.last_page,
          total: data.total,
        });
      } catch (err) {
        setError(err.message || '게시글 로딩 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [BRD_id, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setSearchParam({ page }); // 쿼리스트링으로 변경
>>>>>>> d31105bd25ce59fcbca9b76d83ac04598bc48357
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

<<<<<<< HEAD
=======
      {/* 페이지네이션에 필요한 값 전달 */}
>>>>>>> d31105bd25ce59fcbca9b76d83ac04598bc48357
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PostList;
