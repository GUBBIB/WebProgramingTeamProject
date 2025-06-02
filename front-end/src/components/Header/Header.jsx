import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 간 이동을 위한 Link 사용
import './Header.css'; // 헤더 스타일링

// Header 컴포넌트는 로그인 여부에 따라 다른 메뉴를 보여줌
const Header = ({ currentUser, onLogout }) => {
  const isLoggedIn = currentUser?.isLoggedIn; // 로그인 여부 판단

  return (
    <header className="header-container"> {/* 헤더 전체 컨테이너 */}
      <div className="logo"> {/* 로고 이미지 클릭 시 메인 페이지 이동 */}
        <Link to="/">
          <img src="./apatcche.png" alt="아팟찌 로고" className="logo-image" />
        </Link>
      </div>

      <nav className="auth-buttons"> {/* 로그인/회원가입 또는 로그아웃/회원정보 버튼 영역 */}
        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <button>회원정보</button>
            </Link>
            <button onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">
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
