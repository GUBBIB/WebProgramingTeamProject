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
  const [searchType, setSearchType] = useState('title'); // 검색 유형 상태 추가
  const navigate = useNavigate();

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
      username,
      isLoggedIn: true,
      details: userDetails,
    });
  
    await fetchCurrentUser();
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

  const handleSearch = async (searchTerm, searchType) => {
    console.log(`검색 실행: ${searchTerm}, 검색 유형: ${searchType}`);
    // 여기에 검색 API 호출 로직 구현
  };

  return (
    <div>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-main-content">
        <Routes>
          <Route path="/" element={
            <div>
              <BoardTypeSelector selectedBoard={selectedBoard} onSelectedBoard={setSelectedBoard}/>
              <BoardControls 
                onSearch={handleSearch}
                selectedSearchType={searchType}
                onSelectSearchType={setSearchType}
              />
            </div>
          } />

          <Route path="/boards/:BRD_id/posts/:PST_id" element={<PostDetailPage currentUser={currentUser} />} />

          <Route path="/write" element={currentUser?.isLoggedIn 
            ? <PostWritePage currentUser={currentUser} /> 
            : <LoginPage onLogin={handleLogin} />} 
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