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
  const [searchType, setSearchType] = useState('title'); // 검색 유형 상태 추가
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

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('http://13.60.93.77/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: { 
          Accept: 'application/json' 
        }
      });
  
      if (!res.ok) throw new Error('세션 없음');
  
      const data = await res.json();
      console.log('현재 로그인한 유저 ID:', data.USR_id); 
  
      setCurrentUser({
        username: data.USR_nickname,
        isLoggedIn: true,
        details: data
      });
  
    } catch (err) {
      console.error('세션 확인 실패:', err);
      setCurrentUser(null);
    }
  };
  
  useEffect(() => {
    fetchCurrentUser();
  }, []); 
  
  const handleLogin = async (username, userDetails) => {
    setCurrentUser({
      username: user.USR_nickname || user.USR_email,
      isLoggedIn: true,
      details: userDetails,
    });
  };
  

  // 로그아웃
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setCurrentUser(null);
    // 필요시 navigate('/')
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
