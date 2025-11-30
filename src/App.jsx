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
  const pendingUpdates = useRef(new Set()); // מעקב אחרי פריטים שעודכנו אופטימית

  // פונקציית מיון מרכזית
  const sortItems = (itemsToSort) => {
    return [...itemsToSort].sort((a, b) => {
      // 1. צריך vs לא צריך (needed אחרון)
      if (a.needed !== b.needed) return b.needed - a.needed;

      // 2. נקנה vs לא נקנה (purchased אחרון)
      if (a.purchased !== b.purchased) return a.purchased - b.purchased;

      // 3. לפי times_needed יורד (הכי פופולריים קודם)
      if (a.times_needed !== b.times_needed) {
        return (b.times_needed || 0) - (a.times_needed || 0);
      }

      // 4. לפי שם בסדר עולה
      return a.name.localeCompare(b.name, 'he');
    });
  };

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

          // עדכן רק את הפריט הספציפי שהשתנה במקום לטעון הכל מחדש
          if (payload.eventType === 'INSERT' && payload.new) {
            setItems(prev => {
              // בדוק אם זה לא פריט זמני שכבר הוספנו
              const exists = prev.some(item => item.id === payload.new.id);
              if (!exists) {
                return sortItems([...prev, payload.new]);
              }
              return prev;
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            // אם יש pending update לפריט הזה, התעלם מהעדכון real-time
            if (!pendingUpdates.current.has(payload.new.id)) {
              setItems(prev => {
                const updated = prev.map(item =>
                  item.id === payload.new.id ? payload.new : item
                );
                return sortItems(updated);
              });
            } else {
              console.log('🚫 Ignoring real-time update for pending item:', payload.new.id);
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
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
        .select('*');

      if (error) throw error;
      setItems(sortItems(data || []));
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
        // סמן שיש pending update
        pendingUpdates.current.add(existing.id);

        // Optimistic update - עדכן מיד את הממשק
        const updatedTimesNeeded = (existing.times_needed || 0) + 1;
        setItems(prev => sortItems(prev.map(item =>
          item.id === existing.id
            ? { ...item, needed: true, purchased: false, times_needed: updatedTimesNeeded }
            : item
        )));

        // שלח לשרת ברקע
        const { error } = await supabase
          .from('items')
          .update({
            needed: true,
            purchased: false,
            times_needed: updatedTimesNeeded
          })
          .eq('id', existing.id);

        if (error) {
          // במקרה של שגיאה, החזר את המצב הקודם
          pendingUpdates.current.delete(existing.id);
          setItems(prev => sortItems(prev.map(item =>
            item.id === existing.id ? existing : item
          )));
          throw error;
        }

        // הסר את הסימון של pending update רק אחרי שהשרת הגיב
        // נותן עוד קצת זמן ל-real-time update להגיע עם הנתונים המעודכנים
        setTimeout(() => {
          pendingUpdates.current.delete(existing.id);
          // מיין שוב כדי לוודא שהנתונים מה-DB מסודרים נכון
          setItems(prev => sortItems([...prev]));
        }, 1500);
      } else {
        // צור אובייקט זמני עם ID שלילי
        const tempId = -Date.now();
        const newItem = {
          id: tempId,
          name: itemName,
          needed: true,
          purchased: false,
          quantity: 1,
          times_needed: 1
        };

        // Optimistic update - הוסף מיד לממשק
        setItems(prev => sortItems([...prev, newItem]));

        // שלח לשרת ברקע
        const { data, error } = await supabase
          .from('items')
          .insert([{
            name: itemName,
            needed: true,
            purchased: false,
            quantity: 1,
            times_needed: 1
          }])
          .select()
          .single();

        if (error) {
          // במקרה של שגיאה, הסר את הפריט הזמני
          setItems(prev => prev.filter(item => item.id !== tempId));
          throw error;
        }

        // החלף את הפריט הזמני באמיתי
        setItems(prev => sortItems(prev.map(item =>
          item.id === tempId ? data : item
        )));
      }
    } catch (error) {
      console.error('Error adding/toggling item:', error);
    }
  };

  const togglePurchased = async (id, currentStatus) => {
    try {
      // סמן שיש pending update
      pendingUpdates.current.add(id);

      // Optimistic update - עדכן מיד את הממשק
      setItems(prev => sortItems(prev.map(item =>
        item.id === id ? { ...item, purchased: !currentStatus } : item
      )));

      // שלח לשרת ברקע
      const { error } = await supabase
        .from('items')
        .update({ purchased: !currentStatus })
        .eq('id', id);

      if (error) {
        // במקרה של שגיאה, החזר את המצב הקודם
        pendingUpdates.current.delete(id);
        setItems(prev => sortItems(prev.map(item =>
          item.id === id ? { ...item, purchased: currentStatus } : item
        )));
        throw error;
      }

      // הסר את הסימון של pending update רק אחרי שהשרת הגיב
      setTimeout(() => {
        pendingUpdates.current.delete(id);
        setItems(prev => sortItems([...prev]));
      }, 1500);
    } catch (error) {
      console.error('Error toggling purchased:', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) newQuantity = 1;

      // שמור את הערך הקודם לצורך rollback
      const previousQuantity = items.find(item => item.id === id)?.quantity;

      // Optimistic update - עדכן מיד את הממשק
      setItems(prev => sortItems(prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )));

      // שלח לשרת ברקע
      const { error } = await supabase
        .from('items')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) {
        // במקרה של שגיאה, החזר את הערך הקודם
        setItems(prev => sortItems(prev.map(item =>
          item.id === id ? { ...item, quantity: previousQuantity } : item
        )));
        throw error;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const toggleNeeded = async (id, currentStatus) => {
    try {
      // סמן שיש pending update
      pendingUpdates.current.add(id);

      // שמור את המצב הקודם לצורך rollback
      const previousItem = items.find(item => item.id === id);

      // חשב את העדכונים
      const updates = { needed: !currentStatus, purchased: false };

      if (!currentStatus) {
        // משנים ל-needed=true, צריך להגדיל את times_needed
        updates.times_needed = (previousItem?.times_needed || 0) + 1;
      }

      // Optimistic update - עדכן מיד את הממשק
      setItems(prev => sortItems(prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )));

      // שלח לשרת ברקע
      const { error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id);

      if (error) {
        // במקרה של שגיאה, החזר את המצב הקודם
        pendingUpdates.current.delete(id);
        setItems(prev => sortItems(prev.map(item =>
          item.id === id ? previousItem : item
        )));
        throw error;
      }

      // הסר את הסימון של pending update רק אחרי שהשרת הגיב
      setTimeout(() => {
        pendingUpdates.current.delete(id);
        setItems(prev => sortItems([...prev]));
      }, 1500);
    } catch (error) {
      console.error('Error toggling needed:', error);
    }
  };

  const clearPurchased = async () => {
    try {
      // שמור את המצב הקודם לצורך rollback
      const previousItems = [...items];

      // Optimistic update - עדכן מיד את הממשק
      setItems(prev => sortItems(prev.map(item =>
        item.purchased ? { ...item, purchased: false, needed: false } : item
      )));

      // שלח לשרת ברקע
      const { error } = await supabase
        .from('items')
        .update({ purchased: false, needed: false })
        .eq('purchased', true);

      if (error) {
        // במקרה של שגיאה, החזר את המצב הקודם
        setItems(previousItems);
        throw error;
      }
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
