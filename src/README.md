# LearnIt - Modern EdTech eCommerce Platform with Supabase

A beautiful, responsive EdTech eCommerce platform built with React, TypeScript, and Tailwind CSS, powered by Supabase for the backend.

## 🚀 Features

- **Real Backend**: Fully integrated with Supabase for database and authentication.
- **Course Marketplace**: Browse and discover courses with advanced filtering.
- **Secure User Authentication**: Register, login, and logout functionality powered by Supabase Auth.
- **Shopping Cart**: Add/remove courses with persistent cart state in local storage.
- **Real Orders**: Checkout flow creates real orders in the Supabase database.
- **User Dashboard**: View your order history fetched from the database.
- **Admin Role**: Support for an admin role to manage content (UI for admin dashboard is a next step).
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop.

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Backend**: Supabase (PostgreSQL Database, Auth)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Supabase Setup & Installation

This project requires a Supabase backend. Follow these steps to get it running.

### 1. Create a Supabase Project

- Go to [supabase.com](https://supabase.com) and create a new project.
- Once your project is created, navigate to the **Project Settings**.

### 2. Set Up Environment Variables

- In the root of this project, create a new file named `.env`.
- Copy the content below into your `.env` file:
  ```
  VITE_SUPABASE_URL=YOUR_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
  ```
- In your Supabase project, go to **Settings > API**.
- Copy the **Project URL** and the **anon public key** and paste them into your `.env` file.

### 3. Set Up Database Schema

- Go to the **SQL Editor** in your Supabase dashboard.
- Click **+ New query**.
- Copy the entire content of the SQL script below and paste it into the SQL Editor.
- Click **Run** to create your database tables and seed them with data.

```sql
-- 1. COURSES TABLE
-- This table stores all the course information.
create table courses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  price numeric(10, 2) not null,
  thumbnail text,
  instructor text,
  duration text,
  lessons integer,
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')),
  category text,
  rating numeric(2, 1),
  students integer,
  features text[]
);

-- 2. PROFILES TABLE
-- This table stores user profile data and is linked to the auth.users table.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean default false
);

-- 3. ORDERS TABLE
-- This table stores order information.
create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  total numeric(10, 2) not null,
  status text check (status in ('pending', 'paid', 'cancelled')),
  course_ids uuid[]
);

-- 4. FUNCTION TO CREATE A USER PROFILE ON SIGNUP
-- This function is triggered automatically when a new user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- 5. TRIGGER to execute the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- Important for security. This ensures users can only access their own data.
alter table profiles enable row level security;
alter table courses enable row level security;
alter table orders enable row level security;

-- 7. RLS POLICIES
-- Allow public read access to courses
create policy "Allow public read access to courses" on courses for select using (true);

-- Allow users to view their own profile
create policy "Allow users to view their own profile" on profiles for select using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Allow users to update their own profile" on profiles for update using (auth.uid() = id);

-- Allow users to view their own orders
create policy "Allow users to view their own orders" on orders for select using (auth.uid() = user_id);

-- Allow users to create orders
create policy "Allow users to create orders" on orders for insert with check (auth.uid() = user_id);

-- 8. SEED DATA (Sample Courses)
-- Insert sample courses into the courses table.
INSERT INTO public.courses (title, description, price, thumbnail, instructor, duration, lessons, level, category, rating, students, features)
VALUES
('Python for Beginners', 'Learn Python fundamentals and basic projects.', 49.99, 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'John Smith', '10 hours', 30, 'Beginner', 'Programming & Development', 4.5, 5234, '{"Lifetime access", "Certificate of completion"}'),
('Full-Stack Web Development', 'Frontend + backend fundamentals.', 199.99, 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Jane Doe', '50 hours', 100, 'Intermediate', 'Programming & Development', 4.8, 12876, '{"Lifetime access", "Certificate of completion", "30-day money-back guarantee"}'),
('React.js Basics', 'Build dynamic web apps with React.', 99.99, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Emily White', '15 hours', 45, 'Beginner', 'Web Development', 4.9, 18345, '{"Lifetime access", "Certificate of completion"}'),
('Data Structures & Algorithms', 'Key CS concepts for coding interviews.', 149.99, 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Chris Green', '35 hours', 70, 'Advanced', 'Data & AI', 4.7, 9876, '{"Lifetime access", "Certificate of completion"}'),
('UI/UX Design Fundamentals', 'Designing user-friendly apps.', 109.99, 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Sarah Brown', '22 hours', 55, 'Intermediate', 'Design & Creativity', 4.8, 11234, '{"Lifetime access", "Certificate of completion"}'),
('Digital Marketing Fundamentals', 'Social media, SEO, and Ads.', 89.99, 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Michael Black', '18 hours', 40, 'Beginner', 'Business & Management', 4.6, 8765, '{"Lifetime access", "Certificate of completion"}');

```

### 4. Local Development

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Start development server**
   ```bash
   yarn dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port Vite is using).
   - You should now be able to sign up, log in, and see the courses from your Supabase database!

## 🚀 Deployment

You can deploy this frontend application to any static hosting provider like Vercel or Netlify.

1. **Connect your GitHub repository** to Vercel/Netlify.
2. **Configure build settings**:
   - Build Command: `yarn build`
   - Output Directory: `dist`
3. **Add Environment Variables**:
   - In your Vercel/Netlify project settings, add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your `.env` file.
4. **Deploy**.
