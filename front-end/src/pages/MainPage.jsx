import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import BoardTypeSelector from "../components/Board/BoardTypeSelector";
import BoardControls from "../components/Board/BoardControls";
import PostDetailPage from "./PostDetailPage";
import PostWritePage from "./PostWritePage";
import ProfilePage from "../pages/ProfilePage"


const MainPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchType, setSearchType] = useState("title");
  const [searchedPosts, setSearchedPosts] = useState(null); // 🔧 (변경됨)
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/user", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("사용자 정보 불러오기 실패");

      const data = await response.json();
      setCurrentUser(data);
    } catch (err) {
      console.error("로그인된 사용자 없음");
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleSearch = async (term, type) => {
    console.log(`🔍 검색어: ${term}, 종류: ${type}`);
    try {
      const response = await fetch(
        `/api/posts/search?term=${encodeURIComponent(term)}&type=${type}&BRD_id=${selectedBoard}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("검색 실패");
      const data = await response.json();
      setSearchedPosts(data); // 🔧 (변경됨)
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchedPosts([]); // 오류 발생 시 빈 배열로 초기화
    }
  };

  return (
    <div>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <BoardTypeSelector
                  selectedBoard={selectedBoard}
                  onSelectedBoard={(brdId) => {
                    setSelectedBoard(brdId);
                    setSearchedPosts(null); // 🔧 (변경됨) 게시판 변경 시 검색 초기화
                  }}
                  searchedPosts={searchedPosts} // 🔧 (변경됨)
                />
                <BoardControls
                  onSearch={handleSearch}
                  selectedSearchType={searchType}
                  onSelectSearchType={setSearchType}
                />
              </div>
            }
          />
          <Route path="/mypage" element={<ProfilePage />} /> {/* (변경됨) */}
          <Route path="/boards/:boardId/posts/:postId" element={<PostDetailPage />} />
          <Route path="/boards/:boardId/write" element={<PostWritePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
