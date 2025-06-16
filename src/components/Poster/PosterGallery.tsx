import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  TrashIcon,
  ShareIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface PosterItem {
  id: string;
  imageUrl: string;
  title: string;
  createdAt: Date;
  groupId: string;
  groupName: string;
  summaryId: string;
  status: 'completed' | 'failed';
  templateId: string;
}

interface PosterGalleryProps {
  posters?: PosterItem[];
  isLoading?: boolean;
  onDownload?: (posterId: string) => void;
  onDelete?: (posterId: string) => void;
  onShare?: (posterId: string) => void;
}

const PosterGallery: React.FC<PosterGalleryProps> = ({
  posters = [],
  isLoading = false,
  onDownload,
  onDelete,
  onShare
}) => {
  const [selectedPosterId, setSelectedPosterId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosters, setFilteredPosters] = useState<PosterItem[]>(posters);
  const [currentPage, setCurrentPage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<string | null>(null);
  
  const postersPerPage = 9;
  
  // Filter posters based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosters(posters);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = posters.filter(
        poster => 
          poster.title.toLowerCase().includes(lowerCaseSearch) || 
          poster.groupName.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredPosters(filtered);
    }
    setCurrentPage(0); // Reset to first page when filtering
  }, [searchTerm, posters]);
  
  // Handle poster selection
  const handlePosterClick = (poster: PosterItem) => {
    setSelectedPoster(poster);
    setLightboxOpen(true);
  };
  
  // Handle lightbox navigation
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedPoster) return;
    
    const currentIndex = filteredPosters.findIndex(p => p.id === selectedPoster.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPosters.length - 1;
    } else {
      newIndex = currentIndex < filteredPosters.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedPoster(filteredPosters[newIndex]);
  };
  
  // Handle poster download
  const handleDownload = (posterId: string) => {
    if (onDownload) {
      onDownload(posterId);
    } else {
      // Fallback direct download implementation
      const poster = posters.find(p => p.id === posterId);
      if (poster && poster.imageUrl) {
        const link = document.createElement('a');
        link.href = poster.imageUrl;
        link.download = `poster-${poster.title.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  
  // Toggle action menu for a poster
  const toggleActionMenu = (posterId: string) => {
    setIsActionMenuOpen(prev => prev === posterId ? null : posterId);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPosters.length / postersPerPage);
  const paginatedPosters = filteredPosters.slice(
    currentPage * postersPerPage, 
    (currentPage + 1) * postersPerPage
  );
  
  // Poster grid items animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const posterVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (posters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <PhotoIcon className="h-20 w-20 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">暂无海报</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          使用海报生成器创建精美海报
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
      {/* Gallery header */}
      <div className="border-b dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            海报画廊
          </h2>
          
          {/* Search input */}
          <div className="mt-3 sm:mt-0 relative max-w-xs">
            <input
              type="text"
              placeholder="搜索海报..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            共 {filteredPosters.length} 张海报
          </p>
          
          {/* Additional filters could be added here */}
        </div>
      </div>
      
      {/* Poster grid */}
      <div className="p-6">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          {paginatedPosters.map((poster) => (
            <motion.div
              key={poster.id}
              className="relative group"
              variants={posterVariants}
            >
              {/* Poster card */}
              <div 
                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-700 cursor-pointer"
                onClick={() => handlePosterClick(poster)}
              >
                <div className="relative aspect-[3/4]">
                  <img 
                    src={poster.imageUrl} 
                    alt={poster.title}
                    className="w-full h-full object-contain bg-white dark:bg-gray-800"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3 text-white w-full">
                      <h3 className="text-sm font-medium truncate">
                        {poster.title}
                      </h3>
                      <p className="text-xs opacity-80">
                        {format(new Date(poster.createdAt), 'yyyy-MM-dd HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {poster.groupName}
                    </span>
                    
                    {/* Status badge */}
                    {poster.status === 'completed' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        完成
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        <XMarkIcon className="h-3 w-3 mr-1" />
                        失败
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActionMenu(poster.id);
                    }}
                    className="bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  
                  {/* Action menu dropdown */}
                  {isActionMenuOpen === poster.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(poster.id);
                            setIsActionMenuOpen(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          下载
                        </button>
                        
                        {onShare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(poster.id);
                              setIsActionMenuOpen(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <ShareIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            分享
                          </button>
                        )}
                        
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(poster.id);
                              setIsActionMenuOpen(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 dark:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            删除
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === i
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Lightbox for poster preview */}
      <AnimatePresence>
        {lightboxOpen && selectedPoster && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full p-4">
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                onClick={() => setLightboxOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              {/* Navigation buttons */}
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
              
              {/* Poster image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg overflow-hidden shadow-xl max-h-[80vh] flex flex-col dark:bg-gray-800"
              >
                <div className="flex-grow overflow-auto">
                  <img 
                    src={selectedPoster.imageUrl} 
                    alt={selectedPoster.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Poster info and actions */}
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {selectedPoster.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPoster.groupName} · {format(new Date(selectedPoster.createdAt), 'yyyy-MM-dd HH:mm')}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(selectedPoster.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        下载
                      </button>
                      
                      {onShare && (
                        <button
                          onClick={() => onShare(selectedPoster.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                          <ShareIcon className="h-4 w-4 mr-1" />
                          分享
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PosterGallery;
