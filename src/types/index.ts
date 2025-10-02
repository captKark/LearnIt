export interface Course {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  students: number;
  features: string[];
  preview_video_url?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  is_admin: boolean;
}

export interface CartItem {
  course: Course;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  courses: Course[];
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface Review {
  id: string;
  created_at: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  profiles: { full_name: string }; // To get the user's name
}

export interface WishlistItem {
  id: string;
  course_id: string;
  user_id: string;
  courses: Course;
}

export interface AuthContextType {
  user: Profile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; isAdmin: boolean; }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error: string | null; requiresConfirmation: boolean; }>;
  logout: () => void;
  isLoading: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
