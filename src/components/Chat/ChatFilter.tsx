import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  FilterIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ChatMessage } from '../../types';

interface ChatFilterProps {
  onFilterChange: (filters: FilterCriteria) => void;
  senders?: { id: string; name: string }[];
  isLoading?: boolean;
  defaultFilters?: Partial<FilterCriteria>;
}

export interface FilterCriteria {
  dateRange: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'custom';
  customStartDate: Date | null;
  customEndDate: Date | null;
  messageType: 'all' | 'text' | 'image' | 'voice' | 'video' | 'file' | 'system';
  senderIds: string[];
  searchKeyword: string;
}

/**
 * 聊天过滤器组件 - 用于筛选聊天消息
 */
const ChatFilter: React.FC<ChatFilterProps> = ({
  onFilterChange,
  senders = [],
  isLoading = false,
  defaultFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  // Initialize filters with default values or provided defaults
  const [filters, setFilters] = useState<FilterCriteria>({
    dateRange: 'today',
    customStartDate: null,
    customEndDate: null,
    messageType: 'all',
    senderIds: [],
    searchKeyword: '',
    ...(defaultFilters || {})
  });

  // Date range options
  const dateRangeOptions = [
    { value: 'today', label: '今天' },
    { value: 'yesterday', label: '昨天' },
    { value: 'thisWeek', label: '本周' },
    { value: 'lastWeek', label: '上周' },
    { value: 'thisMonth', label: '本月' },
    { value: 'custom', label: '自定义' },
  ];

  // Message type options
  const messageTypeOptions = [
    { value: 'all', label: '全部类型' },
    { value: 'text', label: '文本' },
    { value: 'image', label: '图片' },
    { value: 'voice', label: '语音' },
    { value: 'video', label: '视频' },
    { value: 'file', label: '文件' },
    { value: 'system', label: '系统消息' },
  ];

  // Update filters and notify parent component
  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Handle date range changes
    if (key === 'dateRange') {
      setShowCustomDatePicker(value === 'custom');
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle custom date changes
  const handleCustomDateChange = (
    type: 'customStartDate' | 'customEndDate',
    dateStr: string
  ) => {
    const date = dateStr ? new Date(dateStr) : null;
    handleFilterChange(type, date);
  };

  // Handle sender selection
  const handleSenderToggle = (senderId: string) => {
    const currentSenders = [...filters.senderIds];
    const senderIndex = currentSenders.indexOf(senderId);
    
    if (senderIndex >= 0) {
      currentSenders.splice(senderIndex, 1);
    } else {
      currentSenders.push(senderId);
    }
    
    handleFilterChange('senderIds', currentSenders);
  };

  // Reset all filters
  const handleResetFilters = () => {
    const resetFilters: FilterCriteria = {
      dateRange: 'today',
      customStartDate: null,
      customEndDate: null,
      messageType: 'all',
      senderIds: [],
      searchKeyword: '',
    };
    
    setFilters(resetFilters);
    setShowCustomDatePicker(false);
    onFilterChange(resetFilters);
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    collapsed: { height: '56px', overflow: 'hidden' },
    expanded: { height: 'auto', overflow: 'visible' }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm mb-4 dark:bg-gray-800"
      variants={containerVariants}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ duration: 0.3 }}
    >
      {/* Search bar and expand toggle - always visible */}
      <div className="flex items-center p-3 border-b dark:border-gray-700">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索消息内容..."
            value={filters.searchKeyword}
            onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {filters.searchKeyword && (
            <button
              onClick={() => handleFilterChange('searchKeyword', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-3 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          aria-label={isExpanded ? '收起筛选器' : '展开筛选器'}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Expanded filters */}
      <div className="p-4 space-y-4">
        {/* Date range selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            时间范围
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white appearance-none"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {showCustomDatePicker && (
              <>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.customStartDate ? format(filters.customStartDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleCustomDateChange('customStartDate', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="date"
                    value={filters.customEndDate ? format(filters.customEndDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleCustomDateChange('customEndDate', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Message type filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            消息类型
          </label>
          <div className="flex flex-wrap gap-2">
            {messageTypeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('messageType', option.value)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  filters.messageType === option.value
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sender filter */}
        {senders.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              发送者
            </label>
            <div className="flex flex-wrap gap-2">
              {senders.map(sender => (
                <button
                  key={sender.id}
                  onClick={() => handleSenderToggle(sender.id)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    filters.senderIds.includes(sender.id)
                      ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {sender.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2 border-t dark:border-gray-700">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
          >
            重置
          </button>
          <button
            onClick={() => onFilterChange(filters)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                筛选中...
              </div>
            ) : "应用筛选"}
          </button>
        </div>
      </div>

      {/* Filter indicators */}
      {isExpanded && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {filters.dateRange !== 'today' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {dateRangeOptions.find(o => o.value === filters.dateRange)?.label || '时间范围'}
            </span>
          )}
          
          {filters.messageType !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {messageTypeOptions.find(o => o.value === filters.messageType)?.label || '消息类型'}
            </span>
          )}
          
          {filters.senderIds.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {filters.senderIds.length}个发送者
            </span>
          )}
          
          {filters.searchKeyword && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              关键词: {filters.searchKeyword}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChatFilter;
