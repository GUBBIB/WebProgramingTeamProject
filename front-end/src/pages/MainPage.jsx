import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import PostDetailPage from './PostDetailPage';
import PostWritePage from './PostWritePage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import PostList from '../components/Post/PostList'
import './MainPage.css';
import BoardControls from '../components/Board/BoardControls';
import BoardTypeSelector from '../components/Board/BoardTypeSelector';

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
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
  

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-main-content">
        test
        <Routes>
          <Route path="/" element={
            <div>
              <BoardTypeSelector selectedBoard={selectedBoard} onSelectedBoard={setSelectedBoard}/>
              <BoardControls />
            </div>
            } />

          <Route path="/boards/:BRD_id/posts/:PST_id" element={<PostDetailPage currentUser={currentUser} />} />

          <Route path="/write" element={currentUser?.isLoggedIn 
          ? <PostWritePage currentUser={currentUser} /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
