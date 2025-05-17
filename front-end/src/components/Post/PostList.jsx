<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
import Pagination from '../Board/Pagination';
import './PostList.css';
=======
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PostItem from "./PostItem";
import Pagination from "../Board/Pagination";
import "./PostList.css";
>>>>>>> 82de0dfa2eaef67dd3034bdbac36804e07e5ea38

const API_BASE_URL = "http://13.60.93.77/api";

const PostList = ({ BRD_id }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParam, setSearchParam] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // 현재 페이지 가져오기
  const page = parseInt(searchParam.get("page") || "1", 10);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
  
      try {
        // 게시판 ID에 따라 엔드포인트 결정
        const url =
<<<<<<< HEAD
          String(BRD_id) === "1"
            ? `${API_BASE_URL}/boards/postAll?page=${page}`
            : `${API_BASE_URL}/boards/${BRD_id}?page=${page}`;

=======
          String(BRD_id) === '1'
            ? `${API_BASE_URL}/boards/postAll?page=${page}`
            : `${API_BASE_URL}/boards/${BRD_id}?page=${page}`;
  
>>>>>>> 0b246abd98b455a00050a5cc73f54b629058f1de
        const response = await fetch(url, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
<<<<<<< HEAD

        if (!response.ok) {
          throw new Error("서버 응답 오류: " + response.status);
        }

        const data = await response.json();
        console.log("API 응답:", data);

        const postsData = Array.isArray(data) ? data : data.data || [];
        const lastPage = data.last_page || 1;

        setPosts(postsData);
        setTotalPages(lastPage);

        // 총 페이지 수 설정 (API가 이 정보를 제공한다고 가정)
        setTotalPages(data.last_page || 1);
=======
  
        if (!response.ok) throw new Error('서버 응답 오류');
  
        const data = await response.json();
        console.log('API 응답:', data); 

        setPosts(data.data || []);
>>>>>>> 0b246abd98b455a00050a5cc73f54b629058f1de
      } catch (err) {
        console.error("게시글 로딩 실패:", err);
        setError(err.message || "게시글 로딩 실패");
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

    if (BRD_id) {
      fetchPosts();
    }
=======
  
    fetchPosts();
>>>>>>> 0b246abd98b455a00050a5cc73f54b629058f1de
  }, [BRD_id, page]);
  

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    searchParam.set("page", newPage);
    setSearchParam(searchParam);
  };

  if (loading) return <div className="loading">게시글을 불러오는 중...</div>;
  if (error) return <div className="error">에러 발생: {error}</div>;
  if (!posts || posts.length === 0)
    return <div className="no-posts">게시글이 없습니다.</div>;

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
          {posts.map((post) => (
            <PostItem key={post.PST_id} post={post} />
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 컴포넌트 */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PostList;
