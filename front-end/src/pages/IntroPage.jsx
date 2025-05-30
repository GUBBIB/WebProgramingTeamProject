import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleGoToBoard = () => {
    navigate("/board");
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1 className="intro-title">게시판 서비스에 오신 것을 환영합니다</h1>
        <div className="intro-description">
          <p>
            이 웹사이트는 다양한 주제에 대한 의견과 정보를 공유할 수 있는 
            커뮤니티 게시판 서비스입니다.
          </p>
          <p>
            회원가입 후 로그인하시면 게시물 작성, 댓글 달기 등 
            다양한 기능을 이용하실 수 있습니다.
          </p>
          <p>
            아래 버튼을 클릭하여 게시판으로 이동해 보세요!
          </p>
        </div>
        <button 
          className="intro-button" 
          onClick={handleGoToBoard}
        >
          게시물 작성하러 가기
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
