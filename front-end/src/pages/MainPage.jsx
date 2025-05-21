import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import PostDetailPage from "./PostDetailPage";
import PostWritePage from "./PostWritePage";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import "./MainPage.css";
import BoardControls from "../components/Board/BoardControls";
import BoardTypeSelector from "../components/Board/BoardTypeSelector";

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchedPosts, setSearchedPosts] = useState(null);
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState(null);
  const navigate = useNavigate();

  // 세션에서 로그인 유저 정보 받아오기
  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        console.log(data);
        if (data.user) {
          setCurrentUser({
            USR_id: data.user.USR_id,
            isLoggedIn: true,
            details: data.user,
          });
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
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
  const handleSearch = async (searchType, searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchedPosts(null); // ✅ 검색어 없으면 검색 상태 해제
      return;
    }
    try {
      const response = await fetch("/api/boards/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 인증 사용하는 경우
        body: JSON.stringify({
          field: searchType,
          keyword: searchTerm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("검색 실패:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log("검색 결과:", data);
      setSearchedPosts(data);
      // 여기서 data.results를 사용하여 화면에 출력하거나 상태 저장 가능
    } catch (error) {
    }
  };

  return (
    <div>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <BoardTypeSelector
                  selectedBoard={selectedBoard}
                  onSelectedBoard={setSelectedBoard}
                  searchedPosts={searchedPosts}
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
