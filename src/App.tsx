import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ChatSummary from './pages/ChatSummary';
import Settings from './pages/Settings';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AnimatePresence } from 'framer-motion';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">加载中...</p>
              </div>
            </div>
          ) : (
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/summary" element={<ChatSummary />} />
                <Route path="/settings" element={<Settings />} />
                {/* Add more routes as needed */}
                <Route path="*" element={
                  <div className="flex h-full flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-gray-800">404</h1>
                    <p className="mt-2 text-lg text-gray-600">页面不存在</p>
                  </div>
                } />
              </Routes>
            </MainLayout>
          )}
        </AnimatePresence>
      </Router>
    </QueryClientProvider>
  );
}

export default App;