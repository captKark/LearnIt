import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, BookOpen, Award, Infinity, MessageCircle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import CourseCard from '../components/UI/CourseCard';
import { getCourses } from '../services/api';
import { Course } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import TestimonialSlider from '../components/UI/TestimonialSlider';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const categories = useMemo(() => ['All', ...Array.from(new Set(featuredCourses.map(course => course.category)))], [featuredCourses]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setIsLoading(true);
        const allCourses = await getCourses();
        const sortedCourses = allCourses.sort((a, b) => (b.students || 0) - (a.students || 0));
        setFeaturedCourses(sortedCourses);
      } catch (error) {
        console.error("Failed to fetch featured courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedCourses();
  }, []);

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

  const renderGuestView = () => (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-poppins font-extrabold text-gray-900 leading-tight mb-6">
                Learn Without
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Limits
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover thousands of courses from expert instructors. Build skills, 
                advance your career, and transform your life with our comprehensive learning platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <Link
                      to="/courses"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                      Explore Courses
                      <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <button
                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300"
                  >
                      <Play className="mr-2 w-5 h-5 text-blue-600" />
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
                  src="https://images.pexels.com/photos/6347974/pexels-photo-6347974.jpeg?_gl=1*ojfwik*_ga*MTkxMTc2NTg0LjE3NTkxNTMyOTY.*_ga_8JE65Q40S6*czE3NTkzMTQ4NjYkbzIkZzEkdDE3NTkzMTY3MDQkajkkbDAkaDA."
                  alt="A satisfied Bangladeshi student learning online with a laptop"
                  className="rounded-2xl shadow-2xl w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );

  const renderUserDashboard = () => (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-poppins font-extrabold text-gray-900 leading-tight mb-4">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.full_name}!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">Let's continue your learning journey.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <Link to={`/courses?category=${cat}`} className="text-gray-600 hover:text-blue-600 transition-colors">{cat}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h2>
            {isLoading ? (
              <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredCourses.slice(0, 4).map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      {user ? renderUserDashboard() : renderGuestView()}

      {/* Common Sections */}
      {!user && (
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {user ? "Courses You Might Like" : "Featured Courses"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses from expert instructors
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.slice(0, 6).map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold"
            >
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      <TestimonialSlider />

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
              Why Choose LearnIt?
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
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center items-center mb-4">
                   <feature.icon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
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
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
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
