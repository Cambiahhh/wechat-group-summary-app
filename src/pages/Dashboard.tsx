import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Mock data - would be replaced with real API calls
const mockSummaries = [
  {
    id: '1',
    groupName: '产品讨论群',
    date: new Date(2023, 6, 15),
    messageCount: 253,
    summary: '今天的会议主要讨论了新产品功能规划，重点围绕用户体验改进展开。张总强调了市场反馈的重要性，李经理提出了三点具体的改进建议。团队决定在下周前完成原型设计，并安排了下一次评审会议的时间。',
  },
  {
    id: '2',
    groupName: '技术支持群',
    date: new Date(2023, 6, 14),
    messageCount: 187,
    summary: '今天解决了5个关键技术问题，其中包括服务器性能优化和数据库查询速度提升。团队成员王工分享了一个新的缓存策略，显著降低了系统响应时间。明天将继续跟进剩余的3个bug修复工作。',
  },
  {
    id: '3',
    groupName: '市场营销群',
    date: new Date(2023, 6, 13),
    messageCount: 324,
    summary: '讨论了即将到来的夏季促销活动，确定了"清凉一夏"作为主题。预计在社交媒体上投放广告，并与三家KOL合作推广。促销时间定为7月20日至8月5日，预计将提升销售额25%。',
  },
];

const stats = {
  totalGroups: 12,
  totalMessages: 15876,
  totalSummaries: 156,
  activeSummaryTasks: 2,
};

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
      transition: {
        duration: 0.4
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
        <button className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          <PlusIcon className="mr-2 h-5 w-5" />
          创建新总结
        </button>
      </div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Groups */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <UserGroupIcon className="h-12 w-12 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300" />
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">群聊数量</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGroups}</p>
            </div>
          </div>
        </div>

        {/* Total Messages */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900 dark:text-green-300" />
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">消息总数</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMessages.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Summaries */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <DocumentTextIcon className="h-12 w-12 rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900 dark:text-purple-300" />
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">总结数量</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSummaries}</p>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <ClockIcon className="h-12 w-12 rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900 dark:text-amber-300" />
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">进行中任务</h2>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSummaryTasks}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">快捷操作</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-500" />
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">新建群聊总结</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <DocumentTextIcon className="h-8 w-8 text-secondary-500" />
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">生成海报</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <ChartBarIcon className="h-8 w-8 text-success-500" />
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">分析会话趋势</span>
          </button>
          <button className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <ArrowTrendingUpIcon className="h-8 w-8 text-warning-500" />
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">查看群聊活跃度</span>
          </button>
        </div>
      </motion.div>

      {/* Recent Summaries */}
      <motion.div variants={itemVariants} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">最近总结</h2>
          <a href="/summary" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            查看全部
          </a>
        </div>

        <div className="space-y-4">
          {mockSummaries.map((summary) => (
            <div 
              key={summary.id} 
              className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">{summary.groupName}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(summary.date, 'yyyy年MM月dd日')}
                </span>
              </div>
              <p className="mb-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                {summary.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {summary.messageCount} 条消息
                </span>
                <button className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div variants={itemVariants} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">系统状态</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">API 状态</h3>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                正常
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deepseek API 运行正常，今日已使用配额: 65%
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">自动任务</h3>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                已启用
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              下次自动总结时间: 今天 20:00
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              下次海报生成时间: 周五 10:00
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
