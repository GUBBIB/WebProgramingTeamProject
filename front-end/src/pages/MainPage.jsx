import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import PostDetailPage from "./PostDetailPage";
import PostWritePage from "./PostWritePage";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import "./MainPage.css";
import BoardControls from "../components/Board/BoardControls";
import BoardTypeSelector from "../components/Board/BoardTypeSelector";

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchType, setSearchType] = useState("title"); // (추가됨) 검색 유형 상태
  const navigate = useNavigate();

  // 세션에서 로그인 유저 정보 받아오기
  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.user) {
          setCurrentUser({
            username: data.user.USR_nickname || data.user.USR_email,
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
    setCurrentUser({
      username: user.USR_nickname || user.USR_email,
      isLoggedIn: true,
      details: user,
    });
  };

  // 로그아웃
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setCurrentUser(null);
  };

  // (추가됨) 검색 핸들러
  const handleSearch = (term, type) => {
    console.log(`🔍 검색어: ${term}, 종류: ${type}`);
    // 여기에 게시글 검색 API 호출을 넣으면 됨
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
                />
                <BoardControls
                  onSearch={handleSearch} // (추가됨)
                  selectedSearchType={searchType} // (추가됨)
                  onSelectSearchType={setSearchType} // (추가됨)
                />
              </div>
            }
          />

          <Route
            path="/boards/:BRD_id/posts/:PST_id"
            element={<PostDetailPage currentUser={currentUser} />}
          />

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
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
