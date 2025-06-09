import { useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

const AIReviewOutput = ({ rawResult }) => {
  const markdownText = rawResult?.choices?.[0]?.message?.content ?? ''; // ✅ 이걸로 충분함

  useEffect(() => {
    console.log('디코딩된 마크다운:', markdownText);
  }, [markdownText]);

  if (!markdownText) return <div>AI 응답 없음</div>;

  return (
    <div className="border border-black p-4 min-h-[100px]">
      <MDEditor.Markdown source={markdownText} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
};

export default AIReviewOutput;
