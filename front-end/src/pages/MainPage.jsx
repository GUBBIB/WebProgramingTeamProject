import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import PostDetailPage from './PostDetailPage';
import PostWritePage from './PostWritePage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import './MainPage.css';

const MainPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.USR_nickname) {
          setCurrentUser({ username: user.USR_nickname, isLoggedIn: true, details: user });
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (username, userDetails) => {
    setCurrentUser({ username, isLoggedIn: true, details: userDetails });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="app-main-content">
        <Routes>
          {/* 홈 경로는 현재 아무 것도 렌더링하지 않음 */}
          <Route path="index" element={<div>홈 화면을 구성하세요</div>} />
          
          <Route path="/boards/:BRD_id/posts/:PST_id" element={<PostDetailPage currentUser={currentUser} />} />

          <Route path="/write" element={currentUser?.isLoggedIn 
          ? <PostWritePage currentUser={currentUser} /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </main>
    </>
  );
};

export default MainPage;
