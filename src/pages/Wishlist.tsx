import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { WishlistItem } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlistItems(data);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (courseId: string) => {
    try {
      await removeFromWishlist(courseId);
      setWishlistItems(wishlistItems.filter(item => item.course_id !== courseId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const handleMoveToCart = (item: WishlistItem) => {
    addToCart(item.courses);
    handleRemove(item.course_id);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><Heart className="w-12 h-12 text-gray-400" /></div>
          <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Add courses to your wishlist to save them for later.</p>
          <Link to="/courses" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Browse Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Wishlist</h1>
        <div className="space-y-4">
          {wishlistItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
              <img src={item.courses.thumbnail} alt={item.courses.title} className="w-full md:w-32 h-24 object-cover rounded-md" />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.courses.title}</h2>
                <p className="text-sm text-gray-500">by {item.courses.instructor}</p>
              </div>
              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <span className="font-bold text-lg">৳{item.courses.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleRemove(item.course_id)} className="text-sm text-gray-500 hover:text-red-600">Remove</button>
                  <button onClick={() => handleMoveToCart(item)} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
