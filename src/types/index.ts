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

export interface AuthContextType {
  user: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
