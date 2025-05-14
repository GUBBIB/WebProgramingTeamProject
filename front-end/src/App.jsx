import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import BoardTypeSelector from './components/Board/BoardTypeSelector';
import PostList from './components/Post/PostList';
import Pagination from './components/Board/Pagination';
import BoardControls from './components/Board/BoardControls';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import './pages/MainPage.css'; // MainPage specific styles

// --- Mock Data --- (API 연동 전 임시 데이터)
const allPosts = [
  { id: '1', title: '리액트 질문입니다!', author: '개발자A', createdAt: '2024-05-10T10:00:00Z', views: 150, boardType: 'qna', content: '리액트에서 상태 관리는 어떻게 하는게 좋을까요? Redux, Zustand, Context API 등 선택지가 많네요.' },
  { id: '2', title: '자바스크립트 클로저 심층 분석', author: '코딩마스터', createdAt: '2024-05-09T14:30:00Z', views: 250, boardType: 'code', content: '클로저는 자바스크립트의 강력한 기능 중 하나입니다. 이 글에서는 클로저의 동작 원리와 활용법을 자세히 다룹니다.' },
  { id: '3', title: '오늘 날씨가 너무 좋네요!', author: '날씨요정', createdAt: '2024-05-11T09:00:00Z', views: 80, boardType: 'free', content: '다들 주말 계획 있으신가요? 저는 공원에 피크닉 가려구요!' },
  { id: '4', title: 'Python으로 웹 스크래핑하기', author: '데이터분석가', createdAt: '2024-05-08T11:20:00Z', views: 320, boardType: 'code', content: 'Beautiful Soup와 Requests 라이브러리를 사용한 파이썬 웹 스크래핑 예제 코드입니다.' },
  { id: '5', title: '요즘 읽을만한 책 추천해주세요', author: '책벌레', createdAt: '2024-05-12T16:00:00Z', views: 120, boardType: 'free', content: '새로운 분야의 책을 읽고 싶은데, 어떤 책이 좋을까요?' },
  { id: '6', title: 'CSS Grid와 Flexbox 비교', author: '프론트엔드개발', createdAt: '2024-05-07T18:00:00Z', views: 450, boardType: 'code', content: 'CSS Grid와 Flexbox는 각각 어떤 상황에 사용하는 것이 효과적일까요? 두 레이아웃 시스템을 비교 분석합니다.' },
  { id: '7', title: '코딩 테스트 준비 어떻게 하시나요?', author: '취준생', createdAt: '2024-05-13T10:30:00Z', views: 180, boardType: 'qna', content: '코딩 테스트 알고리즘 문제 풀이 팁이나 좋은 학습 자료 있으면 공유해주세요!' },
  { id: '8', title: '주말에 다녀온 맛집 후기', author: '미식가', createdAt: '2024-05-06T20:00:00Z', views: 95, boardType: 'free', content: '이번 주말에 새로 생긴 파스타 집에 다녀왔는데, 정말 맛있었어요! 강력 추천합니다.' },
  { id: '9', title: 'Node.js 비동기 처리 질문', author: '백엔드꿈나무', createdAt: '2024-05-14T08:15:00Z', views: 210, boardType: 'qna', content: 'Node.js에서 async/await와 Promise를 사용할 때 주의할 점이 있을까요?' },
  { id: '10', title: '알고리즘 스터디원 모집합니다 (온라인)', author: '스터디장', createdAt: '2024-05-05T13:00:00Z', views: 70, boardType: 'free', content: '매주 온라인으로 진행하는 알고리즘 스터디입니다. 함께 성장하실 분들을 찾습니다.' },
  { id: '11', title: 'Vue.js vs React.js, 당신의 선택은?', author: '토론왕', createdAt: '2024-05-04T22:00:00Z', views: 500, boardType: 'code', content: '프론트엔드 프레임워크의 양대 산맥, Vue.js와 React.js! 각 프레임워크의 장단점과 선택 기준에 대해 이야기해봅시다.' },
  { id: '12', title: 'useEffect 훅 사용법 질문', author: '리액트초보', createdAt: '2024-05-13T15:00:00Z', views: 90, boardType: 'qna', content: 'useEffect 훅의 두 번째 인자로 빈 배열을 전달하는 경우와 전달하지 않는 경우의 차이점이 궁금합니다.' },
];

const boardTypes = [
  { id: 'all', name: '전체 게시판' },
  { id: 'code', name: '코드 게시판' },
  { id: 'free', name: '자유게시판' },
  { id: 'qna', name: '질문 게시판' },
];
// --- End Mock Data ---

const MainPageContent = () => {
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const handleSelectBoard = (boardId) => {
    setSelectedBoard(boardId);
    setCurrentPage(1); // 게시판 변경 시 1페이지로
    setSearchTerm(''); // 게시판 변경 시 검색어 초기화
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1); // 검색 시 1페이지로
  };

  const filteredPosts = allPosts
    .filter(post => selectedBoard === 'all' || post.boardType === selectedBoard)
    .filter(post => post.title.toLowerCase().includes(searchTerm));

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="main-page-container">
      <BoardTypeSelector 
        boardTypes={boardTypes} 
        selectedBoard={selectedBoard} 
        onSelectBoard={handleSelectBoard} 
      />
      <PostList posts={currentPosts} />
      {totalPages > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
      <BoardControls onSearch={handleSearch} />
    </div>
  );
};

const App = () => {
  // const location = useLocation(); // Removed as it was unused
  // PostDetailPage와 PostWritePage에서는 Header를 보여주지 않거나 다른 스타일의 Header를 사용할 수 있습니다.
  // 여기서는 간단하게 모든 페이지에 동일한 Header를 적용합니다.

  return (
    <>
      <Header />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<MainPageContent />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/write" element={<PostWritePage />} />
          {/* 추가적인 라우트 (예: 로그인, 회원가입 페이지)를 여기에 정의할 수 있습니다. */}
        </Routes>
      </main>
      {/* Footer 컴포넌트가 필요하다면 여기에 추가할 수 있습니다. */}
    </>
  );
};

export default App;

