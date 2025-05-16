import React, { useState } from 'react';
import './QAChatGPT.css';

const QAChatGPT = ({ boardId }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  
  // API 키는 환경 변수에서 가져오거나 서버 측에서 처리하는 것이 이상적입니다
  // 클라이언트에서 직접 API 키를 사용하는 것은 보안상 위험합니다
  // 실제 구현 시에는 백엔드를 통해 요청을 프록시하는 것이 좋습니다
  
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 실제 구현에서는 이 요청이 서버 측으로 가야 합니다
      // const response = await fetch('/api/ask-openai', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ question })
      // });
      
      // 프론트엔드에서 직접 OpenAI API를 호출하는 예시 (보안상 권장하지 않음)
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY` // 실제 구현에서는 절대 클라이언트 측에 노출하면 안 됨
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: '당신은 질문게시판의 도우미입니다. 질문에 간결하고 정확하게 답변해주세요.' },
            { role: 'user', content: question }
          ],
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error('OpenAI API 요청 실패');
      }
      
      const data = await response.json();
      setAnswer(data.choices[0].message.content);
      
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