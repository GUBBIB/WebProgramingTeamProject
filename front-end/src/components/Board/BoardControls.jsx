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
import axios from "axios"; // axios 임포트 추가

const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [field, setField] = useState('title');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    console.log("로그인 성공:", user);
    setCurrentUser({
      USR_id: user.USR_id,
      isLoggedIn: true,
      details: user,
    });
  };

  // 회원가입 성공 시 호출
  const handleRegister = (user) => {
    console.log("회원가입 성공:", user);
    setCurrentUser({
      USR_id: user.USR_id,
      isLoggedIn: true,
      details: user,
    });
    navigate("/"); // 회원가입 후 메인 페이지로 이동
  };

  // 로그아웃
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setCurrentUser(null);
  };

  // 키워드 입력 변경 처리
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  // 검색 필드 변경 처리
  const handleFieldChange = (e) => {
    setField(e.target.value);
  };

  // 검색 실행 - axios 사용으로 변경
  const handleSearch = async () => {
    // 유효성 검사
    if (!keyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // axios를 사용하여 API 호출
      const response = await axios.get('/api/posts/search', {
        params: {
          field: field,
          keyword: keyword
        }
      });

      // 응답 데이터 처리
      setResults(response.data.results || []);
    } catch (err) {
      console.error('검색 오류:', err);
      setError(err.response?.data?.message || '서버 오류가 발생했습니다.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 결과 항목 클릭 핸들러
  const handleResultClick = (boardId, postId) => {
    navigate(`/boards/${boardId}/posts/${postId}`);
  };

  return (
    <div>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-page-container">
                <BoardTypeSelector
                  selectedBoard={selectedBoard}
                  onSelectedBoard={setSelectedBoard}
                />
                <BoardControls />

                {/* 검색 기능 UI */}
                <div className="search-container">
                  <div className="search-bar">
                    <select 
                      value={field} 
                      onChange={handleFieldChange}
                      className="search-select"
                    >
                      <option value="title">제목</option>
                      <option value="user">작성자</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder={`${field === 'title' ? '제목' : '작성자'}으로 검색...`}
                      value={keyword}
                      onChange={handleKeywordChange}
                      onKeyPress={handleKeyPress}
                      className="search-input"
                    />
                    
                    <button 
                      onClick={handleSearch}
                      className="search-button"
                      disabled={isLoading || !keyword.trim()}
                    >
                      {isLoading ? '검색 중...' : '검색'}
                    </button>
                  </div>
                
                  {/* 오류 메시지 */}
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>
                
                {/* 검색 결과 */}
                {results.length > 0 && (
                  <div className="search-results">
                    <h3>검색 결과 ({results.length}건)</h3>
                    <div className="results-container">
                      {results.map((post) => (
                        <div 
                          key={post.PST_id || post.id} 
                          className="search-result-item"
                          onClick={() => handleResultClick(post.BRD_id, post.PST_id)}
                        >
                          <h4>{post.title}</h4>
                          {post.content && (
                            <p className="post-content">{post.content}</p>
                          )}
                          <div className="post-meta">
                            <span>{post.author || post.username || '익명'}</span>
                            {post.created_at && (
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 검색 결과가 없을 때 메시지 표시 */}
                {!isLoading && results.length === 0 && keyword.trim() && !error && (
                  <div className="no-results">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            }
          />

          <Route
            path="/boards/:BRD_id/posts/:PST_id"
            element={<PostDetailPage currentUser={currentUser} />}
          />

          {/* ✅ 게시글 작성 */}
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

          {/* ✅ 게시글 수정 (PST_id 존재 시 수정 모드로 PostWritePage 재사용) */}
          <Route
            path="/boards/:BRD_id/posts/:PST_id/edit"
            element={
              currentUser?.isLoggedIn ? (
                <PostWritePage currentUser={currentUser} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          {/* ✅ 회원가입 시 handleRegister 전달 */}
          <Route path="/signup" element={<SignupPage onRegister={handleRegister} />} />

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