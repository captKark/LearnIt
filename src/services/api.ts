import { supabase } from '../lib/supabaseClient';
import { Course, Order } from '../types';

// Course APIs
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase.from('courses').select('*').order('students', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data || undefined;
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
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  
  // Supabase returns course IDs, we need to fetch course details for each order
  // A better approach would be a view or function in Supabase, but this works for now.
  const populatedOrders = await Promise.all(
    (data || []).map(async (order) => {
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
