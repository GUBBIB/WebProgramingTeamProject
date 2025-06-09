import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

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
      const res = await fetch('/ai-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code, situation }),
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
    <div className="p-4 space-y-4">
      <textarea
        placeholder="언어 (예: java)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border w-full p-2"
      />
      <textarea
        placeholder="코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border w-full p-2 h-32"
      />
      <textarea
        placeholder="상황 설명"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        className="border w-full p-2"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'GPT에 질문 중...' : 'GPT에 질문하기'}
      </button>

      <div className="border border-black p-4 min-h-[100px]">
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
