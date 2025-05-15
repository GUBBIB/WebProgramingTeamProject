import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // CSS 파일 임포트

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    console.log("handleSubmit 실행");
    event.preventDefault();
    
    const res = await fetch("http://13.60.93.77/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        USR_email: email,
        USR_pass: password,
      }),
      credentials: "include" // 세션 쿠키 저장 필요 시 추가
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ 로그인 성공", data);
      if (onLogin) {
        onLogin(data.user);
      }
      navigate('/'); 
    } else {
      console.log("❌ 로그인 실패", data.message);
    }

  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">로그인</h1>
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
        <div className="form-actions">
          <button type="submit" className="submit-button" onClick={handleSubmit}>로그인</button>
        </div>
        <div className="signup-link">
          <p>계정이 없으신가요? <a href="/signup">회원가입</a></p>
        </div>
    </div>
  );
};

export default LoginPage;

