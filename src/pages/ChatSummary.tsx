import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowPathIcon, 
  CalendarIcon, 
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Mock data - would be replaced with real API calls
const mockChatGroups = [
  { id: '1', name: '产品讨论群', members: 15 },
  { id: '2', name: '技术支持群', members: 8 },
  { id: '3', name: '市场营销群', members: 12 },
  { id: '4', name: '客户服务群', members: 6 },
  { id: '5', name: '公司公告群', members: 25 },
];

const mockChatMessages = [
  {
    id: '1',
    sender: '张三',
    avatar: '',
    content: '大家好，关于新功能的开发进度，我想听听大家的意见。',
    timestamp: new Date(2023, 6, 15, 9, 30),
  },
  {
    id: '2',
    sender: '李四',
    avatar: '',
    content: '我觉得我们应该优先完成用户反馈最多的那几个功能点，特别是搜索优化。',
    timestamp: new Date(2023, 6, 15, 9, 32),
  },
  {
    id: '3',
    sender: '王五',
    avatar: '',
    content: '同意李四的观点，另外我们还需要考虑性能问题，最近用户反馈说APP在某些情况下会卡顿。',
    timestamp: new Date(2023, 6, 15, 9, 33),
  },
  {
    id: '4',
    sender: '赵六',
    avatar: '',
    content: '我已经查看了性能日志，主要是在处理大量图片时内存占用过高导致的，我会在这周内优化。',
    timestamp: new Date(2023, 6, 15, 9, 35),
  },
  {
    id: '5',
    sender: '张三',
    avatar: '',
    content: '太好了，那我们下周一之前需要完成这两个优先级最高的任务，大家没问题吧？',
    timestamp: new Date(2023, 6, 15, 9, 37),
  },
  {
    id: '6',
    sender: '李四',
    avatar: '',
    content: '没问题，我会负责搜索功能的优化。',
    timestamp: new Date(2023, 6, 15, 9, 38),
  },
  {
    id: '7',
    sender: '王五',
    avatar: '',
    content: '我来协助赵六处理性能问题，我们会在周五前提交初步方案。',
    timestamp: new Date(2023, 6, 15, 9, 40),
  },
];

const mockSummary = {
  title: '产品讨论群聊天总结 (2023年7月15日)',
  content: `
    ## 主要讨论内容
    团队讨论了当前产品开发的优先级问题，重点关注以下两个方面：
    
    1. **搜索功能优化**：根据用户反馈，这是用户最关注的功能点之一，由李四负责实施。
    
    2. **性能问题解决**：特别是在处理大量图片时出现的卡顿问题，原因是内存占用过高，由赵六主导、王五协助解决。
    
    ## 行动计划
    - 搜索功能优化将由李四负责，计划在下周一前完成
    - 性能问题将由赵六和王五共同解决，周五前提交初步优化方案
    
    ## 结论
    团队一致同意将上述两项作为本周的优先任务，争取在下周一之前交付结果。
  `,
  generatedAt: new Date(2023, 6, 15, 10, 0),
  wordCount: 156,
  messageCount: 7,
};

// Date range options
const dateRangeOptions = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'thisWeek', label: '本周' },
  { value: 'lastWeek', label: '上周' },
  { value: 'thisMonth', label: '本月' },
  { value: 'custom', label: '自定义' },
];

