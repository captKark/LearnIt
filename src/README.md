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

This is the most important step. Run the script below in your Supabase SQL Editor to create all necessary tables and functions.

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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 11. SEED DATA (Insert sample courses)
INSERT INTO public.courses (title, description, price, thumbnail, instructor, duration, lessons, level, category, rating, students, features, video_preview_url) VALUES
('Python for Beginners', 'Learn Python fundamentals and build basic projects.', 1499, 'https://images.pexels.com/photos/1181373/pexels-photo-1181373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Asif Mahmud', '10 hours', 30, 'Beginner', 'Programming & Development', 4.5, 5234, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Full-Stack Web Development', 'Master frontend and backend development with MERN stack.', 4999, 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Nadia Islam', '50 hours', 100, 'Intermediate', 'Web Development', 4.8, 12876, '{"Lifetime access", "Certificate of completion", "30-day money-back guarantee"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('React.js Complete Guide', 'Build dynamic and modern web applications with React from scratch.', 3499, 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fatima Akhter', '30 hours', 80, 'Intermediate', 'Web Development', 4.9, 18345, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Frontend with Tailwind CSS', 'Design beautiful, modern UIs with a utility-first CSS framework.', 1999, 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Jahid Hossain', '12 hours', 35, 'Beginner', 'Web Development', 4.8, 9543, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('Machine Learning Basics', 'Learn basic ML concepts and build your first predictive models.', 3999, 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Farhan Ahmed', '25 hours', 60, 'Intermediate', 'Data & AI', 4.6, 8765, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('UI/UX Design Fundamentals', 'Learn to design user-friendly and beautiful applications.', 3499, 'https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Anika Tasnim', '22 hours', 55, 'Intermediate', 'Design & Creativity', 4.8, 11234, '{"Lifetime access", "Certificate of completion"}', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
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
