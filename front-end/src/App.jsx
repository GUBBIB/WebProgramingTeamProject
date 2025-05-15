import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import BoardTypeSelector from './components/Board/BoardTypeSelector';
import PostList from './components/Post/PostList';
import Pagination from './components/Board/Pagination';
import BoardControls from './components/Board/BoardControls';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import './pages/MainPage.css';

// --- Mock Data --- (API 연동 전 임시 데이터)
const initialPosts = [
  { id: '1', title: '리액트 질문입니다!', author: '개발자A', createdAt: '2024-05-10T10:00:00Z', views: 150, boardType: 'qna', content: '리액트에서 상태 관리는 어떻게 하는게 좋을까요? Redux, Zustand, Context API 등 선택지가 많네요.' },
  { id: '2', title: '자바스크립트 클로저 심층 분석', author: '코딩마스터', createdAt: '2024-05-09T14:30:00Z', views: 250, boardType: 'code', content: '클로저는 자바스크립트의 강력한 기능 중 하나입니다. 이 글에서는 클로저의 동작 원리와 활용법을 자세히 다룹니다.' },
  { id: '3', title: '오늘 날씨가 너무 좋네요!', author: '날씨요정', createdAt: '2024-05-11T09:00:00Z', views: 80, boardType: 'free', content: '다들 주말 계획 있으신가요? 저는 공원에 피크닉 가려구요!' },
  // ... (기존 게시물 데이터 유지)
];

const headerBoardTypes = [
  { id: 'all', name: '전체' },
  { id: 'code', name: '코드 게시판' },
  { id: 'free', name: '자유 게시판' },
  { id: 'qna', name: '질문 게시판' },
];

const boardTypesForSearchDropdown = [
  { id: 'all', name: '전체에서 검색' },
  { id: 'code', name: '코드 게시판에서 검색' },
  { id: 'free', name: '자유 게시판에서 검색' },
  { id: 'qna', name: '질문 게시판에서 검색' },
];
// --- End Mock Data ---

const App = () => {
  const [currentUser, setCurrentUser] = useState(null); // { username: '유저명', isLoggedIn: true } 또는 null
  const [allPosts, setAllPosts] = useState(initialPosts);
  const navigate = useNavigate();

  // (가상) 로그인 처리 함수
  const handleLogin = (username) => {
    setCurrentUser({ username: username, isLoggedIn: true });
    // 실제 앱에서는 API 호출 후 토큰 등을 저장
    navigate('/'); // 로그인 후 메인 페이지로 이동
  };

  // (가상) 회원가입 성공 처리 함수 (회원가입 후 자동 로그인)
  const handleSignupSuccess = (username) => {
    setCurrentUser({ username: username, isLoggedIn: true });
    // 실제 앱에서는 API 호출 후 사용자 정보 저장 및 자동 로그인 처리
    navigate('/'); // 회원가입 및 자동 로그인 후 메인 페이지로 이동
  };

  // (가상) 로그아웃 처리 함수
  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  // 새 게시물 추가 함수 (PostWritePage에서 사용)
  const addNewPost = (newPostData) => {
    const newPost = {
      ...newPostData,
      id: String(Date.now()), // 임시 ID
      author: currentUser ? currentUser.username : '익명', // 작성자는 현재 로그인된 사용자 또는 익명
      createdAt: new Date().toISOString(),
      views: 0,
    };
    setAllPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const MainPageContent = () => {
    const [selectedBoard, setSelectedBoard] = useState('all');
    const [searchScope, setSearchScope] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    const handleSelectHeaderBoard = (boardId) => {
      setSelectedBoard(boardId);
      setSearchTerm('');
      setCurrentPage(1);
    };

    const handleSetSearchScope = (scopeId) => {
      setSearchScope(scopeId);
    };

    const handleSearch = (term) => {
      setSearchTerm(term.toLowerCase());
      setCurrentPage(1);
    };

    const filteredPosts = allPosts.filter(post => {
      const mainBoardFilter = selectedBoard === 'all' || post.boardType === selectedBoard;
      if (!mainBoardFilter) return false;
      if (searchTerm) {
        const searchScopeFilter = searchScope === 'all' || post.boardType === searchScope;
        const titleFilter = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        return searchScopeFilter && titleFilter;
      }
      return true;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
      <div className="main-page-container">
        <BoardTypeSelector 
          boardTypes={headerBoardTypes} 
          selectedBoard={selectedBoard} 
          onSelectBoard={handleSelectHeaderBoard} 
        />
        <PostList posts={currentPosts} />
        {totalPages > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
        <BoardControls 
          onSearch={handleSearch} 
          boardTypesForDropdown={boardTypesForSearchDropdown}
          selectedSearchScope={searchScope}
          onSelectSearchScope={handleSetSearchScope}
          isLoggedIn={currentUser?.isLoggedIn || false} // 로그인 상태 전달
        />
      </div>
    );
  };

  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<MainPageContent />} />
          <Route 
            path="/post/:postId" 
            element={<PostDetailPage currentUser={currentUser} />} 
          />
          <Route 
            path="/write" 
            element={currentUser?.isLoggedIn ? <PostWritePage addNewPost={addNewPost} currentUser={currentUser} /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route path="/signup" element={<SignupPage onSignupSuccess={handleSignupSuccess} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;

