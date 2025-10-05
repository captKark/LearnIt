import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourses, deleteCourse } from '../../services/api';
import { Course } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete);
        setCourses(courses.filter(c => c.id !== courseToDelete));
        setShowDeleteModal(false);
        setCourseToDelete(null);
      } catch (err) {
        setError('Failed to delete course.');
      }
    }
  };

  if (isLoading) return <div className="flex justify-center mt-10"><LoadingSpinner size="lg" /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
        <Link
          to="/admin/courses/new"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course, index) => (
              <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {course.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{course.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.students}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/courses/edit/${course.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="w-5 h-5 inline" />
                  </Link>
                  <button onClick={() => handleDeleteClick(course.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
      />
    </div>
  );
};

export default AdminCourses;
