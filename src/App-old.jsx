import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import SearchBar from './components/SearchBar';
import ActiveList from './components/ActiveList';
import './App.css';

function App() {
  const [allItems, setAllItems] = useState([]);
  const [activeList, setActiveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);

  // טעינה ראשונית של כל המוצרים
  useEffect(() => {
    fetchAllItems();
    fetchActiveList();
  }, []);

  // הקשבה לשינויים real-time ברשימה הפעילה
  useEffect(() => {
    const channel = supabase
      .channel('active_list_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_list'
        },
        (payload) => {
          console.log('✅ Real-time change detected:', payload.eventType, payload);
          fetchActiveList();
        }
      )
      .subscribe((status) => {
        console.log('📡 Active list subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to active_list changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to active_list');
        }
      });

    return () => {
      console.log('🔌 Unsubscribing from active_list channel');
      supabase.removeChannel(channel);
    };
  }, []);

  // הקשבה לשינויים real-time במאגר המוצרים
  useEffect(() => {
    const channel = supabase
      .channel('items_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'items'
        },
        (payload) => {
          console.log('✅ New item added to catalog:', payload);
          fetchAllItems();
        }
      )
      .subscribe((status) => {
        console.log('📡 Items subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to items changes');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAllItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');

      if (error) throw error;
      setAllItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchActiveList = async () => {
    try {
      const { data, error } = await supabase
        .from('active_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveList(data || []);
    } catch (error) {
      console.error('Error fetching active list:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addItemToActiveList = async (itemName, itemId = null) => {
    try {
      // בדיקה אם המוצר כבר קיים ברשימה הפעילה
      const existing = activeList.find(
        item => item.name.toLowerCase() === itemName.toLowerCase() && !item.purchased
      );

      if (existing) {
        // אם קיים, נעדכן את הכמות
        await updateQuantity(existing.id, existing.quantity + 1);
        return;
      }

      // אם המוצר לא קיים במאגר, נוסיף אותו
      let finalItemId = itemId;
      if (!itemId) {
        const { data: newItem, error: itemError } = await supabase
          .from('items')
          .insert([{ name: itemName }])
          .select()
          .single();

        if (itemError) {
          // אם יש שגיאת UNIQUE (המוצר כבר קיים), נמצא אותו
          if (itemError.code === '23505') {
            const { data: existingItem } = await supabase
              .from('items')
              .select('id')
              .eq('name', itemName)
              .single();

            finalItemId = existingItem?.id;
          } else {
            throw itemError;
          }
        } else {
          finalItemId = newItem.id;
        }
      }

      // הוספה לרשימה הפעילה
      const { error } = await supabase
        .from('active_list')
        .insert([
          {
            item_id: finalItemId,
            name: itemName,
            quantity: 1,
            purchased: false
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const togglePurchased = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('active_list')
        .update({ purchased: !currentStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling purchased:', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await removeFromActiveList(id);
        return;
      }

      const { error } = await supabase
        .from('active_list')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromActiveList = async (id) => {
    try {
      const { error } = await supabase
        .from('active_list')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearPurchased = async () => {
    try {
      const { error } = await supabase
        .from('active_list')
        .delete()
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
      fetchAllItems();
      fetchActiveList();
    }
  };

  const purchasedCount = activeList.filter(item => item.purchased).length;

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
        allItems={allItems}
        onAddItem={addItemToActiveList}
      />

      {loading ? (
        <div className="loading">טוען...</div>
      ) : (
        <>
          <ActiveList
            items={activeList}
            onTogglePurchased={togglePurchased}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromActiveList}
          />

          {purchasedCount > 0 && (
            <div className="footer-actions">
              <button
                className="clear-purchased-btn"
                onClick={clearPurchased}
              >
                🗑️ נקה מוצרים שנקנו ({purchasedCount})
              </button>
            </div>
          )}

          {activeList.length === 0 && (
            <div className="empty-state">
              <p>הרשימה ריקה</p>
              <p className="empty-hint">התחל להוסיף מוצרים 👆</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
