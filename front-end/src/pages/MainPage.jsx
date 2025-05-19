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
import ProfilePage from "../pages/ProfilePage"

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

const handleSearch = async (searchType, searchTerm) => {
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
      // 여기서 data.results를 사용하여 화면에 출력하거나 상태 저장 가능
    } catch (error) {
      console.error("에러 발생:", error);
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
