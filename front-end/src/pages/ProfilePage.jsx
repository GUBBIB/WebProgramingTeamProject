import React, { useState } from 'react';
import './ProfilePage.css'; // 필요시 별도 스타일링

const API_BASE_URL = '/api';
const ProfilePage = ({ currentUser, onProfileUpdate }) => {
    const [USR_nickname, setNickname] = useState(currentUser?.USR_nickname || '');
    const [USR_pass, setPassword] = useState('');
    const [USR_pass_confirmation, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleProfileUpdate = async () => {
        setError('');
        setSuccess('');

        if (USR_pass !== USR_pass_confirmation) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!USR_nickname.trim()) {
            setError('닉네임을 입력해주세요.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/profile/update`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    USR_nickname,
                    USR_pass,
                }),
            });

            const data = await response.json();

            if (response.ok && data.user) {
                setSuccess('회원정보가 성공적으로 수정되었습니다.');
                if (onProfileUpdate) onProfileUpdate(data.user);
            } else {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join('\n');
                    setError(errorMessages);
                } else {
                    setError(data.message || '회원정보 수정에 실패했습니다.');
                }
            }
        } catch (err) {
            console.error('회원정보 수정 오류:', err);
            setError('회원정보 수정 중 네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <div className="profile-page-container">
            <h1 className="page-title">회원정보 수정</h1>

            {error && (
                <p className="error-message">
                    {error.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                </p>
            )}

            {success && (
                <p className="success-message">{success}</p>
            )}

            <div className="profile-form">
                <div className="form-group">
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        type="text"
                        id="nickname"
                        value={USR_nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="새 닉네임을 입력하세요"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">새 비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={USR_pass}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="새 비밀번호를 입력하세요"
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
                        className="form-control"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleProfileUpdate} className="submit-button">
                        수정하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
