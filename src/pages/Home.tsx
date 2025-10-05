import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, BookOpen, Award, Infinity, MessageCircle, GraduationCap, Search, Menu as MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import CourseCard from '../components/UI/CourseCard';
import { getCourses } from '../services/api';
import { Course } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import TestimonialSlider from '../components/UI/TestimonialSlider';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getCourses();
        setAllCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCourses();
  }, []);

  const featuredCourses = useMemo(() => {
    return [...allCourses].sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 6);
  }, [allCourses]);

  const recommendedCourses = useMemo(() => {
    return [...allCourses].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  }, [allCourses]);

  const categories = useMemo(() => {
    const cats = [...new Set(allCourses.map(c => c.category))];
    return cats.slice(0, 8);
  }, [allCourses]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stats = [
    { icon: Users, label: 'Students', value: '50,000+' },
    { icon: BookOpen, label: 'Courses', value: '40+' },
    { icon: Award, label: 'Certificates', value: '30,000+' },
    { icon: Star, label: 'Rating', value: '4.8' },
  ];

  const features = [
    { title: 'Expert Instructors', description: 'Learn from industry professionals with years of experience.', icon: GraduationCap },
    { title: 'Lifetime Access', description: 'Access your purchased courses anytime, anywhere, forever.', icon: Infinity },
    { title: 'Certificate', description: 'Get certified upon course completion to boost your career.', icon: Award },
    { title: 'Community', description: 'Join our vibrant community of learners and experts.', icon: MessageCircle }
  ];

  const renderGuestHomepage = () => (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-poppins font-extrabold text-gray-800 leading-tight mb-6">
                Hunt the 
                <span className="bg-gradient-to-r from-[#396afc] to-[#2948ff] bg-clip-text text-transparent">
                  {' '}Skills
                </span>
								<br />
								Own the 
                <span className="bg-gradient-to-r from-[#396afc] to-[#2948ff] bg-clip-text text-transparent">
                  {' '}Future
                </span>
              </h1>
              <p className="text-l text-gray-500 mb-8 leading-relaxed">
                Discover thousands of courses from expert instructors. Build skills, 
                advance your career, and transform your life with our comprehensive learning platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <Link
                      to="/courses"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                      Explore Courses
                      <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <button
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300"
                  >
                      <Play className="mr-2 w-5 h-5 text-gray-800" />
                      Watch Demo
                  </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center items-center h-full"
            >
              <div className="relative z-10 w-full h-full">
                <img
                  src="https://images.pexels.com/photos/34175826/pexels-photo-34175826.png?_gl=1*1l9nd99*_ga*MTkxMTc2NTg0LjE3NTkxNTMyOTY.*_ga_8JE65Q40S6*czE3NTk2ODMwNjckbzYkZzEkdDE3NTk2ODMyMzYkajQ3JGwwJGgw"
                  alt="A satisfied Bangladeshi student learning online with a laptop"
                  className="rounded-2xl shadow-2xl w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 text-center flex flex-col items-center justify-center transition-all duration-300 hover:bg-gradient-to-r from-[#396afc] to-[#2948ff]"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                  <stat.icon className="w-10 h-10 text-blue-600 transition-all duration-300 group-hover:text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-white">{stat.value}</div>
                <div className="text-lg text-gray-600 transition-colors duration-300 group-hover:text-white">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses from expert instructors
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 font-semibold"
            >
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>
    </>
  );

  const renderUserDashboard = () => (
    <div className="flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-white p-6 border-r border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <nav className="space-y-2">
          {categories.map(cat => (
            <Link key={cat} to={`/courses?category=${cat}`} className="flex items-center p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              {cat}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, <span className="bg-gradient-to-r from-[#396afc] to-[#2948ff] bg-clip-text text-transparent">{user?.full_name}!</span></h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Featured Courses Carousel */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? <LoadingSpinner /> : featuredCourses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        </div>

        {/* Recommended For You Carousel */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? <LoadingSpinner /> : recommendedCourses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      {user ? renderUserDashboard() : renderGuestHomepage()}

      <motion.section 
        id="about"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">About SkillHunter</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                Founded in 2023, SkillHunter started with a simple idea: to bridge the skills gap in the modern workforce. We believe learning is a lifelong journey and are committed to empowering individuals to achieve their personal and professional goals.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                We create a platform that not only teaches relevant, in-demand skills but also fosters a community of lifelong learners where students and instructors connect, share knowledge, and grow together.
              </p>
               <Link
                to="/about"
                className="inline-flex items-center mt-8 px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 font-semibold"
              >
                Learn More About Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Team working together" className="rounded-xl shadow-lg relative z-10" />
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        id="features"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Why Choose SkillHunter?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#396afc] to-[#2948ff] rounded-full mb-4">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <TestimonialSlider />

      <motion.section 
        variants={sectionVariants}
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-[#396afc] to-[#2948ff]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already transforming their careers
          </p>
          <div>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
