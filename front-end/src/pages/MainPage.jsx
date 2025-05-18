<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import PostDetailPage from './PostDetailPage';
import PostWritePage from './PostWritePage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import PostList from '../components/Post/PostList';
import QAChatGPT from '../components/QA/QAChatGPT'; // 새로운 QAChatGPT 컴포넌트 추가
import './MainPage.css';
import BoardControls from '../components/Board/BoardControls';
import BoardTypeSelector from '../components/Board/BoardTypeSelector';
=======
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
>>>>>>> e5bc4f91a15caed096135e1c9c5491a5b5ca2689

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchType, setSearchType] = useState('title'); // 검색 유형 상태 추가
  const navigate = useNavigate();
<<<<<<< HEAD

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
=======
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
    console.log(user);
    setCurrentUser({
      USR_id: user.USR_id,
      isLoggedIn: true,
      details: user,
    });
    // 필요시 navigate('/')
>>>>>>> e5bc4f91a15caed096135e1c9c5491a5b5ca2689
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
<<<<<<< HEAD
          <Route path="/" element={
            <div>
              <BoardTypeSelector selectedBoard={selectedBoard} onSelectedBoard={setSelectedBoard}/>
              <BoardControls 
                onSearch={handleSearch}
                selectedSearchType={searchType}
                onSelectSearchType={setSearchType}
              />
              {/* Q&A 게시판(ID=3)일 때만 QAChatGPT 컴포넌트 표시 */}
              <QAChatGPT boardId={selectedBoard} />
            </div>
          } />

          <Route path="/boards/:BRD_id/posts/:PST_id" element={<PostDetailPage currentUser={currentUser} />} />

          <Route path="/write" element={currentUser?.isLoggedIn 
            ? <PostWritePage currentUser={currentUser} /> 
            : <LoginPage onLogin={handleLogin} />} 
=======
          <Route
            path="/"
            element={
              <div>
                <BoardTypeSelector
                  selectedBoard={selectedBoard}
                  onSelectedBoard={setSelectedBoard}
                />
                <BoardControls />
              </div>
            }
>>>>>>> e5bc4f91a15caed096135e1c9c5491a5b5ca2689
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