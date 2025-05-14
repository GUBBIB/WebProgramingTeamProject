import { useState } from 'react';

export default function BoardForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지

        const newPost = {
            category: '일반',
            title,
            content,
            author: '사용자',
            date: new Date().toISOString().split('T')[0],
            views: 0,
            likes: 0,
        };

        try {
            // fetch를 사용하여 API에 POST 요청 보내기
            const response = await fetch('https://your-api-endpoint.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost), // newPost 객체를 JSON으로 변환하여 전송
            });

            if (!response.ok) {
                throw new Error('게시글 작성에 실패했습니다.');
            }

            const result = await response.json();
            onAdd(result); // 부모에게 새로 작성된 게시글 전달
            setTitle('');  // 제목 초기화
            setContent('');  // 내용 초기화

        } catch (error) {
            console.error(error);
            alert(error.message); // 에러 처리
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-4 border rounded">
            <h2 className="text-lg font-bold mb-4">게시글 작성</h2>
            <input
                className="w-full p-2 border mb-3"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="w-full p-2 border mb-3"
                placeholder="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}  // 클릭 시 fetch 요청
            >
                작성
            </button>
        </div>
    );
}
