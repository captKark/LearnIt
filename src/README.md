# SkillHunter - Modern EdTech eCommerce Platform with Supabase

A beautiful, responsive EdTech eCommerce platform built with React, TypeScript, and Tailwind CSS, powered by Supabase for the backend.

## 🚀 Features

- **Personalized Dashboard**: A unique homepage experience for logged-in users.
- **Full-Text Search**: Powerful course search functionality.
- **Advanced Course Pages**: Featuring video previews and tabbed layouts for syllabus, reviews, etc.
- **Wishlist & Reviews**: Users can save courses for later and leave reviews.
- **Admin Dashboard**: Full CRUD functionality for admins to manage courses.
- **Supabase Backend**: Handles database, authentication, and storage.

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Supabase (PostgreSQL Database, Auth)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Supabase Setup & Installation

This project requires a Supabase backend. Follow these steps to get it running.

### 1. Create a Supabase Project

- Go to [supabase.com](https://supabase.com) and create a new project.
- Once your project is created, navigate to the **Project Settings**.

### 2. Set Up Environment Variables

- In the root of this project, find the file named `.env`.
- In your Supabase project, go to **Settings > API**.
- Copy the **Project URL** and the **anon public key** and paste them into your `.env` file.

### 3. Set Up Database Schema

This is the most important step. The scripts below are used to manage your database schema.

---

### A) Full Reset Script (For First-Time Setup or Full Reset)

Use this script if your database is empty or you want to start completely fresh. **Warning: This will delete all existing data.**

```sql
-- === FULL RESET SCRIPT (ADVANCED FEATURES) ===

-- Drop trigger first to remove dependency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing tables and functions if they exist to ensure a clean slate
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.wishlist;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  is_admin boolean DEFAULT false
);
COMMENT ON TABLE public.profiles IS 'Stores public user profile information.';

-- 2. COURSES TABLE
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  thumbnail text,
  instructor text,
  duration text,
  lessons integer,
  level text CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category text,
  rating numeric(2, 1) DEFAULT 4.5,
  students integer DEFAULT 0,
  features text[],
  video_preview_url text,
  title_description_fts tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || description)) STORED
);
COMMENT ON TABLE public.courses IS 'Stores all course information.';

-- Create index for full-text search
CREATE INDEX courses_fts_idx ON public.courses USING GIN (title_description_fts);

-- 3. ORDERS TABLE
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric(10, 2) NOT NULL,
  status text CHECK (status IN ('pending', 'paid', 'cancelled')),
  course_ids uuid[]
);
COMMENT ON TABLE public.orders IS 'Stores user order information.';

-- 4. REVIEWS TABLE
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text
);
COMMENT ON TABLE public.reviews IS 'Stores user reviews for courses.';

-- 5. WISHLIST TABLE
CREATE TABLE public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);
COMMENT ON TABLE public.wishlist IS 'Stores user wishlisted courses.';

-- 6. FUNCTION TO CREATE A USER PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', COALESCE((new.raw_user_meta_data->>'is_admin')::boolean, false));
  RETURN new;
END;
$$;

-- 7. TRIGGER to execute the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. HELPER FUNCTION to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false)
$$;

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- 10. RLS POLICIES
-- Profiles
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to courses" ON public.courses FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Orders
CREATE POLICY "Allow users to view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow users to manage their own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Wishlist
CREATE POLICY "Allow users to manage their own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- 11. SEED DATA (Initial 6 Courses)
INSERT INTO public.courses (title, description, price, thumbnail, instructor, duration, lessons, level, category, rating, students, features, video_preview_url) VALUES
('Python for Beginners', 'Learn Python fundamentals and build basic projects.', 1499, 'https://images.pexels.com/photos/1181373/pexels-photo-1181373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Asif Mahmud', '10 hours', 30, 'Beginner', 'Programming & Development', 4.5, 5234, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Full-Stack Web Development', 'Master frontend and backend development with MERN stack.', 4999, 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Nadia Islam', '50 hours', 100, 'Intermediate', 'Web Development', 4.8, 12876, '{"Lifetime access", "Certificate of completion", "30-day money-back guarantee"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('React.js Complete Guide', 'Build dynamic and modern web applications with React from scratch.', 3499, 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fatima Akhter', '30 hours', 80, 'Intermediate', 'Web Development', 4.9, 18345, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Frontend with Tailwind CSS', 'Design beautiful, modern UIs with a utility-first CSS framework.', 1999, 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Jahid Hossain', '12 hours', 35, 'Beginner', 'Web Development', 4.8, 9543, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Machine Learning Basics', 'Learn basic ML concepts and build your first predictive models.', 3999, 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Farhan Ahmed', '25 hours', 60, 'Intermediate', 'Data & AI', 4.6, 8765, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('UI/UX Design Fundamentals', 'Learn to design user-friendly and beautiful applications.', 3499, 'https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Anika Tasnim', '22 hours', 55, 'Intermediate', 'Design & Creativity', 4.8, 11234, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

---

### B) Course Update Script (To Add 40 Courses)

To update your course catalog to the full 40 courses **without affecting your user data**, run the following script in your Supabase SQL Editor.

```sql
-- === COURSE UPDATE SCRIPT (40 COURSES) ===
-- This script is SAFE to run on an existing database.
-- It will only clear the 'courses' table and repopulate it.
-- Your 'profiles', 'orders', and other tables will NOT be affected.

-- Step 1: Clear existing courses to avoid duplicates
DELETE FROM public.courses;

-- Step 2: Insert the new, expanded list of 40 courses
INSERT INTO public.courses (title, description, price, thumbnail, instructor, duration, lessons, level, category, rating, students, features, video_preview_url) VALUES
-- Programming & Development (8 courses)
('Python for Beginners', 'Learn Python fundamentals from scratch and build your first basic applications and scripts.', 1499, 'https://images.pexels.com/photos/1181373/pexels-photo-1181373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Asif Mahmud', '10 hours', 30, 'Beginner', 'Programming & Development', 4.5, 5234, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Java Programming Masterclass', 'A comprehensive guide to Java, from fundamental concepts to advanced topics like multithreading and networking.', 3999, 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Rizwan Chowdhury', '45 hours', 110, 'Intermediate', 'Programming & Development', 4.7, 9870, '{"Lifetime access", "Certificate of completion", "30-day money-back guarantee"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('C++ Fundamentals', 'Master the basics of C++ for competitive programming, game development, and high-performance applications.', 2999, 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Sadia Rahman', '20 hours', 50, 'Beginner', 'Programming & Development', 4.6, 7500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Python Advanced Projects', 'Apply your Python skills to build complex, real-world projects including web scrapers, APIs, and automation tools.', 4499, 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Asif Mahmud', '35 hours', 40, 'Advanced', 'Programming & Development', 4.9, 4300, '{"Lifetime access", "Certificate of completion", "Source code included"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Mobile App Development with Flutter', 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.', 3999, 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Imran Khan', '40 hours', 90, 'Intermediate', 'Programming & Development', 4.8, 11500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Game Development with Unity', 'Learn C# and create your first 2D and 3D games with the powerful Unity engine.', 4999, 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Zoya Akhtar', '55 hours', 120, 'Intermediate', 'Programming & Development', 4.7, 9200, '{"Lifetime access", "Certificate of completion", "Game assets included"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Blockchain Basics', 'Understand the fundamentals of blockchain technology, cryptocurrencies, and smart contracts.', 2499, 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fahim Hasan', '8 hours', 25, 'Beginner', 'Programming & Development', 4.5, 6100, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Data Structures & Algorithms', 'Master essential DSA concepts to ace coding interviews and build efficient software.', 4999, 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Dr. Arifa Parvin', '50 hours', 150, 'Advanced', 'Programming & Development', 4.9, 21500, '{"Lifetime access", "Certificate of completion", "Interview questions"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Web Development (7 courses)
('Full-Stack Web Development', 'Master frontend and backend development with the MERN stack (MongoDB, Express, React, Node.js).', 4999, 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Nadia Islam', '50 hours', 100, 'Intermediate', 'Web Development', 4.8, 12876, '{"Lifetime access", "Certificate of completion", "30-day money-back guarantee"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('React.js Complete Guide', 'Build dynamic and modern web applications with React from scratch, including Hooks, Redux, and Next.js.', 3499, 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fatima Akhter', '30 hours', 80, 'Intermediate', 'Web Development', 4.9, 18345, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Frontend with Tailwind CSS', 'Design beautiful, modern UIs with a utility-first CSS framework and master responsive design.', 1999, 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Jahid Hossain', '12 hours', 35, 'Beginner', 'Web Development', 4.8, 9543, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('WordPress & CMS Development', 'Build custom themes and plugins for WordPress and manage content effectively for clients.', 2999, 'https://images.pexels.com/photos/113850/pexels-photo-113850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Maria Gomes', '18 hours', 45, 'Beginner', 'Web Development', 4.6, 6800, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Frontend React Advanced', 'Dive deep into advanced React patterns, performance optimization, and state management strategies.', 4999, 'https://images.pexels.com/photos/11035468/pexels-photo-11035468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fatima Akhter', '25 hours', 60, 'Advanced', 'Web Development', 4.9, 8100, '{"Lifetime access", "Certificate of completion", "Code reviews"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Web Performance & SEO Optimization', 'Learn to make your websites faster and rank higher on Google with modern optimization techniques.', 2499, 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Tanvir Hasan', '15 hours', 40, 'Intermediate', 'Web Development', 4.7, 5600, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('MERN Stack Projects', 'Build and deploy three complete MERN stack applications from scratch, including an e-commerce site.', 4499, 'https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Nadia Islam', '40 hours', 85, 'Advanced', 'Web Development', 4.8, 10200, '{"Lifetime access", "Certificate of completion", "Portfolio-ready projects"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Data & AI (6 courses)
('Machine Learning Basics', 'Learn basic ML concepts like regression and classification and build your first predictive models.', 3999, 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Farhan Ahmed', '25 hours', 60, 'Intermediate', 'Data & AI', 4.6, 8765, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Machine Learning Advanced', 'Explore advanced topics including ensemble methods, dimensionality reduction, and model deployment.', 4999, 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Farhan Ahmed', '30 hours', 70, 'Advanced', 'Data & AI', 4.8, 5400, '{"Lifetime access", "Certificate of completion", "Real-world datasets"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Deep Learning with TensorFlow', 'Build and train neural networks for computer vision and NLP using TensorFlow and Keras.', 4999, 'https://images.pexels.com/photos/5960649/pexels-photo-5960649.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Dr. Salma Khatun', '40 hours', 95, 'Advanced', 'Data & AI', 4.9, 7800, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Data Analysis with Python', 'Master data analysis and visualization with Pandas, NumPy, Matplotlib, and Seaborn.', 3499, 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Laila Begum', '28 hours', 75, 'Intermediate', 'Data & AI', 4.7, 13200, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('AI for Business', 'Learn how to leverage AI to solve business problems, improve efficiency, and drive growth, no coding required.', 2999, 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Kabir Hossain', '10 hours', 30, 'Beginner', 'Data & AI', 4.6, 4500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Cybersecurity Essentials', 'Understand the basics of cybersecurity, common threats, and how to protect digital assets.', 3999, 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Rezaul Karim', '20 hours', 50, 'Beginner', 'Data & AI', 4.8, 10500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Design & Creativity (5 courses)
('UI/UX Design Fundamentals', 'Learn the principles of user-centric design to create intuitive and beautiful applications.', 3499, 'https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Anika Tasnim', '22 hours', 55, 'Intermediate', 'Design & Creativity', 4.8, 11234, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Graphic Design with Photoshop', 'Master Adobe Photoshop for photo editing, graphic design, and digital art.', 2999, 'https://images.pexels.com/photos/1647919/pexels-photo-1647919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Sultan Mirza', '15 hours', 40, 'Beginner', 'Design & Creativity', 4.7, 8900, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Digital Illustration & Procreate', 'Learn to create stunning digital illustrations on your iPad with Procreate.', 2499, 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Ishrat Jahan', '18 hours', 50, 'Beginner', 'Design & Creativity', 4.8, 7200, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Photography Essentials', 'Master your camera settings, composition, and lighting to take breathtaking photos.', 1999, 'https://images.pexels.com/photos/368893/pexels-photo-368893.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Afsana Mimi', '10 hours', 30, 'Beginner', 'Design & Creativity', 4.9, 14500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Interior & Home Design Basics', 'Learn the fundamentals of interior design to create beautiful and functional living spaces.', 2999, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Farah Naz', '12 hours', 35, 'Beginner', 'Design & Creativity', 4.6, 5300, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Business & Marketing (4 courses)
('Digital Marketing Essentials', 'Learn SEO, social media marketing, and content strategy to grow an online business.', 3499, 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Hasan Mahmud', '20 hours', 60, 'Intermediate', 'Business & Marketing', 4.7, 15600, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Personal Finance & Investing', 'Master budgeting, saving, and investing strategies to build long-term wealth.', 1999, 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Sameer Ali', '8 hours', 25, 'Beginner', 'Business & Marketing', 4.9, 19800, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Entrepreneurship & Startup Strategies', 'Learn how to validate a business idea, create a business plan, and secure funding.', 3999, 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Nazia Sharmin', '15 hours', 40, 'Intermediate', 'Business & Marketing', 4.8, 8400, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Social Media Marketing Masterclass', 'Become an expert in Facebook, Instagram, and TikTok marketing to grow brands and drive sales.', 3499, 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Iqbal Karim', '22 hours', 65, 'Intermediate', 'Business & Marketing', 4.7, 11300, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Personal Development & Lifestyle (4 courses)
('Public Speaking Mastery', 'Overcome your fear of public speaking and deliver confident, persuasive presentations.', 1999, 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Ayman Sadiq', '10 hours', 30, 'Beginner', 'Personal Development & Lifestyle', 4.9, 22000, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Time Management & Productivity', 'Learn proven techniques to stop procrastinating, manage your time effectively, and get more done.', 1499, 'https://images.pexels.com/photos/313691/pexels-photo-313691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Sumaiya Zaman', '6 hours', 20, 'Beginner', 'Personal Development & Lifestyle', 4.8, 17500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Mindfulness & Stress Management', 'Reduce stress and anxiety with guided meditations and mindfulness practices.', 999, 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Shanti Barua', '5 hours', 15, 'Beginner', 'Personal Development & Lifestyle', 4.9, 14800, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Healthy Lifestyle & Fitness', 'Learn the fundamentals of nutrition and exercise to build a sustainable healthy lifestyle.', 1499, 'https://images.pexels.com/photos/40751/running-runner-long-distance-fitness-40751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Tariq Anam', '8 hours', 25, 'Beginner', 'Personal Development & Lifestyle', 4.7, 9900, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Writing & Literature (4 courses)
('Creative Writing Workshop', 'Unlock your creativity and learn the craft of writing fiction, poetry, and creative nonfiction.', 2499, 'https://images.pexels.com/photos/305821/pexels-photo-305821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Humayun Ahmed Jr.', '15 hours', 40, 'Intermediate', 'Writing & Literature', 4.8, 6500, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Storytelling Techniques', 'Master the art of storytelling to captivate audiences in your writing, presentations, and marketing.', 1999, 'https://images.pexels.com/photos/3358707/pexels-photo-3358707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Selina Hossain', '10 hours', 30, 'Beginner', 'Writing & Literature', 4.9, 8800, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Copywriting & Content Creation', 'Learn to write persuasive copy and engaging content that converts readers into customers.', 2999, 'https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Rashedul Islam', '12 hours', 35, 'Intermediate', 'Writing & Literature', 4.7, 10200, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Academic Writing Masterclass', 'Improve your research papers, theses, and academic articles with advanced writing strategies.', 3499, 'https://images.pexels.com/photos/261895/pexels-photo-261895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Dr. Yasmin Huq', '20 hours', 50, 'Advanced', 'Writing & Literature', 4.8, 4100, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),

-- Arts, Music & Miscellaneous (2 courses)
('Music Production Basics', 'Learn to produce your first tracks with Ableton Live, from beat making to mixing and mastering.', 3999, 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fuad Al Muqtadir', '25 hours', 60, 'Beginner', 'Arts, Music & Miscellaneous', 4.8, 7600, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Painting & Sketching Fundamentals', 'Master the basics of drawing, shading, and color theory with hands-on projects.', 1999, 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Zainul Abedin II', '15 hours', 40, 'Beginner', 'Arts, Music & Miscellaneous', 4.9, 9300, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

---

### 4. ⚠️ Creating Demo Users (CRITICAL STEP)

The demo credentials shown on the login page **will not work until you create them**.

1.  **Register the User Account**:
    -   Go to the **Sign Up** page in the application.
    -   Register a new user with the email `user@example.com` and password `user123`.
    -   **Confirm the email** by clicking the link sent to your inbox (if you have email confirmation enabled in Supabase).

2.  **Register the Admin Account**:
    -   Log out, then go back to the **Sign Up** page.
    -   Register another new user with the email `admin@example.com` and password `admin123`.
    -   **Confirm this email** as well.

3.  **Grant Admin Privileges**:
    -   Go to your **Supabase Dashboard**.
    -   Navigate to the **Table Editor** and open the `profiles` table.
    -   Find the row for `admin@example.com`.
    -   Click the `is_admin` cell, change it from `false` to `true`, and save.

Now your demo credentials will work perfectly, with the correct roles and redirection.

### 5. Local Development

1.  **Install dependencies**
    ```bash
    yarn install
    ```

2.  **Start development server**
    ```bash
    yarn dev
    ```

3.  **Open your browser** and navigate to the local URL provided.
