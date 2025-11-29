import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, Printer, Mail, Package, Truck, Home } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  items: any[];
  shippingInfo: any;
  paymentInfo: any;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    
    if (!foundOrder) {
      navigate('/');
      return;
    }
    
    setOrder(foundOrder);
  }, [orderId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text receipt
    const receipt = `
ORDER CONFIRMATION
==================

Order ID: ${order?.id}
Date: ${new Date(order?.date || '').toLocaleDateString()}

SHIPPING INFORMATION
--------------------
${order?.shippingInfo.fullName}
${order?.shippingInfo.address}
${order?.shippingInfo.city}, ${order?.shippingInfo.state} ${order?.shippingInfo.zipCode}
${order?.shippingInfo.country}
Email: ${order?.shippingInfo.email}
Phone: ${order?.shippingInfo.phone}

ORDER ITEMS
-----------
${order?.items.map((item: any) => `${item.designTitle} - ${item.mockupType} (${item.size}, ${item.color}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

ORDER SUMMARY
-------------
Subtotal: $${order?.subtotal.toFixed(2)}
Shipping: $${order?.shipping.toFixed(2)}
Tax: $${order?.tax.toFixed(2)}
Total: $${order?.total.toFixed(2)}

Payment Method: Card ending in ${order?.paymentInfo.cardLast4}

Thank you for your order!
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order?.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Order ID: <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{order.id}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-500 dark:to-purple-500 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-1">Order Receipt</h2>
                <p className="text-brand-100">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Package className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Shipping Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Information</h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">{order.shippingInfo.fullName}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{order.shippingInfo.address}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingInfo.country}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {order.shippingInfo.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    📞 {order.shippingInfo.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <img
                      src={item.imageUrl}
                      alt={item.designTitle}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.designTitle}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.mockupType.charAt(0).toUpperCase() + item.mockupType.slice(1)} • Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Payment Method: Card ending in <span className="font-mono font-semibold">****{order.paymentInfo.cardLast4}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">What's Next?</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                    We've sent a confirmation email to <span className="font-semibold">{order.shippingInfo.email}</span>
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Your order is being processed and will ship within 2-3 business days. You'll receive a tracking number once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 text-center print:hidden">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need help with your order?
          </p>
          <Link
            to="/help"
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

