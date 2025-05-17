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

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.USR_nickname) {
          setCurrentUser(
            { 
              username: user.USR_nickname, 
              isLoggedIn: true, 
              details: user 
            });
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (username, userDetails) => {
    setCurrentUser({ 
      username, 
      isLoggedIn: 
      true, 
      details: userDetails });
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
