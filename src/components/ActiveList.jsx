import ItemCard from './ItemCard';
import './ActiveList.css';

function ActiveList({ items, onToggleNeeded }) {
  return (
    <div className="active-list">
      <div className="items-section">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggleNeeded={onToggleNeeded}
          />
        ))}
      </div>
    </div>
  );
}

export default ActiveList;
