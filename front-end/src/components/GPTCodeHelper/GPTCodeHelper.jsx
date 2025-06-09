import React, { useState } from 'react';
import './GPTCodeHelper.css';

function GPTCodeHelper() {
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [situation, setSituation] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          situation,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        const reply = data.result?.choices?.[0]?.message?.content ?? '응답이 없습니다.';
        setResult(reply);
      } else {
        setResult('GPT 응답 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setResult('요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gpt-helper-container">
      <input
        type="text"
        placeholder="언어 입력 (예: java, python)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="gpt-helper-input"
      />
      <textarea
        placeholder="코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="gpt-helper-textarea"
      />
      <textarea
        placeholder="현재 상황 입력 (예: 왜 결과가 이렇게 나오나요?)"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        className="gpt-helper-textarea"
      />
      <button
        onClick={handleSubmit}
        className="gpt-helper-button"
        disabled={loading}
      >
        {loading ? 'GPT에게 요청 중...' : 'GPT에 질문하기'}
      </button>
      <div className="gpt-helper-result">
        {result || 'GPT가 마크다운 형식으로 코드 리뷰를 알려줍니다.'}
      </div>
    </div>
  );
}

export default GPTCodeHelper;
