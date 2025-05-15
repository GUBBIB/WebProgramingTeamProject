import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const API_BASE_URL = 'http://13.60.93.77/api'; 

const LoginPage = ({ onLogin }) => {
  const [USR_email, setEmail] = useState('');
  const [USR_pass, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ 
          USR_email,
          USR_pass
        }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.user.USR_nickname) {
        onLogin(data.user.USR_nickname);
        alert('로그인 성공!');
        navigate('/'); 
      } else {
        setError(data.message || '로그인 실패');
      }

    } catch (error) {
      console.error('로그인 오류:', error);
      setError('서버와의 통신에 실패했습니다.');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">로그인</h1>
      {error && (
        <p className="error-message">
          {error.split('\n').map((line, i) => (
            <span key={i}>{line}<br/></span>
          ))}
        </p>
      )}
      <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" className="submit-button">로그인</button>
        </div>
        <div className="signup-link">
          <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
