import React, { useState, useEffect, useCallback } from 'react';
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

const API_BASE_URL = 'http://localhost:8000/api';

const headerBoardTypes = [
  { BRD_id: 'all', BRD_name: '전체' }, // 'all'을 백엔드에서 모든 게시물을 의미하는 특별한 ID로 처리하거나, 프론트에서 별도 로직 필요
  { BRD_id: 'code', BRD_name: '코드 게시판' },
  { BRD_id: 'free', BRD_name: '자유 게시판' },
  { BRD_id: 'qna', BRD_name: '질문 게시판' },
];

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setCurrentUser({
      id: user.USR_id,
      email: user.USR_email,
      nickname: user.USR_nickname,
      isLoggedIn: true
    });
  };

  const handleSignupSuccess = (username) => {
    // SignupPage에서 로그인 페이지로 이동시키므로, 별도 처리는 불필요하거나 로그인과 동일하게 처리
    // setCurrentUser({ username: username, isLoggedIn: true }); 
    // navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  const MainPageContent = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState('all'); 
    const [selectedSearchType, setSelectedSearchType] = useState('title'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const postsPerPage = 8; // 이 값은 API 페이징과 일치하거나, API가 반환하는 값 사용

    const fetchPosts = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      
      // 'all' 게시판에 대한 특별한 API 엔드포인트 처리
      let url;
      if (selectedBoard === 'all') {
        url = `${API_BASE_URL}/boards/all?page=${currentPage}`;
      } else {
        url = `${API_BASE_URL}/boards/${selectedBoard}?page=${currentPage}`;
      }
      
      if (searchTerm) {
        url += `&search_type=${selectedSearchType}&search_term=${encodeURIComponent(searchTerm)}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: '게시글 목록을 불러오는데 실패했습니다.' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // API 응답 구조에 따라 posts와 totalPages 설정
        setPosts(data.data || []); // data.data가 실제 게시물 배열이라고 가정
        setTotalPages(data.meta?.last_page || Math.ceil((data.total || data.data?.length || 0) / postsPerPage));
        
        if (data.data?.length === 0 && currentPage > 1) { // 데이터가 없는데 현재 페이지가 1보다 크면 1페이지로
            setCurrentPage(1);
        }
      } catch (e) {
        console.error("Error fetching posts:", e);
        setError(e.message);
        setPosts([]);
        setTotalPages(0);
      }
      setIsLoading(false);
    }, [selectedBoard, currentPage, searchTerm, selectedSearchType]);

    useEffect(() => {
      fetchPosts();
    }, [fetchPosts]);

    const handleSelectHeaderBoard = (boardId) => {
      setSelectedBoard(boardId);
      setSearchTerm(''); 
      setCurrentPage(1);
      // fetchPosts는 useEffect에 의해 호출됨
    };

    const handleSetSearchType = (type) => {
      setSelectedSearchType(type);
      // 검색 타입 변경 시 바로 검색 실행은 하지 않고, 검색 버튼 클릭 시 실행
    };

    const handleSearch = (term, searchType) => {
      setSearchTerm(term.toLowerCase());
      setSelectedSearchType(searchType); 
      setCurrentPage(1);
      // fetchPosts는 useEffect에 의해 호출됨
    };

    return (
      <div className="main-page-container">
        <BoardTypeSelector 
          boardTypes={headerBoardTypes} 
          selectedBoard={selectedBoard} 
          onSelectBoard={handleSelectHeaderBoard} 
        />
        {isLoading && <p>로딩 중...</p>}
        {error && <p className="error-message">오류: {error}</p>}
        {!isLoading && !error && posts.length === 0 && <p>게시글이 없습니다.</p>}
        {!isLoading && !error && posts.length > 0 && <PostList posts={posts} />}
        {totalPages > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
        <BoardControls 
          onSearch={handleSearch} 
          selectedSearchType={selectedSearchType} 
          onSelectSearchType={handleSetSearchType} 
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
            element={currentUser?.isLoggedIn ? <PostWritePage currentUser={currentUser} /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route path="/signup" element={<SignupPage onSignupSuccess={handleSignupSuccess} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
