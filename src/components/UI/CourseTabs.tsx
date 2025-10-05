import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, Review } from '../../types';
import { Star, Send } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { useAuth } from '../../contexts/AuthContext';

interface CourseTabsProps {
  course: Course;
  reviews: Review[];
  onReviewSubmit: (rating: number, comment: string) => Promise<void>;
}

const CourseTabs: React.FC<CourseTabsProps> = ({ course, reviews, onReviewSubmit }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const { user } = useAuth();

  const handleStarClick = (rating: number) => setNewReviewRating(rating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating > 0 && newReviewComment.trim() !== '') {
      onReviewSubmit(newReviewRating, newReviewComment);
      setNewReviewRating(0);
      setNewReviewComment('');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'syllabus':
        return <div>Syllabus content coming soon...</div>;
      case 'instructor':
        return <div>Instructor bio coming soon...</div>;
      case 'reviews':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h3>
            {user && (
              <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Leave a review</h4>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => handleStarClick(star)}>
                      <Star className={`w-6 h-6 ${newReviewRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-2 border rounded-md mb-2"
                  rows={3}
                />
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white rounded-md flex items-center gap-2">
                  <Send size={16} /> Submit Review
                </button>
              </form>
            )}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map(review => <ReviewCard key={review.id} review={review} />)
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseTabs;
