import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 간 이동을 위한 Link 사용
import './Header.css'; // 헤더 스타일링
import logo from '../../assets/logo.png'; 

// Header 컴포넌트는 로그인 여부에 따라 다른 메뉴를 보여줌
const Header = ({ currentUser, onLogout }) => {
  const isLoggedIn = currentUser?.isLoggedIn; // 로그인 여부 판단

  return (
    <header className="header-container"> {/* 헤더 전체 컨테이너 */}
      <div className="logo"> {/* 로고 및 메인 페이지 이동 */}
        <Link to="/main">
        <img src={logo} alt="로고" className="logo-image" />
        </Link>
      </div>

      <nav className="auth-buttons"> {/* 로그인/회원가입 또는 로그아웃/회원정보 버튼 영역 */}
        {isLoggedIn ? (
          // 로그인한 경우
          <>
            <Link to="/ai-review">
              <button>AI 리뷰 코드</button>
            </Link>

            {/* 프로필 페이지로 이동 */}
            <Link to="/profile">
              <button>회원정보</button>
            </Link>

            {/* 로그아웃 버튼 - 클릭 시 props로 전달된 onLogout 함수 실행 */}
            <button onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          // 로그인하지 않은 경우
          <>
            {/* 로그인 페이지로 이동 */}
            <Link to="/login">
              <button>로그인</button>
            </Link>

            {/* 회원가입 페이지로 이동 */}
            <Link to="/signup">
              <button>회원가입</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; // 컴포넌트 외부에서 사용 가능하게 export