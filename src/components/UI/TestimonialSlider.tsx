import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Anika Tabassum',
    title: 'Software Engineer, Nagad',
    image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    quote: "LearnIt's Full-Stack course was a game-changer for my career. The hands-on projects and expert instructors gave me the confidence to land my dream job.",
  },
  {
    name: 'Rahim Ahmed',
    title: 'Data Scientist, bKash',
    image: 'https://images.pexels.com/photos/5439473/pexels-photo-5439473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    quote: 'The Data Science with Python course is incredibly comprehensive. I went from a complete beginner to being able to analyze complex datasets effectively.',
  },
  {
    name: 'Fatima Khan',
    title: 'UX Designer, Pathao',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    quote: "I highly recommend the UI/UX Design Fundamentals course. It provided a solid foundation and a portfolio piece that helped me transition into a design role.",
  },
];

const TestimonialSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    } else {
      setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 py-28"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">What Our Students Say</h2>
          <p className="text-xl text-gray-600">Real stories from learners who have transformed their careers with LearnIt.</p>
        </div>
        <div className="relative h-[26rem] flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              className="absolute w-full max-w-2xl"
            >
              <div className="relative bg-white pt-24 p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                   <img
                    src={testimonials[index].image}
                    alt={testimonials[index].name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <p className="text-gray-700 text-lg italic mb-6">"{testimonials[index].quote}"</p>
                <h3 className="font-bold text-gray-900 text-lg">{testimonials[index].name}</h3>
                <p className="text-sm text-gray-500">{testimonials[index].title}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-3 shadow-md transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-3 shadow-md transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialSlider;
