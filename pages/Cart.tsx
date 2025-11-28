import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { isAuthenticated } from '../utils/auth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Custom T-Shirt Design',
      price: 29.99,
      quantity: 2,
      size: 'L',
      color: 'Black',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    },
    {
      id: '2',
      name: 'Hoodie with Logo',
      price: 49.99,
      quantity: 1,
      size: 'M',
      color: 'Navy',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
    }
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      // Save cart state and redirect to login
      localStorage.setItem('pendingCheckout', 'true');
      navigate('/login?redirect=cart&action=checkout');
      return;
    }

    // User is authenticated, proceed with checkout
    // TODO: Implement actual checkout logic
    alert('Proceeding to checkout... (Checkout functionality to be implemented)');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start designing your custom apparel!
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Design Studio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors"
                >
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-2">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

