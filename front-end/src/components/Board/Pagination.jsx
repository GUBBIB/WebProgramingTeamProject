import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPageButtonsToShow = 5;

  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtonsToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtonsToShow - 1);

  if (endPage - startPage + 1 < maxPageButtonsToShow) {
    startPage = Math.max(1, endPage - maxPageButtonsToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        {/* === 이전 페이지 버튼 === */}
        <div className="pagination-prev-next">
          {currentPage > 1 && (
            <li className="page-item">
              <button onClick={() => onPageChange(currentPage - 1)} className="page-link">
                이전
              </button>
            </li>
          )}
        </div>

        {/* === 첫 페이지 및 ... 표시 === */}
        <div className="pagination-first">
          {startPage > 1 && (
            <li className="page-item">
              <button onClick={() => onPageChange(1)} className="page-link">
                1
              </button>
            </li>
          )}
          {startPage > 2 && (
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )}
        </div>

        {/* === 가운데 페이지 번호들 === */}
        <div className="pagination-numbers">
          {pageNumbers.map(number => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
              <button onClick={() => onPageChange(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </div>

        {/* === ... 및 마지막 페이지 === */}
        <div className="pagination-last">
          {endPage < totalPages - 1 && (
            <li className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )}
          {endPage < totalPages && (
            <li className="page-item">
              <button onClick={() => onPageChange(totalPages)} className="page-link">
                {totalPages}
              </button>
            </li>
          )}
        </div>

        {/* === 다음 페이지 버튼 === */}
        <div className="pagination-prev-next">
          {currentPage < totalPages && (
            <li className="page-item">
              <button onClick={() => onPageChange(currentPage + 1)} className="page-link">
                다음
              </button>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Pagination;
