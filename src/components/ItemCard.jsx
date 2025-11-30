import { useState, useRef, useEffect } from 'react';
import './ItemCard.css';

function ItemCard({ item, onToggleNeeded, onDeleteItem }) {
  const cardRef = useRef(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const currentX = useRef(0);

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

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // רק אם ההחלקה היא אופקית יותר מאנכית
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();

      // החלקה שמאלה (deltaX שליל) מגלה את כפתור המחיקה
      const newOffset = swipeOffset - deltaX;
      currentX.current = Math.max(0, Math.min(newOffset, 80)); // בין 0 ל-80px
      setSwipeOffset(currentX.current);

      // עדכן את נקודת ההתחלה לתנועה חלקה
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    // אם החליק יותר מ-40px, השאר פתוח
    if (currentX.current > 40) {
      setSwipeOffset(80);
    } else {
      // אחרת, סגור
      setSwipeOffset(0);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`item-card ${item.needed ? 'not-needed' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* כפתור מחיקה ברקע */}
      <div
        className="delete-action"
        style={{
          opacity: swipeOffset / 80, // גדל בהדרגה
          transition: isSwiping ? 'none' : 'opacity 0.3s ease-out'
        }}
      >
        <button className="delete-btn" onClick={handleDelete} aria-label="מחק">
          🗑️
        </button>
      </div>

      {/* תוכן הכרטיס - לא זז */}
      <div className="item-main">
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

        <div className="item-info">
          <span className="item-name">{item.name}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
