import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

const LoginPage = ({ onLogin }) => {
  const [USR_email, setEmail] = useState(''); // State for email, matches PHP model
  const [USR_pass, setPassword] = useState(''); // State for password, matches PHP model
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
        // Body should match PHP User model's properties for login
        body: JSON.stringify({ 
          USR_email: USR_email, 
          USR_pass: USR_pass 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Expecting token and user object (with USR_id, USR_nickname, USR_email)
        if (data.token && data.user && data.user.USR_nickname) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user)); // Store the whole user object
          
          // Pass USR_nickname to onLogin handler in App.jsx
          onLogin(data.user.USR_nickname); 
          alert('로그인 되었습니다.');
          navigate('/'); 
        } else {
          setError(data.message || '로그인에 성공했으나, 사용자 정보를 받지 못했습니다.');
        }
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setError(errorMessages);
        } else {
          setError(data.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
        }
      }
    } catch (error) {
      console.error('로그인 API 호출 오류:', error);
      setError('로그인 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">로그인</h1>
      {error && <p className="error-message">{error.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
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

