import React, { useEffect, useState } from 'react';
import { BookOpen, Users, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourses } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const courses = await getCourses();
      setTotalCourses(courses.length);
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Courses', value: totalCourses, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Total Users', value: '125', icon: Users, color: 'bg-green-500' },
    { title: 'Monthly Sales', value: '৳1,25,000', icon: BarChart, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full text-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h2>
        <p className="text-gray-600">
          From this dashboard, you can manage courses, view users, and monitor sales. Use the navigation on the left to get started.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
