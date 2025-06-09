import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './GPTCodeHelper.css';

const GPTCodeHelper = () => {
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [situation, setSituation] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMarkdownText('');

    try {
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "language": language, 
          "code": code, 
          "situation": situation
        }),
      });

      const json = await res.json();
      const content = json?.result?.choices?.[0]?.message?.content;

      if (content) {
        setMarkdownText(content); // 🔥 이미 디코딩된 마크다운
      } else {
        setMarkdownText('⚠️ AI 응답 없음 또는 이상한 응답 구조입니다.');
      }
    } catch (err) {
      console.error('API 호출 오류:', err);
      setMarkdownText('❌ 오류가 발생했습니다.');
    }

    setLoading(false);
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
        placeholder="상황 설명"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        className="gpt-helper-textarea"
      />
      <button
        onClick={handleSubmit}
        className="gpt-helper-button"
        disabled={loading}
      >
        {loading ? 'GPT에 질문 중...' : 'GPT에 질문하기'}
      </button>

      <div className="gpt-helper-result">
        {markdownText ? (
          <MDEditor.Markdown
            source={markdownText}
            style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
          />
        ) : (
          <div className="text-gray-400">AI 응답 없음</div>
        )}
      </div>
    </div>
  );
};

export default GPTCodeHelper;
