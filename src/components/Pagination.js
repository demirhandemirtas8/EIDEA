import React from 'react';

const Pagination = ({ page, totalPages, changePage, size, handleSizeChange }) => (
  <div className="pagination">
    <button onClick={() => changePage(page - 1)} disabled={page === 0}>Önceki</button>
    <span>Sayfa {page + 1} / {totalPages}</span>
    <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}>Sonraki</button>
    <select onChange={handleSizeChange} value={size}>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </div>
);

export default Pagination;
