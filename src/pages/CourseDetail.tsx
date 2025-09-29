import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, Award, Shield, ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourseById } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Course } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
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
      } catch (err) {
        setError("Failed to fetch course details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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

  const isInCart = items.some(item => item.course.id === course.id);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isInCart) {
      addToCart(course);
    }
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/courses')} className="flex items-center text-gray-600 hover:text-blue-600 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-64 md:h-80 object-cover" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{course.category}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{course.level}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="font-medium">{course.rating}</span></div>
                  <div className="flex items-center space-x-1"><Users className="w-4 h-4" /><span>{course.students.toLocaleString()} students</span></div>
                  <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{course.duration}</span></div>
                  <div className="flex items-center space-x-1"><BookOpen className="w-4 h-4" /><span>{course.lessons} lessons</span></div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-8">{course.description}</p>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About the instructor</h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">{course.instructor.charAt(0)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{course.instructor}</h4>
                      <p className="text-gray-600">Expert Instructor</p>
                      <p className="text-sm text-gray-500 mt-2">Professional instructor with years of industry experience and thousands of satisfied students.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="text-center mb-6"><div className="text-4xl font-bold text-gray-900 mb-2">${course.price}</div><div className="text-sm text-gray-500">One-time payment</div></div>
              <div className="space-y-3 mb-6">
                {isInCart ? (
                  <button onClick={() => navigate('/cart')} className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">View in Cart</button>
                ) : (
                  <button onClick={handleAddToCart} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></button>
                )}
                <button onClick={handleBuyNow} className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">Buy Now</button>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">This course includes:</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-3"><Clock className="w-4 h-4 text-gray-400" /><span>{course.duration} on-demand video</span></li>
                  <li className="flex items-center space-x-3"><BookOpen className="w-4 h-4 text-gray-400" /><span>{course.lessons} lessons</span></li>
                  <li className="flex items-center space-x-3"><Award className="w-4 h-4 text-gray-400" /><span>Certificate of completion</span></li>
                  <li className="flex items-center space-x-3"><Shield className="w-4 h-4 text-gray-400" /><span>30-day money-back guarantee</span></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
