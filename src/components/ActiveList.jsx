import ItemCard from './ItemCard';
import './ActiveList.css';

function ActiveList({ items, onTogglePurchased, onUpdateQuantity, onRemove }) {
  const unpurchasedItems = items.filter(item => !item.purchased);
  const purchasedItems = items.filter(item => item.purchased);

  return (
    <div className="active-list">
      {/* מוצרים שעוד לא נקנו */}
      <div className="items-section">
        {unpurchasedItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onTogglePurchased={onTogglePurchased}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* מוצרים שנקנו */}
      {purchasedItems.length > 0 && (
        <div className="purchased-section">
          <h3 className="section-title">✓ נקנו</h3>
          {purchasedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onTogglePurchased={onTogglePurchased}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActiveList;
