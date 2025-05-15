import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';

const API_BASE_URL = 'http://13.60.93.77/api'; // ✅ 실제 서버 주소 사용

const SignupPage = ({ onSignupSuccess }) => {
  const [USR_nickname, setNickname] = useState('');
  const [USR_email, setEmail] = useState('');
  const [USR_pass, setPassword] = useState('');
  const [USR_pass_confirmation, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (USR_pass !== USR_pass_confirmation) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // ✅ Laravel 세션 쿠키 저장
        body: JSON.stringify({
          USR_nickname,
          USR_email,
          USR_pass,
          USR_pass_confirmation
        }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        alert('회원가입이 완료되었습니다.');
        if (onSignupSuccess) {
          onSignupSuccess(data.user.USR_nickname); // 또는 data.user
        }
        navigate('/login'); // ✅ 로그인 페이지로 이동
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setError(errorMessages);
        } else {
          setError(data.message || '회원가입에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      setError('회원가입 중 네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-page-container">
      <h1 className="page-title">회원가입</h1>
      {error && <p className="error-message">{error.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
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
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={USR_email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
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
          <button type="submit" className="submit-button">가입하기</button>
        </div>
        <div className="login-link">
          <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
