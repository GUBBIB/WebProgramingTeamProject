import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntroPage from "./pages/IntroPage";
import MainPage from "./pages/MainPage";
import GPTCodeHelper from "./components/GPTCodeHelper/GPTCodeHelper";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/ai-review" element={<GPTCodeHelper />} />
          <Route
            path="/"
            element={
              <div>
                <BoardTypeSelector
                  selectedBoard={selectedBoard}
                  onSelectedBoard={setSelectedBoard}
                  searchedPosts={searchedPosts}
                  pagination={pagination}
                  setPagination={setPagination}
                />
                <BoardControls
                  onSearch={handleSearch} // (추가됨)
                />
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

          <Route
            path="/ai-review"
            element={
              <GPTCodeHelper />
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
          <Route
            path="/signup"
            element={<SignupPage onRegister={handleRegister} />}
          />

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
    </BrowserRouter>
  </React.StrictMode>
);
