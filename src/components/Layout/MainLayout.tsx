import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChatBubbleBottomCenterTextIcon, 
  Cog6ToothIcon,
  DocumentTextIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// Type definition for MainLayout props
interface MainLayoutProps {
  children: React.ReactNode;
}

// Navigation items configuration
const navigationItems = [
  { name: '首页', href: '/', icon: HomeIcon },
  { name: '聊天总结', href: '/summary', icon: ChatBubbleBottomCenterTextIcon },
  { name: '海报生成', href: '/posters', icon: DocumentTextIcon },
  { name: '设置', href: '/settings', icon: Cog6ToothIcon },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <motion.aside 
        className={`hidden md:flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'} h-full bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 ease-in-out`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              微信群聊总结
            </h1>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            aria-label={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {isSidebarCollapsed ? (
              <Bars3Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className={`${isSidebarCollapsed ? 'w-7 h-7 mx-auto' : 'w-5 h-5 mr-3'}`} />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom of sidebar */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">用户名</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">查看个人资料</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <motion.aside 
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-white dark:bg-gray-800 md:hidden transition-transform transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: -300 }}
        animate={{ x: isMobileMenuOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            微信群聊总结
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="px-2 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <div className="flex items-center">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">用户名</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">查看个人资料</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className={`bg-white dark:bg-gray-800 shadow-sm z-10 ${
          isScrolled ? 'sticky top-0 border-b dark:border-gray-700' : ''
        }`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {/* Right side of navbar */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    placeholder="搜索..."
                    className="w-64 py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>

                {/* Notifications */}
                <button
                  className="p-2 text-gray-500 rounded-full hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                  aria-label="通知"
                >
                  <BellIcon className="w-6 h-6" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main 
          className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;
