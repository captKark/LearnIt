import React, { useEffect, useState } from 'react';
import { Calendar, BookOpen, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order } from '../types';
import { getOrders } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await getOrders();
        setOrders(userOrders);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-600 bg-red-50 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">An error occurred</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><BookOpen className="w-12 h-12 text-gray-400" /></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">When you purchase courses, they'll appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.substring(0, 8)}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1"><Calendar className="w-4 h-4 mr-1" />{formatDate(order.created_at)}</div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status === 'paid' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {order.courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img src={course.thumbnail} alt={course.title} className="w-16 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-500">by {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">৳{course.price}</p>
                      {order.status === 'paid' && (<button className="text-xs text-blue-600 hover:text-blue-700 flex items-center mt-1"><Download className="w-3 h-3 mr-1" />Access Course</button>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-gray-900">৳{order.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
