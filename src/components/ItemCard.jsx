import { useState, useRef, useEffect } from 'react';
import './ItemCard.css';

function ItemCard({ item, onTogglePurchased, onUpdateQuantity, onToggleNeeded }) {
  const cardRef = useRef(null);

  const handlePurchasedChange = () => {
    onTogglePurchased(item.id, item.purchased);

    // Haptic feedback (אם נתמך)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleNeededChange = () => {
    onToggleNeeded(item.id, item.needed);

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
      className={`item-card ${item.purchased ? 'purchased' : ''} ${!item.needed ? 'not-needed' : ''}`}
    >
      <div className="item-main">
        {/* Checkbox: נקנה */}
        <label className="checkbox-container checkbox-purchased">
          <input
            type="checkbox"
            checked={item.purchased}
            onChange={handlePurchasedChange}
            className="checkbox"
          />
          <span className="checkmark">{item.purchased ? '✓' : ''}</span>
        </label>

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
