import { useState } from 'react';

export default function BoardForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            category: '일반',
            title,
            content,
            author: '사용자',
            date: new Date().toISOString().split('T')[0],
            views: 0,
            likes: 0,
        };

        onAdd(newPost); // 부모에게 전달
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-10 p-4 border rounded">
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded">작성</button>
        </form>
    );
}
