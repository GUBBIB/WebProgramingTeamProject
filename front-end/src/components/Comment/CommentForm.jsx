import React, { useState } from 'react';
import './Comment.css';

const CommentForm = ({ onSubmitComment, currentUser }) => {
  const [commentText, setCommentText] = useState(''); // Renamed state for clarity

  const handleCommentSubmitClick = async () => { // Renamed and no event parameter
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!currentUser || !currentUser.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    // onSubmitComment is expected to be an async function from PostDetailPage.jsx
    // It should handle the API call and receive an object like { text: commentText }
    // The actual payload sent to the API (e.g., COM_content) is handled in PostDetailPage's handleAddComment
    await onSubmitComment({ text: commentText });
    setCommentText(''); // Clear input field
  };

  return (
<<<<<<< HEAD
    <div>
      {/* 작성자명 입력 필드 제거 */}
=======
    // Replaced form with div
    <div className="comment-form">
>>>>>>> feature/4
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={currentUser?.isLoggedIn ? `${currentUser.username}님, 댓글을 입력하세요...` : "댓글을 입력하려면 로그인하세요..."}
        rows="3"
        // Removed 'required' as it's a form attribute, handling validation in JS
        disabled={!currentUser?.isLoggedIn}
      />
      {/* Changed button type to button and added onClick */}
      <button 
        type="button" 
        onClick={handleCommentSubmitClick} 
        disabled={!currentUser?.isLoggedIn || !commentText.trim()}
      >
        {currentUser?.isLoggedIn ? "댓글 작성" : "로그인 후 작성 가능"}
      </button>
    </div>
  );
};

export default CommentForm;

