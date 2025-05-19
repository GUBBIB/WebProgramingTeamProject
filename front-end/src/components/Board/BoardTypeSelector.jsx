import React from "react";
import PostList from "../Post/PostList";
import "./BoardTypeSelector.css";

const BoardTypeSelector = ({ selectedBoard, onSelectedBoard, searchedPosts }) => {
  // 게시판 목록은 예시로 고정값 사용, 필요 시 API 호출로 대체 가능
  const boardList = [
    { BRD_id: 1, BRD_name: "전체" },
    { BRD_id: 2, BRD_name: "공지사항" },
    { BRD_id: 3, BRD_name: "자유게시판" },
  ];

  return (
    <div className="board-type-selector">
      <select
        value={selectedBoard}
        onChange={(e) => onSelectedBoard(Number(e.target.value))}
      >
        {boardList.map((board) => (
          <option key={board.BRD_id} value={board.BRD_id}>
            {board.BRD_name}
          </option>
        ))}
      </select>

      {/* 검색 결과 있으면 검색 결과 보여주고, 없으면 게시판별 글 목록 보여주기 */}
      {searchedPosts ? (
        <PostList BRD_id={null} posts={searchedPosts} isSearchResult />
      ) : (
        <PostList BRD_id={selectedBoard} />
      )}
    </div>
  );
};

export default BoardTypeSelector;
