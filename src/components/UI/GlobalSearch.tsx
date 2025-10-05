import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getCourses } from '../../services/api';
import { Course } from '../../types';

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.length > 1) {
      const results = await getCourses(term, 'suggest');
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 300); // debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${searchTerm.trim()}`);
      setIsFocused(false);
      setSearchTerm('');
    }
  };

  const handleSuggestionClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
    setIsFocused(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative flex items-center bg-white rounded-full border border-gray-300 shadow-sm transition-all duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for courses..."
            className="w-full pl-4 pr-12 py-3 bg-transparent border-0 rounded-full focus:outline-none focus:ring-0"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white rounded-full"
          >
            <Search size={18} />
          </button>
        </div>
      </form>
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
          >
            {suggestions.map((course) => (
              <li
                key={course.id}
                onClick={() => handleSuggestionClick(course.id)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
              >
                <img src={course.thumbnail} alt={course.title} className="w-12 h-8 object-cover rounded-md" />
                <span className="text-sm font-medium text-gray-700">{course.title}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
