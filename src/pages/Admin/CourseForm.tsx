import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Course } from '../../types';
import { getCourseById, createCourse, updateCourse } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

type FormValues = Omit<Course, 'id' | 'created_at' | 'rating' | 'students'>;

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        setIsLoading(true);
        try {
          const course = await getCourseById(id);
          if (course) {
            Object.keys(course).forEach((key) => {
              if (key in course) {
                setValue(key as keyof FormValues, course[key as keyof FormValues]);
              }
            });
          }
        } catch (err) {
          setError('Failed to load course data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditing, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const courseData = {
        ...data,
        price: Number(data.price),
        lessons: Number(data.lessons),
        features: Array.isArray(data.features) ? data.features : (data.features as unknown as string).split(',').map(f => f.trim()),
      };
      
      if (isEditing) {
        await updateCourse(id, courseData);
      } else {
        await createCourse(courseData);
      }
      navigate('/admin/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditing ? 'Edit Course' : 'Create New Course'}
      </h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea {...register('description')} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (BDT)</label>
              <input type="number" step="0.01" {...register('price', { required: true, valueAsNumber: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input {...register('category')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select {...register('level')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Instructor</label>
                <input {...register('instructor')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input {...register('duration')} placeholder="e.g., 10 hours" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Number of Lessons</label>
                <input type="number" {...register('lessons', { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
            <input {...register('thumbnail')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
            <input {...register('features')} placeholder="Feature 1, Feature 2" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/admin/courses')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 flex items-center">
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              {isEditing ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
