import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import SearchBar from './components/SearchBar';
import ActiveList from './components/ActiveList';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const touchStartY = useRef(0);

  // טעינה ראשונית של כל המוצרים
  useEffect(() => {
    fetchItems();
  }, []);

  // הקשבה לשינויים real-time
  useEffect(() => {
    const channel = supabase
      .channel('items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items'
        },
        (payload) => {
          console.log('✅ Real-time change detected:', payload.eventType, payload);
          fetchItems();
        }
      )
      .subscribe((status) => {
        console.log('📡 Items subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to items changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to items');
        }
      });

    return () => {
      console.log('🔌 Unsubscribing from items channel');
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error} = await supabase
        .from('items')
        .select('*')
        .order('needed', { ascending: false })
        .order('purchased', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addOrToggleItem = async (itemName) => {
    try {
      // בדוק אם המוצר קיים
      const existing = items.find(
        item => item.name.toLowerCase() === itemName.toLowerCase()
      );

      if (existing) {
        // אם קיים, סמן אותו כ-needed
        await supabase
          .from('items')
          .update({ needed: true, purchased: false })
          .eq('id', existing.id);
      } else {
        // אם לא קיים, צור חדש
        await supabase
          .from('items')
          .insert([{
            name: itemName,
            needed: true,
            purchased: false,
            quantity: 1
          }]);
      }
    } catch (error) {
      console.error('Error adding/toggling item:', error);
    }
  };

  const togglePurchased = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ purchased: !currentStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling purchased:', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) newQuantity = 1;

      const { error } = await supabase
        .from('items')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const toggleNeeded = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ needed: !currentStatus, purchased: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling needed:', error);
    }
  };

  const clearPurchased = async () => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ purchased: false, needed: false })
        .eq('purchased', true);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing purchased items:', error);
    }
  };

  // Pull to refresh
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const pullDistance = touchY - touchStartY.current;

    if (pullDistance > 100 && window.scrollY === 0 && !refreshing) {
      setRefreshing(true);
      fetchItems();
    }
  };

  // סינון לפי חיפוש
  const filteredItems = searchText.trim()
    ? items.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : items;

  const purchasedCount = items.filter(item => item.purchased).length;
  const neededCount = items.filter(item => item.needed && !item.purchased).length;

  return (
    <div
      className="app"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {refreshing && <div className="refresh-indicator">מרענן...</div>}

      <header className="app-header">
        <h1>🛒 רשימת קניות</h1>
      </header>

      <SearchBar
        allItems={items}
        searchText={searchText}
        onSearchChange={setSearchText}
        onAddItem={addOrToggleItem}
      />

      {loading ? (
        <div className="loading">טוען...</div>
      ) : (
        <>
          {neededCount > 0 && (
            <div className="stats-bar">
              צריך לקנות: <strong>{neededCount}</strong> מוצרים
            </div>
          )}

          <ActiveList
            items={filteredItems}
            onTogglePurchased={togglePurchased}
            onUpdateQuantity={updateQuantity}
            onToggleNeeded={toggleNeeded}
          />

          {purchasedCount > 0 && (
            <div className="footer-actions">
              <button
                className="clear-purchased-btn"
                onClick={clearPurchased}
              >
                ✓ סמן הכל כלא נקנה ({purchasedCount})
              </button>
            </div>
          )}

          {items.length === 0 && (
            <div className="empty-state">
              <p>אין מוצרים בקטלוג</p>
              <p className="empty-hint">התחל להוסיף מוצרים 👆</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
