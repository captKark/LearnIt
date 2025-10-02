import { supabase } from '../lib/supabaseClient';
import { Course, Order, Review, WishlistItem } from '../types';

// Course APIs
export const getCourses = async (searchTerm?: string): Promise<Course[]> => {
  let query = supabase.from('courses').select('*');

  if (searchTerm && searchTerm.trim()) {
    // Convert the user's search term into a valid tsquery format.
    // This replaces spaces with the '&' (AND) operator, so a search for
    // "machine learning" becomes a search for "machine & learning".
    const formattedSearchTerm = searchTerm.trim().split(/\s+/).join(' & ');
    query = query.textSearch('fts', formattedSearchTerm);
  }

  query = query.order('students', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data || undefined;
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'rating' | 'students'>): Promise<Course> => {
  const { data, error } = await supabase.from('courses').insert({ ...courseData, rating: 4.5, students: 0 }).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateCourse = async (id: string, courseData: Partial<Omit<Course, 'id' | 'created_at'>>): Promise<Course> => {
  const { data, error } = await supabase.from('courses').update(courseData).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw new Error(error.message);
};


// Order APIs
export const createOrder = async (orderData: { course_ids: string[], total: number }): Promise<any> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total: orderData.total,
      course_ids: orderData.course_ids,
      status: 'paid',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getOrders = async (): Promise<any[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  
  const populatedOrders = await Promise.all(
    (data || []).map(async (order) => {
      if (!order.course_ids || order.course_ids.length === 0) {
        return { ...order, courses: [] };
      }
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .in('id', order.course_ids);
      
      if (courseError) {
        console.error('Error fetching courses for order:', courseError.message);
        return { ...order, courses: [] };
      }
      return { ...order, courses };
    })
  );

  return populatedOrders;
};

// Review APIs
export const getReviewsByCourseId = async (courseId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const addReview = async (reviewData: { course_id: string; user_id: string; rating: number; comment: string }): Promise<Review> => {
  const { data, error } = await supabase.from('reviews').insert(reviewData).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// Wishlist APIs
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlist')
    .select('*, courses(*)')
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  return data || [];
};

export const addToWishlist = async (courseId: string): Promise<any> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('wishlist').insert({ user_id: user.id, course_id: courseId });
  if (error) throw new Error(error.message);
  return data;
};

export const removeFromWishlist = async (courseId: string): Promise<any> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.from('wishlist').delete().match({ user_id: user.id, course_id: courseId });
  if (error) throw new Error(error.message);
};
