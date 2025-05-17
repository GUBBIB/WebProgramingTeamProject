import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';

const API_BASE_URL = 'http://13.60.93.77/api';

const SignupPage = ({ onRegister }) => {
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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ USR_email, USR_pass, USR_nickname }),
      });

      if (!res.ok) throw new Error('회원가입 실패');
      const data = await res.json();
      onRegister(data.user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-page-container">
      <h1 className="page-title">회원가입</h1>
      {error && (
        <p className="error-message">
          {error.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
        </p>
      )}
      <div className="signup-form">
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
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
          <button type="button" onClick={handleSignupClick} className="submit-button">
            가입하기
          </button>
        </div>
        <div className="login-link">
          <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
