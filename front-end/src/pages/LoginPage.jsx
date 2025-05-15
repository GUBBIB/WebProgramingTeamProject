import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import { loginUser } from '../services/api'; // Import loginUser from api.js

// API_BASE_URL is now managed within api.js, so it's removed from here.

const LoginPage = ({ onLogin }) => {
  const [USR_email, setEmail] = useState('');
  const [USR_pass, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    setError('');
    if (!USR_email.trim() || !USR_pass.trim()) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // Use loginUser from api.js
      const data = await loginUser({ 
        USR_email: USR_email, 
        USR_pass: USR_pass 
      });

      // Assuming the backend now relies on session/cookies for auth after login
      // and returns user information directly.
      // The loginUser function in api.js will throw an error if response is not ok.
      if (data.user && data.user.USR_nickname) { 
        // localStorage.removeItem('authToken'); // Ensure any old token is removed if this logic was ever present
        localStorage.setItem('currentUser', JSON.stringify(data.user)); // Store user details
        onLogin(data.user.USR_nickname, data.user); // Pass username and full user object to App.jsx
        alert('로그인 되었습니다.');
        navigate('/'); 
      } else {
        // This case might indicate a successful HTTP response but unexpected data structure
        setError(data.message || '로그인에 성공했으나, 사용자 정보를 받지 못했습니다.');
      }
    } catch (err) { // Catch error thrown by fetchApi in api.js
      console.error('로그인 API 호출 오류:', err.message);
      setError(err.data?.message || err.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">로그인</h1>
      {error && <p className="error-message">{error.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
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
          <button type="button" onClick={handleLoginClick} className="submit-button">로그인</button>
        </div>
        <div className="signup-link">
          <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

