import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const API_BASE_URL = 'http://13.60.93.77/api';

const LoginPage = ({ onLogin }) => {
  const [USR_email, setEmail] = useState('');
  const [USR_pass, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError('');
    if (!USR_email.trim() || !USR_pass.trim()) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          USR_email, 
          USR_pass }),
      });

      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();
      onLogin(data.user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">로그인</h1>
      {error && (
        <p className="error-message">
          {error.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
      )}
      <div className="login-form">
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
        <div className="form-actions">
          <button type="button" onClick={handleLoginClick} className="submit-button">
            로그인
          </button>
        </div>
        <div className="signup-link">
          <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
