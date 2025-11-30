import { useState, useRef, useEffect } from 'react';
import './ItemCard.css';

function ItemCard({ item, onToggleNeeded, onDeleteItem }) {
  const cardRef = useRef(null);

  const handleNeededChange = () => {
    onToggleNeeded(item.id, item.needed);

    // Haptic feedback (אם נתמך)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleDelete = () => {
    onDeleteItem(item.id);

    // Haptic feedback (אם נתמך)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`item-card ${item.needed ? 'not-needed' : ''}`}
    >
      <div className="item-main">
        {/* כפתור מחיקה */}
        <button className="delete-btn" onClick={handleDelete} aria-label="מחק">
          🗑️
        </button>

        <div className="item-info">
          <span className="item-name">{item.name}</span>
        </div>

        {/* Checkbox: צריך לקנות */}
        <label className="checkbox-container checkbox-needed">
          <input
            type="checkbox"
            checked={item.needed}
            onChange={handleNeededChange}
            className="checkbox"
          />
          <span className="checkmark checkmark-needed">{item.needed ? '✓' : ''}</span>
        </label>
      </div>
    </div>
  );
}

export default ItemCard;
