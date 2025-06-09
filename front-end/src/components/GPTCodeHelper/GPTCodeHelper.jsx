import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
             'Content-Type': 'application/json' 
            },
        body: JSON.stringify({
            "language": language,
            "code": code,
            "situation": situation,
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
    <div className="max-w-4xl mx-auto p-6 border border-black space-y-4">
      <input
        type="text"
        placeholder="언어 입력 (예: java, python)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full border border-black p-2"
      />
      <textarea
        placeholder="코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border border-black p-2 h-32"
      />
      <textarea
        placeholder="현재 상황 입력 (예: 왜 결과가 이렇게 나오나요?)"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        className="w-full border border-black p-2 h-20"
      />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
        disabled={loading}
      >
        {loading ? 'GPT에게 요청 중...' : 'GPT에 질문하기'}
      </button>

      <div className="border border-black p-4 min-h-[100px] prose max-w-none">
        {result ? (
          <ReactMarkdown>{result}</ReactMarkdown>
        ) : (
          'GPT가 마크다운 형식으로 코드 리뷰를 알려줍니다.'
        )}
      </div>
    </div>
  );
}


export default GPTCodeHelper;
