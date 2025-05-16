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

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchType, setSearchType] = useState('title'); // 검색 유형 상태 추가
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
              {/* Q&A 게시판(ID=3)일 때만 QAChatGPT 컴포넌트 표시 */}
              <QAChatGPT boardId={selectedBoard} />
            </div>
          } />

          <Route path="/boards/:BRD_id/posts/:PST_id" element={<PostDetailPage currentUser={currentUser} />} />

          <Route path="/write" element={currentUser?.isLoggedIn 
            ? <PostWritePage currentUser={currentUser} /> 
            : <LoginPage onLogin={handleLogin} />} 
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;