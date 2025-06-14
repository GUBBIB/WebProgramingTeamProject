import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header/Header";
import PostDetailPage from "./PostDetailPage";
import PostWritePage from "./PostWritePage";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import "./MainPage.css";
import BoardControls from "../components/Board/BoardControls";
import BoardTypeSelector from "../components/Board/BoardTypeSelector";
import GPTCodeHelper from "../components/GPTCodeHelper/GPTCodeHelper";
import IntroPage from "./IntroPage";

const API_BASE_URL = "/api";

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [searchedPosts, setSearchedPosts] = useState(null);
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState(null);
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const pageParam = parseInt(searchParam.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    currentPage: pageParam,
    totalPages: 1,
    total: 0,
  });

  // 세션에서 로그\인 유저 정보 받아오기
  useEffect(() => {
    fetch(`${API_BASE_URL}/user`, { credentials: "include" })
      .then(async (res) => {
        console.log("응답 status:", res.status);
        console.log("응답 Content-Type:", res.headers.get("content-type"));

        const text = await res.text(); // JSON이 아닌 경우 확인 가능
        console.log("응답 body (text):", text);

        try {
          const data = JSON.parse(text);
          if (data && data.USR_id) {
            setCurrentUser({
              USR_id: data.USR_id,
              isLoggedIn: true,
              details: data,
            });
          } else {
            console.warn("❌ user 정보 없음:", data);
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("❌ JSON 파싱 에러:", err);
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.error("❌ fetch 실패:", err);
        setCurrentUser(null);
      });
  }, []);

  // 로그인 성공 시 호출
  const handleLogin = (user) => {
    console.log("로그인 성공:", user);
    setCurrentUser({
      USR_id: user.USR_id,
      isLoggedIn: true,
      details: user,
    });
  };

  // 회원가입 성공 시 호출
  const handleRegister = (user) => {
    console.log("회원가입 성공:", user);
    setCurrentUser({
      USR_id: user.USR_id,
      isLoggedIn: true,
      details: user,
    });
    navigate("/"); // 회원가입 후 메인 페이지로 이동
  };

  // 로그아웃
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setCurrentUser(null);
  };

  // 검색
  const handleSearch = async (searchType, searchTerm, setKeyword) => {
    if (!searchTerm.trim()) {
      setSearchedPosts(null);
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/boards/search?page=${pagination}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 세션 인증 사용하는 경우
          body: JSON.stringify({
            field: searchType,
            keyword: searchTerm,
            BRD_id: selectedBoard,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("검색 실패:", errorData.message);
        return;
      }

      const data = await response.json();

      console.log("검색 결과:", data);

      const results = data.results;

      setSearchedPosts({
        results: results.data || [], // posts 배열
      });

      setPagination({
        currentPage: results.current_page,
        totalPages: results.last_page,
        total: results.total,
      });
    } catch (error) {}
    setKeyword("");
  };

  useEffect(() => {
    setSearchedPosts(null);
  }, [selectedBoard]);

  return (
    <div>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="app-main-content">
        <Routes>
          <Route 
            path="/"
            element={<IntroPage />}
          />
          <Route
            path="/main"
            element={
              <div>
                <BoardTypeSelector
                  selectedBoard={selectedBoard}
                  onSelectedBoard={setSelectedBoard}
                  searchedPosts={searchedPosts}
                  pagination={pagination}
                  setPagination={setPagination}
                />
                <BoardControls
                  onSearch={handleSearch} // (추가됨)
                />
              </div>
            }
          />

          <Route
            path="/boards/:BRD_id/posts/:PST_id"
            element={<PostDetailPage currentUser={currentUser} />}
          />

          {/* ✅ 게시글 작성 */}
          <Route
            path="/write"
            element={
              currentUser?.isLoggedIn ? (
                <PostWritePage currentUser={currentUser} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/ai-review"
            element={
              <GPTCodeHelper />
            }
          />


          {/* ✅ 게시글 수정 (PST_id 존재 시 수정 모드로 PostWritePage 재사용) */}
          <Route
            path="/boards/:BRD_id/posts/:PST_id/edit"
            element={
              currentUser?.isLoggedIn ? (
                <PostWritePage currentUser={currentUser} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          {/* ✅ 회원가입 시 handleRegister 전달 */}
          <Route
            path="/signup"
            element={<SignupPage onRegister={handleRegister} />}
          />

          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/profile"
            element={
              currentUser?.isLoggedIn ? (
                <ProfilePage currentUser={currentUser} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