const ChatSummary: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState(mockChatGroups[0]);
  const [dateRange, setDateRange] = useState('today');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [summary, setSummary] = useState(mockSummary);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value);
    setShowCustomDatePicker(value === 'custom');
  };

  // Handle group change
  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = e.target.value;
    const group = mockChatGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  // Handle generate summary
  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingSummary(false);
      // In a real app, we would update the summary with the response from API
    }, 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">聊天总结</h1>
        <div className="mt-2 flex space-x-2 sm:mt-0">
          <button 
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isGeneratingSummary ? (
              <>
                <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <DocumentTextIcon className="mr-2 h-5 w-5" />
                生成总结
              </>
            )}
          </button>
          <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <AdjustmentsHorizontalIcon className="mr-2 h-5 w-5" />
            高级设置
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Group Selector */}
        <div>
          <label htmlFor="group" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            选择群聊
          </label>
          <select
            id="group"
            value={selectedGroup.id}
            onChange={handleGroupChange}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {mockChatGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.members}人)
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Selector */}
        <div>
          <label htmlFor="dateRange" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            时间范围
          </label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={handleDateRangeChange}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Date Pickers - Show only when custom date range is selected */}
        {showCustomDatePicker && (
          <>
            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                开始日期
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  onChange={(e) => setCustomStartDate(e.target.value ? new Date(e.target.value) : null)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <CalendarIcon className="pointer-events-none absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                结束日期
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  onChange={(e) => setCustomEndDate(e.target.value ? new Date(e.target.value) : null)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <CalendarIcon className="pointer-events-none absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chat Messages Section */}
        <motion.div 
          variants={itemVariants}
          className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <ChatBubbleBottomCenterTextIcon className="mr-2 h-5 w-5 text-primary-500" />
              群聊内容
            </h2>
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              {mockChatMessages.length} 条消息
            </span>
          </div>

          <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="mr-1 h-4 w-4" />
            <span>
              {format(mockChatMessages[0]?.timestamp || new Date(), 'yyyy年MM月dd日 HH:mm')} - 
              {format(mockChatMessages[mockChatMessages.length - 1]?.timestamp || new Date(), 'yyyy年MM月dd日 HH:mm')}
            </span>
          </div>

          {/* Chat messages container with scrolling */}
          <div className="h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="space-y-4">
              {mockChatMessages.map((message) => (
                <div key={message.id} className="flex">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-600">
                    {message.avatar ? (
                      <img 
                        src={message.avatar} 
                        alt={message.sender} 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {message.sender.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 max-w-[85%]">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{message.sender}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(message.timestamp, 'HH:mm')}
                      </span>
                    </div>
                    <div className="mt-1 rounded-lg bg-white p-2 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div 
          variants={itemVariants}
          className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <DocumentTextIcon className="mr-2 h-5 w-5 text-secondary-500" />
              总结内容
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                生成于: {format(summary.generatedAt, 'yyyy年MM月dd日 HH:mm')}
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircleIcon className="mr-1 h-3 w-3" />
                已完成
              </span>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">{summary.title}</h3>
            <div className="flex space-x-2">
              <button className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                复制
              </button>
              <button className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                <ArrowDownTrayIcon className="mr-1 h-3 w-3" />
                导出
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-700">
              <span className="font-medium text-gray-500 dark:text-gray-400">消息数:</span>{' '}
              <span className="font-medium text-gray-800 dark:text-white">{summary.messageCount}</span>
            </div>
            <div className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-700">
              <span className="font-medium text-gray-500 dark:text-gray-400">字数:</span>{' '}
              <span className="font-medium text-gray-800 dark:text-white">{summary.wordCount}</span>
            </div>
          </div>

          {/* Summary content with markdown-like styling */}
          <div className="h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            {summary.content.split('##').map((section, index) => {
              if (index === 0) return null; // Skip the first empty section
              const [title, ...content] = section.split('\n').filter(Boolean);
              return (
                <div key={index} className="mb-4">
                  <h4 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                    {title.trim()}
                  </h4>
                  <div className="pl-2">
                    {content.map((line, i) => {
                      // Format the numbered lists
                      if (line.trim().match(/^\d+\.\s/)) {
                        const [number, ...rest] = line.trim().split('. ');
                        return (
                          <div key={i} className="mb-1 flex">
                            <span className="mr-2 font-medium">{number}.</span>
                            <span>{rest.join('. ')}</span>
                          </div>
                        );
                      }
                      // Format bold text
                      else if (line.includes('**')) {
                        const parts = line.trim().split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={i} className="mb-1">
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j}>{part.substring(2, part.length - 2)}</strong>;
                              }
                              return <span key={j}>{part}</span>;
                            })}
                          </p>
                        );
                      }
                      // Regular lines
                      else {
                        return <p key={i} className="mb-1">{line.trim()}</p>;
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
              重新生成
            </button>
            <button className="rounded-lg bg-secondary-600 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2">
              生成海报
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatSummary;
