import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourseById, addToWishlist, removeFromWishlist, getWishlist } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Course } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CourseTabs from '../components/UI/CourseTabs';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items: cartItems } = useCart();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchCourseAndWishlist = async () => {
      if (!id) {
        setError("Course ID is missing.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const courseData = await getCourseById(id);
        if (courseData) {
          setCourse(courseData);
        } else {
          setError("Course not found.");
        }
        if (user) {
          const wishlist = await getWishlist();
          setIsInWishlist(wishlist.some(item => item.course_id === id));
        }
      } catch (err) {
        setError("Failed to fetch course details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseAndWishlist();
  }, [id, user]);

  const handleWishlistToggle = async () => {
    if (!user || !id) {
      navigate('/login');
      return;
    }
    try {
      if (isInWishlist) {
        await removeFromWishlist(id);
        setIsInWishlist(false);
      } else {
        await addToWishlist(id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Course not found'}</h2>
          <button onClick={() => navigate('/courses')} className="text-blue-600 hover:text-blue-700">
            ← Back to courses
          </button>
        </div>
      </div>
    );
  }

  const isInCart = cartItems.some(item => item.course.id === course.id);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!isInCart) {
      addToCart(course);
    }
    navigate('/cart');
  };

  const videoId = course.preview_video_url?.split('v=')[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="font-medium">{course.rating}</span></div>
                <div className="flex items-center space-x-1"><Users className="w-4 h-4" /><span>{course.students.toLocaleString()} students</span></div>
                <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>Last updated {new Date(course.created_at).toLocaleDateString()}</span></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">Created by {course.instructor}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseTabs course={course} />
          </div>
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24">
              {videoId ? (
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-t-xl"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-xl" />
              )}
              <div className="p-6">
                <div className="text-center mb-6"><div className="text-4xl font-bold text-gray-900 mb-2">৳{course.price}</div></div>
                <div className="flex items-center gap-3 mb-4">
                  {isInCart ? (
                    <button onClick={() => navigate('/cart')} className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">View in Cart</button>
                  ) : (
                    <button onClick={handleAddToCart} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></button>
                  )}
                  <button onClick={handleWishlistToggle} className="p-3 border-2 border-gray-200 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors">
                    <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                  </button>
                </div>
                <button onClick={handleBuyNow} className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">Buy Now</button>
                <p className="text-xs text-center text-gray-500 mt-4">30-Day Money-Back Guarantee</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
