import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Star, Linkedin, Twitter } from 'lucide-react';

const About: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stats = [
    { icon: Users, label: 'Active Students', value: '50,000+' },
    { icon: BookOpen, label: 'Online Courses', value: '40+' },
    { icon: Award, label: 'Certificates Issued', value: '30,000+' },
    { icon: Star, label: 'Average Rating', value: '4.8/5' },
  ];

  const team = [
    { name: 'John Doe', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Jane Smith', role: 'Head of Curriculum', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Mike Johnson', role: 'Lead Engineer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Emily White', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4"
          >
            Our Mission
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            To make high-quality education accessible to everyone, everywhere. We believe learning is a lifelong journey and are committed to empowering individuals to achieve their personal and professional goals.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20"
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#396afc] to-[#2948ff] rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">The SkillHunter Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2023, SkillHunter started with a simple idea: to bridge the skills gap in the modern workforce. Our founders, a group of passionate educators and tech enthusiasts, noticed that traditional education often struggled to keep pace with the rapidly evolving industry demands.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We set out to create a platform that not only teaches relevant, in-demand skills but also fosters a community of lifelong learners. Today, SkillHunter is a thriving ecosystem where students and instructors connect, share knowledge, and grow together.
              </p>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Team working together" className="rounded-xl shadow-lg relative z-10" />
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The passionate individuals dedicated to revolutionizing online learning.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md" />
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-700 font-medium">{member.role}</p>
                <div className="flex justify-center space-x-3 mt-3">
                  <a href="#" className="text-gray-400 hover:text-blue-700"><Linkedin size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-blue-700"><Twitter size={20} /></a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gray-900"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8">Ready to start your learning journey? Explore our courses and find your passion.</p>
          <Link
            to="/courses"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white rounded-lg hover:shadow-lg transition-shadow font-semibold"
          >
            Explore Courses
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
