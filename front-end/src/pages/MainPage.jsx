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
// Import API functions from api.js
import { fetchAllPosts, fetchBoardPosts } from './services/api'; 

// API_BASE_URL is now managed within api.js, so it's removed from here.


const MainPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Token usage is removed, rely on currentUser from localStorage
    // localStorage.removeItem('authToken'); // Ensure any old tokens are cleared if logic changes
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Ensure the structure matches what LoginPage sets: { USR_nickname: ..., ... }
        if (user && user.USR_nickname) {
            setCurrentUser({ username: user.USR_nickname, isLoggedIn: true, details: user });
        } else {
            localStorage.removeItem('currentUser'); // Clear invalid stored user data
        }
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (username, userDetails) => {
    setCurrentUser({ username: username, isLoggedIn: true, details: userDetails });
    // LoginPage handles navigation
  };

  const handleSignupSuccess = (username) => {
    // SignupPage navigates to login, no direct state change here needed for currentUser
  };

  const handleLogout = () => {
    // localStorage.removeItem('authToken'); // Token removal already handled or not used
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  const MainPageContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState('all'); 
    const [selectedSearchType, setSelectedSearchType] = useState('title'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const postsPerPage = 8; // This might be dictated by API or can be a client-side preference if API supports limit

    const loadPosts = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data;
        if (selectedBoard === 'all') {
          data = await fetchAllPosts(currentPage, searchTerm, selectedSearchType);
        } else {
          data = await fetchBoardPosts(selectedBoard, currentPage, searchTerm, selectedSearchType);
        }
        setPosts(data.data || []);
        setTotalPages(data.meta?.last_page || Math.ceil((data.total || data.data?.length || 0) / postsPerPage));
        if (data.data?.length === 0 && currentPage > 1) {
            setCurrentPage(1); // Reset to page 1 if current page has no data (and not already page 1)
        }
      } catch (e) {
        console.error("Error fetching posts:", e.message);
        setError(e.message || '게시글 목록을 불러오는데 실패했습니다.');
        setPosts([]);
        setTotalPages(0);
      }
      setIsLoading(false);
    }, [selectedBoard, currentPage, searchTerm, selectedSearchType]);

    useEffect(() => {
      loadPosts();
    }, [loadPosts]); // Dependency array includes loadPosts which has its own dependencies

    const handleSelectHeaderBoard = (boardId) => {
      setSelectedBoard(boardId);
      setSearchTerm(''); 
      setCurrentPage(1);
      // loadPosts will be called by useEffect due to state change
    };

    const handleSetSearchType = (type) => {
      setSelectedSearchType(type);
    };

    const handleSearch = (term, searchType) => {
      setSearchTerm(term.toLowerCase());
      setSelectedSearchType(searchType); 
      setCurrentPage(1);
      // loadPosts will be called by useEffect due to state change
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
          {/* Pass userDetails to onLogin in LoginPage */}
          <Route path="/login" element={<LoginPage onLogin={(username, userDetails) => handleLogin(username, userDetails)} />} /> 
        </Routes>
      </main>
    </>
  );
};

export default MainPage;

