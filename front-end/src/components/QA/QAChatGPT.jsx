import React, { useState } from 'react';
import './QAChatGPT.css';

const QAChatGPT = ({ boardId }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const API_BASE_URL = 'http://13.60.93.77/api';
  const OPENAI_ENDPOINT = `${API_BASE_URL}/ask-openai`;
  
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 백엔드 API를 통해 OpenAI에 요청
      const response = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      if (!response.ok) {
        throw new Error('API 요청 실패');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAnswer(data.answer);
      
    } catch (err) {
      console.error('API 호출 오류:', err);
      setError('죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 질문 게시판(BRD_id === 3)인 경우에만 ChatGPT 요소를 표시
  if (boardId !== 3) {
    return null;
  }
  
  return (
    <div className="qa-chatgpt-container">
      <h3 className="qa-title">ChatGPT에게 질문하기</h3>
      <p className="qa-description">
        질문을 입력하면 AI가 답변해드립니다. 게시글을 작성하기 전에 간단히 확인해보세요!
      </p>
      
      <form onSubmit={handleQuestionSubmit} className="qa-form">
        <textarea
          className="qa-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요..."
          rows={3}
        />
        <button 
          type="submit" 
          className="qa-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '답변 생성 중...' : '질문하기'}
        </button>
      </form>
      
      {error && <p className="qa-error">{error}</p>}
      
      {answer && (
        <div className="qa-answer">
          <h4>ChatGPT 답변:</h4>
          <p>{answer}</p>
        </div>
      )}
      
      <div className="qa-disclaimer">
        <small>* AI 답변은 참고용이며 정확성을 보장하지 않습니다.</small>
      </div>
    </div>
  );
};

export default QAChatGPT;