import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Checkout: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const courseIds = items.map(item => item.course.id);
      await createOrder({ course_ids: courseIds, total });

      clearCart();
      setIsProcessing(false);
      setOrderComplete(true);

      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
      console.error(err);
    }
  };
  
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your courses have been added to your account. You can now start learning!</p>
          <p className="text-sm text-gray-500">Redirecting to your orders...</p>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !isProcessing) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1><p className="text-gray-600 mt-2">Complete your purchase</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              {error && (<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <div className="relative"><CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="1234 5678 9012 3456" className="pl-10 w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label><input type="text" placeholder="MM/YY" className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">CVV</label><input type="text" placeholder="123" className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input type="text" placeholder="John Doe" defaultValue={user?.full_name} className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center text-sm text-gray-500 mb-4"><Lock className="w-4 h-4 mr-2" />Your payment information is secure and encrypted</div>
                <button type="submit" disabled={isProcessing} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  {isProcessing ? (<><LoadingSpinner size="sm" className="mr-2" />Processing Payment...</>) : (`Complete Payment - $${total.toFixed(2)}`)}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.course.id} className="flex items-start gap-3">
                  <img src={item.course.thumbnail} alt={item.course.title} className="w-16 h-12 object-cover rounded-lg" />
                  <div className="flex-1"><h3 className="font-medium text-gray-900 text-sm">{item.course.title}</h3><p className="text-sm text-gray-500">by {item.course.instructor}</p></div>
                  <span className="font-medium text-gray-900">${item.course.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span className="font-medium">$0.00</span></div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">✅ 30-day money-back guarantee</p>
              <p className="text-sm text-green-800">✅ Lifetime access to purchased courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
