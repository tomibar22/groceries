import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import './SearchBar.css';

function SearchBar({ allItems, onAddItem }) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const fuse = useRef(null);

  // אתחול Fuse.js עם fuzzy search
  useEffect(() => {
    fuse.current = new Fuse(allItems, {
      keys: ['name'],
      threshold: 0.3, // רמת סובלנות לטעויות כתיב (0 = perfect match, 1 = match anything)
      distance: 100,
      minMatchCharLength: 1,
      shouldSort: true,
      includeScore: true
    });
  }, [allItems]);

  useEffect(() => {
    if (searchText.trim().length > 0 && fuse.current) {
      const results = fuse.current.search(searchText);
      setSuggestions(results.slice(0, 5).map(result => result.item));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedText = searchText.trim();

    if (!trimmedText) return;

    // בדיקה אם המוצר קיים במאגר (case-insensitive)
    const existingItem = allItems.find(
      item => item.name.toLowerCase() === trimmedText.toLowerCase()
    );

    if (existingItem) {
      // אם קיים, נוסיף רק לרשימה הפעילה
      onAddItem(existingItem.name, existingItem.id);
    } else {
      // אם לא קיים, נוסיף גם למאגר וגם לרשימה הפעילה
      onAddItem(trimmedText);
    }

    // ניקוי השדה וחזרה לפוקוס
    setSearchText('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (item) => {
    onAddItem(item.name, item.id);
    setSearchText('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="הוסף מוצר... 🔍"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoComplete="off"
          autoFocus
        />
        <button type="submit" className="add-button">
          ➕
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((item) => (
            <button
              key={item.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(item)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
