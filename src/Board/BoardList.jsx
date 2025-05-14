export default function BoardList({ posts }) {
    return (
        <div className="max-w-4xl mx-auto mt-10">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">말머리</th>
                        <th className="p-2 text-left">제목</th>
                        <th className="p-2 text-left">작성자</th>
                        <th className="p-2 text-left">작성일</th>
                        <th className="p-2 text-right">조회수</th>
                        <th className="p-2 text-right">좋아요</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 border-b">
                            <td className="p-2">{post.category}</td>
                            <td className="p-2 text-blue-600">{post.title}</td>
                            <td className="p-2">{post.author}</td>
                            <td className="p-2">{post.date}</td>
                            <td className="p-2 text-right">{post.views}</td>
                            <td className="p-2 text-right">{post.likes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
