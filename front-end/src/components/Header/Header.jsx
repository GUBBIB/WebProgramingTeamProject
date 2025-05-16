import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
// Header.jsx
const Header = ({ currentUser, onLogout }) => {
  const isLoggedIn = currentUser?.isLoggedIn;

  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/">아팠찌</Link>
      </div>
      <nav className="auth-buttons">
        {isLoggedIn ? (
          <button onClick={onLogout}>로그아웃</button>
        ) : (
          <>
            <Link to="/login"><button>로그인</button></Link>
            <Link to="/signup"><button>회원가입</button></Link>
          </>
        )}
      </nav>
    </header>
  );
};


export default Header;

