import React from 'react';
import './Header.css';

const Header = () => {
  // 로그인 상태에 따라 로그인/로그아웃 버튼을 다르게 보여줄 수 있습니다.
  // 현재는 예시로 로그인 상태가 아니라고 가정합니다.
  const isLoggedIn = false;

  return (
    <header className="header-container">
      <div className="logo">
        {/* 로고 이미지를 사용하거나 텍스트 로고를 사용할 수 있습니다. */}
        <a href="/">MyBoard</a>
      </div>
      <nav className="auth-buttons">
        {isLoggedIn ? (
          <button>로그아웃</button>
        ) : (
          <>
            <button>로그인</button>
            {/* 회원가입 버튼이 필요하다면 추가할 수 있습니다. */}
            {/* <button>회원가입</button> */}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
