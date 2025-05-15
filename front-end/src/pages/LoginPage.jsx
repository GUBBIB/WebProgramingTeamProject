import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // CSS 파일 임포트

const LoginPage = () => {
  const [USR_email, setUSR_Email] = useState('');
  const [USR_password, setUSR_Password] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const res = await fetch("/api/login", {
      method: "POST",
      HEADERS: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: USR_email,
        password: USR_password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ 로그인 성공", data);
    } else {
      console.log("❌ 로그인 실패", data.message);
    }

    navigate('/'); 
  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">로그인</h1>
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
            value={USR_password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="비밀번호를 입력하세요" 
            required 
            className="form-control"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button" onClick={handleSubmit}>로그인</button>
        </div>
        <div className="signup-link">
          <p>계정이 없으신가요? <a href="/signup">회원가입</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

