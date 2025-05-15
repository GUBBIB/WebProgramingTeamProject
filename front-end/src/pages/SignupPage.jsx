import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css'; // CSS 파일 임포트 (LoginPage.css와 유사하게 만들 예정)

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: 실제 회원가입 API 연동 로직 구현 필요
    console.log('회원가입 시도:', { username, email, password });
    alert('회원가입이 완료되었습니다. (실제 API 연동 필요)');
    // 성공적으로 회원가입 후 로그인 페이지로 이동 또는 메인 페이지로 이동
    navigate('/login'); 
  };

  return (
    <div className="signup-page-container"> {/* LoginPage.css의 login-page-container와 동일한 클래스명 또는 유사한 스타일 적용 */}
      <h1 className="page-title">회원가입</h1>
      <form onSubmit={handleSubmit} className="signup-form"> {/* LoginPage.css의 login-form과 동일한 클래스명 또는 유사한 스타일 적용 */}
        <div className="form-group">
          <label htmlFor="username">사용자 이름</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="사용자 이름을 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일 주소</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="이메일 주소를 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="비밀번호를 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="비밀번호를 다시 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">가입하기</button>
        </div>
        <div className="login-link"> {/* LoginPage.css의 signup-link와 유사한 스타일 적용 */}
          <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;

