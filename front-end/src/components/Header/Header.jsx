import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const isLoggedIn = false; // 현재는 예시로 로그인 상태가 아니라고 가정합니다.

  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/">MyBoard</Link>
      </div>
      <nav className="auth-buttons">
        {isLoggedIn ? (
          <button>로그아웃</button>
        ) : (
          <>
            <Link to="/login"> {/* 로그인 버튼을 Link로 변경 */}
              <button>로그인</button>
            </Link>
            <Link to="/signup">
              <button>회원가입</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

