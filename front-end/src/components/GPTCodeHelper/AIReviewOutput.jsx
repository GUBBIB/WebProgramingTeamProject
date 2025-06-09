import { useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

const AIReviewOutput = ({ rawResult }) => {
  const markdownText = rawResult?.choices?.[0]?.message?.content ?? '';

  useEffect(() => {
    console.log('AIReviewOutput content:', markdownText);
  }, [markdownText]);

  if (!markdownText) return <div>AI 응답 없음</div>;

  return (
    <div className="border border-black p-4 min-h-[100px]">
      <MDEditor.Markdown source={markdownText} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
};

export default AIReviewOutput;
