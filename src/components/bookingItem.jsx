import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { XCircle, Loader2, Plus, Minus } from 'lucide-react';
import { removeFromCart, updateCartItemQty } from '../utils/cart';

export const BookingItem = ({ itemKey, qty, refresh, updateQty }) => {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(qty ?? 1);
  const [removed, setRemoved] = useState(false);
  const containerRef = useRef(null);

  // Keep local quantity in sync if parent changes the prop
  useEffect(() => {
    setQuantity(qty ?? 1);
  }, [qty]);

  // Fetch item
  useEffect(() => {
    let mounted = true;
    if (status === 'loading') {
      axios.get(`http://localhost:3000/api/products/${itemKey}`)
        .then(res => {
          if (!mounted) return;
          setItem(res.data);
          setStatus('success');
        })
        .catch(err => {
          console.error('BookingItem: failed to fetch product', itemKey, err);
          if (!mounted) return;
          setStatus('error');
          try { removeFromCart(itemKey); } catch (e) { console.error(e); }
          if (typeof refresh === 'function') refresh();
        });
    }
    return () => { mounted = false; };
  }, [status, itemKey, refresh]);

  const doRemove = (reason = 'manual') => {
    console.log(`BookingItem: removing ${itemKey} (reason: ${reason})`);
    
    // Blur any focused elements before hiding
    if (containerRef.current) {
      const focusedElement = containerRef.current.querySelector(':focus');
      if (focusedElement) {
        focusedElement.blur();
      }
    }
    
    setRemoved(true); // start fade
    
    // Actually remove from cart immediately
    try {
      removeFromCart(itemKey);
    } catch (e) {
      console.error('Error removing from cart', e);
    }
    
    // small delay for UX animation, then refresh to update UI
    setTimeout(() => {
      if (typeof updateQty === 'function') {
        try { 
          updateQty(itemKey, 0); 
        } catch (e) { 
          console.warn('updateQty threw', e); 
        }
      }
      if (typeof refresh === 'function') refresh();
    }, 200);
  };

  const handleRemove = () => doRemove('clicked-remove');

  const handleIncrease = () => {
    if (removed) return;
    const newQty = (quantity || 0) + 1;
    setQuantity(newQty);
    
    // Update cart
    try {
      updateCartItemQty(itemKey, newQty);
    } catch (e) {
      console.error('Error updating cart quantity', e);
    }
    
    if (typeof updateQty === 'function') {
      try { updateQty(itemKey, newQty); } catch (e) { console.warn('updateQty threw', e); }
    }
  };

  const handleDecrease = () => {
    if (removed) return;
    const newQty = (quantity || 0) - 1;
    if (newQty <= 0) {
      // remove when reaches zero
      doRemove('qty-zero');
    } else {
      setQuantity(newQty);
      
      // Update cart
      try {
        updateCartItemQty(itemKey, newQty);
      } catch (e) {
        console.error('Error updating cart quantity', e);
      }
      
      if (typeof updateQty === 'function') {
        try { updateQty(itemKey, newQty); } catch (e) { console.warn('updateQty threw', e); }
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl shadow-sm">
        <Loader2 className="animate-spin text-blue-500" size={24} />
        <span className="ml-2 text-gray-500 text-sm">Loading item...</span>
      </div>
    );
  }

  if (status === 'error' || !item) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-xl shadow-sm text-center">
        Failed to load item. It may have been removed.
      </div>
    );
  }

  const totalPrice = (item.price || 0) * (quantity || 0);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-between bg-white rounded-2xl shadow-md transition-all duration-200 p-4 mb-3 ${
        removed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Left: Image & Info */}
      <div className="flex items-center space-x-4">
        <img
          src={item.image?.[0] || 'https://via.placeholder.com/150'}
          alt={item.name}
          className="w-16 h-16 rounded-xl object-cover border border-gray-200"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.category}</p>

          <div className="flex items-center mt-2 space-x-3">
            {/* Quantity Controls */}
            <button
              onClick={handleDecrease}
              disabled={removed}
              className="bg-gray-200 hover:bg-gray-300 p-1 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 text-gray-700 font-medium">{quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={removed}
              className="bg-gray-200 hover:bg-gray-300 p-1 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Total & Remove */}
      <div className="flex flex-col items-end space-y-2">
        <p className="text-base font-semibold text-green-600">
          Rs. {Number(totalPrice).toLocaleString()}
        </p>
        <button
          onClick={handleRemove}
          disabled={removed}
          className="text-red-500 hover:text-red-600 transition-all flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle size={20} />
          <span className="text-sm">Remove</span>
        </button>
      </div>
    </div>
  );
};