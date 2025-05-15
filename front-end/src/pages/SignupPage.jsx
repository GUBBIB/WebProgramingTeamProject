import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';
import { registerUser } from '../services/api'; // Import registerUser from api.js

// API_BASE_URL is now managed within api.js, so it's removed from here.

const SignupPage = ({ onSignupSuccess }) => {
  const [USR_nickname, setNickname] = useState('');
  const [USR_email, setEmail] = useState('');
  const [USR_pass, setPassword] = useState('');
  const [USR_pass_confirmation, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignupClick = async () => {
    setError('');
    if (USR_pass !== USR_pass_confirmation) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!USR_nickname.trim() || !USR_email.trim() || !USR_pass.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      // Use registerUser from api.js
      const data = await registerUser({
        USR_nickname: USR_nickname,
        USR_email: USR_email,
        USR_pass: USR_pass,
        USR_pass_confirmation: USR_pass_confirmation
      });

      // The registerUser function in api.js will throw an error if response is not ok.
      // If successful, data will be the parsed JSON response.
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      if (onSignupSuccess) {
        onSignupSuccess(USR_nickname); // Or data.user.USR_nickname if API returns it
      }
      navigate('/login');

    } catch (err) { // Catch error thrown by fetchApi in api.js
      console.error('회원가입 API 호출 오류:', err.message);
      // err.data might contain specific error messages from the backend
      setError(err.data?.message || err.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="signup-page-container">
      <h1 className="page-title">회원가입</h1>
      {error && <p className="error-message">{error.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
      <div className="signup-form">
        <div className="form-group">
          <label htmlFor="nickname">사용자 닉네임</label>
          <input
            type="text"
            id="nickname"
            value={USR_nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일 주소</label>
          <input
            type="email"
            id="email"
            value={USR_email}
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
            value={USR_pass}
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
            value={USR_pass_confirmation}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            required
            className="form-control"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleSignupClick} className="submit-button">가입하기</button>
        </div>
        <div className="login-link">
          <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

