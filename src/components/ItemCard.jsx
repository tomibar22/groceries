import { useState, useRef, useEffect } from 'react';
import './ItemCard.css';

function ItemCard({ item, onTogglePurchased, onUpdateQuantity, onRemove }) {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setSwiping(true);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!swiping) return;

    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 100;

    // swipe שמאלה (למחיקה)
    if (swipeDistance > minSwipeDistance) {
      onRemove(item.id);
    }

    setSwiping(false);
    setTouchStartX(0);
    setTouchEndX(0);
  };

  const handleCheckboxChange = () => {
    onTogglePurchased(item.id, item.purchased);

    // Haptic feedback (אם נתמך)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const incrementQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div
      ref={cardRef}
      className={`item-card ${item.purchased ? 'purchased' : ''} ${swiping ? 'swiping' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="item-main">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={item.purchased}
            onChange={handleCheckboxChange}
            className="checkbox"
          />
          <span className="checkmark">{item.purchased ? '✓' : ''}</span>
        </label>

        <div className="item-info">
          <span className="item-name">{item.name}</span>
        </div>

        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={decrementQuantity}
            aria-label="הפחת כמות"
          >
            −
          </button>
          <span className="quantity">{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={incrementQuantity}
            aria-label="הוסף כמות"
          >
            +
          </button>
        </div>

        <button
          className="delete-btn"
          onClick={() => onRemove(item.id)}
          aria-label="מחק מוצר"
        >
          ✕
        </button>
      </div>

      {swiping && (
        <div className="swipe-indicator">
          <span>← החלק למחיקה</span>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
