import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, Review } from '../../types';
import { BookText, UserCircle, Star } from 'lucide-react';
import { getReviewsByCourseId } from '../../services/api';
import ReviewCard from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';

interface CourseTabsProps {
  course: Course;
}

const tabs = [
  { name: 'Overview', icon: BookText },
  { name: 'Syllabus', icon: BookText },
  { name: 'Instructor', icon: UserCircle },
  { name: 'Reviews', icon: Star },
];

const CourseTabs: React.FC<CourseTabsProps> = ({ course }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const handleTabClick = async (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'Reviews' && reviews.length === 0) {
      setIsLoadingReviews(true);
      try {
        const fetchedReviews = await getReviewsByCourseId(course.id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoadingReviews(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'Overview' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why you should do this course?</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
          )}
          {activeTab === 'Syllabus' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'Instructor' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Instructor</h3>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">{course.instructor.charAt(0)}</div>
                <div>
                  <h4 className="font-semibold text-xl text-gray-900 mb-1">{course.instructor}</h4>
                  <p className="text-gray-600 font-medium">Expert Instructor</p>
                  <p className="text-gray-600 mt-2">Professional instructor with years of industry experience and thousands of satisfied students. Dedicated to making complex topics easy to understand.</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Reviews' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Reviews</h3>
              {isLoadingReviews ? (
                <div className="flex justify-center py-8"><LoadingSpinner /></div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet for this course.</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CourseTabs;
