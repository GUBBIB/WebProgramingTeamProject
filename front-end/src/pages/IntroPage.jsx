import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";
import logo from "../assets/logo.png";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/main"); // 메인 페이지로 이동
  };

  return (
    <div className="intro-container">
      <main className="intro-main">
        <div className="intro-card intro-greeting-card">
          <h2>환영합니다!</h2>
          <p>이곳은 여러분의 질문과 코드를 나눌 수 있는 공간입니다. 👨‍💻💬</p>
          <p>질문하고, 배움 나누고, 자유롭게 소통하세요.</p>
        </div>

        <div className="intro-card-group">
          <div className="intro-card">
            <h3>🧠 코드 게시판</h3>
            <p>코드 리뷰, 공유, 리팩토링 팁을 나눠보세요.</p>
          </div>
          <div className="intro-card">
            <h3>❓ 질문 게시판</h3>
            <p>막히는 문제? 언제든 질문하고 답변을 받아보세요.</p>
          </div>
          <div className="intro-card">
            <h3>💬 자유 게시판</h3>
            <p>코딩 외에도 하고 싶은 이야기를 자유롭게!</p>
          </div>
        </div>

        <button className="intro-button" onClick={handleStartClick}>
          질문하러 가기 →
        </button>
      </main>
    </div>
  );
};

export default IntroPage;
