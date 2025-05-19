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
        {/* 이전 페이지 버튼 */}
        {currentPage > 1 && (
          <li className="page-item">
            <button onClick={() => onPageChange(currentPage - 1)} className="page-link">
              이전
            </button>
          </li>
        )}

        {/* 첫 페이지로 이동 */}
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

        {/* 페이지 번호들 */}
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => onPageChange(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}

        {/* 마지막 페이지로 이동 */}
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

        {/* 다음 페이지 버튼 */}
        {currentPage < totalPages && (
          <li className="page-item">
            <button onClick={() => onPageChange(currentPage + 1)} className="page-link">
              다음
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
