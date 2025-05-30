import React, { useState } from "react";
import "./introPage.css";

const IntroPage = () => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleGoToBoard = () => {
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 300);
    console.log("게시글 작성하러 가기");
  };

  return (
    <div className="intro-container">
      <div className="intro-inner">
        {/* 로고와 인사말 */}
        <div className="intro-header">
          <div className="intro-logo-box">
            <img 
              src="..\Header\image\apatcche.png" 
              alt="Apppatche Logo" 
              className="intro-logo"
            />
          </div>

          <div className="intro-greeting-box">
            <p className="intro-title">
              안녕하세요! 아팠찌 커뮤니티에 오신 것을 환영합니다 
            </p>
            <p className="intro-subtitle">
              모르는 코드에 대해서 질문하고 자유롭게 대화하는 공간입니다.
            </p>
          </div>
        </div>

        {/* 게시판 소개 카드 */}
        <div className="intro-cards">
          <div className="intro-card pink">
            <h3 className="card-title">질문 게시판</h3>
            <p className="card-text">
              어떤 질문이든 자유롭게 <br/>
              게시물을 올려주세요<br/>
              서로 모르는 궁금증을<br/>
              함께 해결해 나가보아요
            </p>
          </div>

          <div className="intro-card rose">
            <h3 className="card-title">코드 게시판</h3>
            <p className="card-text">
              개발자들의 코드 질문<br/>
              마크다운 형식의 게시물로<br/>
              좋은 코드 공유하면서<br/>
              게시물을 올려보세요!
            </p>
          </div>

          <div className="intro-card pink-rose">
            <h3 className="card-title">자유 게시판</h3>
            <p className="card-text">
              일상 이야기, 취미 공유<br/>
              맛집 추천까지!<br/>
              자유로운 주제로 편하게<br/>
              대화해보세요
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="intro-button-wrap">
          <button 
            onClick={handleGoToBoard}
            className={`intro-button ${buttonClicked ? "clicked" : ""}`}
          >
            게시글 작성하러 가기
          </button>
          <p className="intro-button-sub">
            지금 바로 작성하러 가려면 클릭😁
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
