import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
          {review.profiles.full_name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{review.profiles.full_name}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex">{renderStars()}</div>
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
