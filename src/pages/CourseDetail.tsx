import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, ArrowLeft, ShoppingCart, Heart, Check, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourseById, getReviewsByCourse, createReview, getWishlist, addToWishlist, removeFromWishlist } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Course, Review } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CourseTabs from '../components/UI/CourseTabs';
import ReviewCard from '../components/UI/ReviewCard';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items: cartItems } = useCart();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        setError("Course ID is missing.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const courseData = await getCourseById(id);
        const reviewsData = await getReviewsByCourse(id);
        if (user) {
          const wishlistData = await getWishlist();
          setWishlist(wishlistData.map(item => item.course_id));
        }
        setCourse(courseData || null);
        setReviews(reviewsData);
        if (!courseData) setError("Course not found.");
      } catch (err) {
        setError("Failed to fetch course details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [id, user]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!id) return;
    try {
      const newReview = await createReview({ course_id: id, rating, comment });
      setReviews([newReview, ...reviews]);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user || !id) {
      navigate('/login');
      return;
    }
    try {
      if (wishlist.includes(id)) {
        await removeFromWishlist(id);
        setWishlist(wishlist.filter(courseId => courseId !== id));
      } else {
        await addToWishlist(id);
        setWishlist([...wishlist, id]);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Course not found'}</h2>
          <button onClick={() => navigate('/courses')} className="text-blue-600 hover:text-blue-700 flex items-center mx-auto">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const isInCart = cartItems.some(item => item.course.id === course.id);
  const isWishlisted = wishlist.includes(course.id);

  const handleAddToCart = () => {
    if (!user) { navigate('/login', { state: { from: location } }); return; }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login', { state: { from: location } }); return; }
    if (!isInCart) addToCart(course);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <CourseTabs course={course} reviews={reviews} onReviewSubmit={handleReviewSubmit} />
          </div>

          {/* Right Column (Sticky Card) */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24">
              <div className="relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-xl" />
                {course.video_preview_url && (
                  <a href={course.video_preview_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                      <Play size={32} />
                    </div>
                  </a>
                )}
              </div>
              <div className="p-6">
                <div className="text-center mb-6"><div className="text-4xl font-bold text-gray-900 mb-2">৳{course.price}</div></div>
                <div className="flex items-center gap-3 mb-4">
                  {isInCart ? (
                    <button onClick={() => navigate('/cart')} className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Check className="w-5 h-5" />
                      <span>In Cart</span>
                    </button>
                  ) : (
                    <button onClick={handleAddToCart} className="w-full py-3 px-4 bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                  <button onClick={handleWishlistToggle} className={`p-3 border-2 rounded-lg transition-colors ${isWishlisted ? 'bg-red-50 border-red-500 text-red-500' : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'}`}>
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
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
