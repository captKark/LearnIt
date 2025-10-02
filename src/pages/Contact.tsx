import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Chatbot from '../components/UI/Chatbot';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    // Simulate API call
    setTimeout(() => {
      // Simulate a random success/error for demo purposes
      if (Math.random() > 0.1) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email Us', content: 'support@learnit.com', href: 'mailto:support@learnit.com' },
    { icon: Phone, title: 'Call Us', content: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, title: 'Visit Us', content: '123 Learning Lane, Education City, 12345', href: '#' },
  ];

  const faqs = [
    { q: 'How do I enroll in a course?', a: 'Simply navigate to the course you want, click "Add to Cart", and proceed to checkout. Once purchased, the course will be available in your "My Orders" section.' },
    { q: 'What is your refund policy?', a: 'We offer a 30-day money-back guarantee on all our courses. If you are not satisfied, you can request a full refund within 30 days of purchase.' },
    { q: 'Do I get a certificate upon completion?', a: 'Yes, all our courses come with a certificate of completion that you can add to your resume or LinkedIn profile.' },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We'd love to hear from you! Whether you have a question about our courses, pricing, or anything else, our team is ready to answer all your questions.
          </motion.p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-8">
                {contactInfo.map(item => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <a href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors">{item.content}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg" required></textarea>
                </div>
                <div>
                  <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {isSubmitting ? <LoadingSpinner size="sm" /> : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
                  </button>
                </div>
                {submitStatus === 'success' && <p className="text-green-600">Message sent successfully! We'll get back to you soon.</p>}
                {submitStatus === 'error' && <p className="text-red-600">Something went wrong. Please try again.</p>}
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="p-6 bg-white rounded-lg border border-gray-100 group" open={index === 0}>
                <summary className="font-semibold cursor-pointer flex justify-between items-center">
                  {faq.q}
                  <span className="transform transition-transform duration-200 group-open:rotate-180">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>
      <Chatbot />
    </div>
  );
};

export default Contact;
