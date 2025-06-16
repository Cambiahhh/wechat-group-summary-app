import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  ChevronDownIcon,
  XMarkIcon,
  TrashIcon,
  ArchiveBoxIcon,
  EllipsisVerticalIcon,
  FolderArrowDownIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChatSummary } from '../../types';

interface SummaryHistoryProps {
  summaries: ChatSummary[];
  isLoading?: boolean;
  onSelectSummary?: (summary: ChatSummary) => void;
  onDeleteSummary?: (summaryId: string) => void;
  onArchiveSummary?: (summaryId: string) => void;
  onExportSummary?: (summaryId: string) => void;
}

/**
 * 总结历史组件 - 用于显示和管理历史总结记录
 */
const SummaryHistory: React.FC<SummaryHistoryProps> = ({
  summaries,
  isLoading = false,
  onSelectSummary,
  onDeleteSummary,
  onArchiveSummary,
  onExportSummary
}) => {
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'thisWeek' | 'thisMonth' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [filteredSummaries, setFilteredSummaries] = useState<ChatSummary[]>(summaries);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Date filter options
  const dateFilterOptions = [
    { value: 'all', label: '所有时间' },
    { value: 'today', label: '今天' },
    { value: 'thisWeek', label: '本周' },
    { value: 'thisMonth', label: '本月' },
    { value: 'custom', label: '自定义时间' },
  ];

  // Apply filters when dependencies change
  useEffect(() => {
    if (isLoading) return;

    let filtered = [...summaries];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(summary => 
        summary.title.toLowerCase().includes(term) || 
        summary.content.toLowerCase().includes(term) ||
        summary.groupName.toLowerCase().includes(term)
      );
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (dateFilter === 'today') {
        filtered = filtered.filter(summary => 
          summary.generatedAt >= todayStart
        );
      } else if (dateFilter === 'thisWeek') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Start of week (Monday)
        weekStart.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(summary => 
          summary.generatedAt >= weekStart
        );
      } else if (dateFilter === 'thisMonth') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        filtered = filtered.filter(summary => 
          summary.generatedAt >= monthStart
        );
      } else if (dateFilter === 'custom' && customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        
        let end;
        if (customEndDate) {
          end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
        } else {
          end = new Date();
        }
        
        filtered = filtered.filter(summary => 
          summary.generatedAt >= start && summary.generatedAt <= end
        );
      }
    }

    // Sort by date, newest first
    filtered.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
    
    setFilteredSummaries(filtered);
  }, [summaries, searchTerm, dateFilter, customStartDate, customEndDate, isLoading]);

  // Handle date filter change
  const handleDateFilterChange = (value: 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'custom') => {
    setDateFilter(value);
    setShowCustomDatePicker(value === 'custom');
  };

  // Handle summary selection
  const handleSelectSummary = (summary: ChatSummary) => {
    if (onSelectSummary) {
      onSelectSummary(summary);
    }
    setSelectedSummary(summary.id);
  };

  // Toggle action menu for a summary
  const toggleActionMenu = (summaryId: string) => {
    if (actionMenuOpen === summaryId) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(summaryId);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    setCustomStartDate(null);
    setCustomEndDate(null);
    setShowCustomDatePicker(false);
  };

  // Format date for display
  const formatDateDisplay = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `今天 ${format(date, 'HH:mm')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 h-full flex flex-col">
      <div className="border-b dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">总结历史</h2>
        
        {/* Search input */}
        <div className="relative mb-3">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索总结..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Filter options */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value as any)}
              className="appearance-none pl-3 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {dateFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {showCustomDatePicker && (
            <>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  placeholder="开始日期"
                  value={customStartDate ? format(customStartDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setCustomStartDate(e.target.value ? new Date(e.target.value) : null)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <span className="text-gray-500 dark:text-gray-400">至</span>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  placeholder="结束日期"
                  value={customEndDate ? format(customEndDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setCustomEndDate(e.target.value ? new Date(e.target.value) : null)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}
          
          {(searchTerm || dateFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              重置
            </button>
          )}
        </div>
      </div>
      
      {/* Summary list */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 dark:bg-gray-700">
              <ArchiveBoxIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || dateFilter !== 'all' 
                ? '没有找到匹配的总结记录' 
                : '暂无总结历史记录'}
            </p>
          </div>
        ) : (
          <motion.ul
            className="divide-y dark:divide-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredSummaries.map((summary) => (
              <motion.li
                key={summary.id}
                className={`relative p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer ${
                  selectedSummary === summary.id ? 'bg-gray-50 dark:bg-gray-750' : ''
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleSelectSummary(summary)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-white truncate pr-10">
                    {summary.title}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionMenu(summary.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                    
                    {/* Action menu */}
                    {actionMenuOpen === summary.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 dark:bg-gray-700">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          {onExportSummary && (
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onExportSummary(summary.id);
                                setActionMenuOpen(null);
                              }}
                            >
                              <FolderArrowDownIcon className="h-4 w-4 mr-3 text-gray-400" />
                              导出总结
                            </button>
                          )}
                          {onArchiveSummary && (
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onArchiveSummary(summary.id);
                                setActionMenuOpen(null);
                              }}
                            >
                              <ArchiveBoxIcon className="h-4 w-4 mr-3 text-gray-400" />
                              归档
                            </button>
                          )}
                          {onDeleteSummary && (
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSummary(summary.id);
                                setActionMenuOpen(null);
                              }}
                            >
                              <TrashIcon className="h-4 w-4 mr-3 text-red-500" />
                              删除
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {summary.content.substring(0, 120)}...
                </div>
                
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-500 space-x-3">
                  <span>{formatDateDisplay(summary.generatedAt)}</span>
                  <span>·</span>
                  <span>{summary.groupName}</span>
                  <span>·</span>
                  <span>{summary.messageCount} 条消息</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default SummaryHistory;
