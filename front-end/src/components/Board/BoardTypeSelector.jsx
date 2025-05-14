import React from 'react';
import './BoardTypeSelector.css';

const BoardTypeSelector = ({ boardTypes, selectedBoard, onSelectBoard }) => {
  return (
    <div className="board-type-selector-container">
      {boardTypes.map((type) => (
        <button
          key={type.id}
          className={`board-type-button ${selectedBoard === type.id ? 'active' : ''}`}
          onClick={() => onSelectBoard(type.id)}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
};

export default BoardTypeSelector;
