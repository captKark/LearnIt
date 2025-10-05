import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Heart, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from '../UI/GlobalSearch';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const menuItems = [
    { name: 'Courses', href: '/courses' },
    { name: 'Features', href: '/#features' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Manually handle smooth scrolling for hash links
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.substring(2); // remove '/#'
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; // Account for the sticky header height
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    // For mobile menu, close it after clicking a link
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side: Logo & Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-gray-900 font-poppins">SkillHunter.</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={({ isActive }) => 
                    `transition-colors duration-200 font-light ${
                      isActive && !item.href.includes('#') ? 'text-blue-600 font-normal' : 'text-gray-600 hover:text-blue-600'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden lg:flex flex-1 justify-center px-8">
            <GlobalSearch />
          </div>

          {/* Right side: Auth & Cart */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/wishlist" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Heart className="w-6 h-6" />
                </Link>
                <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-700" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.full_name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                      >
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Courses
                        </Link>
                        {user.is_admin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <Settings className="w-4 h-4" />
                              <span>Admin</span>
                            </div>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#396afc] to-[#2948ff] rounded-lg hover:shadow-lg transition-shadow"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="lg:hidden mb-4 px-4">
                <GlobalSearch />
              </div>
              <div className="flex flex-col space-y-4 px-4">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={({ isActive }) => 
                      `font-light transition-colors duration-200 ${
                        isActive && !item.href.includes('#') ? 'text-blue-600 font-normal' : 'text-gray-600 hover:text-blue-600'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {!user && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="text-white bg-gradient-to-r from-[#396afc] to-[#2948ff] px-4 py-2 rounded-md hover:shadow-lg font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
