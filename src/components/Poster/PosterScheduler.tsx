import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  CalendarIcon, 
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { format, addDays, addWeeks, addMonths, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PosterSchedulerProps {
  onSchedule: (schedule: ScheduleConfig) => void;
  onCancel: (scheduleId: string) => void;
  schedules?: ScheduleItem[];
  isLoading?: boolean;
}

export interface ScheduleConfig {
  groupId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  time: string;
  day?: number; // Day of week (0-6) for weekly, day of month (1-31) for monthly
  date?: string; // ISO date string for one-time schedules
  templateId?: string;
}

export interface ScheduleItem {
  id: string;
  groupId: string;
  groupName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  nextRunTime: Date;
  status: 'active' | 'paused' | 'completed' | 'failed';
  lastRunTime?: Date;
  createdAt: Date;
}

const PosterScheduler: React.FC<PosterSchedulerProps> = ({
  onSchedule,
  onCancel,
  schedules = [],
  isLoading = false,
}) => {
  // State for new schedule configuration
  const [newSchedule, setNewSchedule] = useState<ScheduleConfig>({
    groupId: '',
    frequency: 'daily',
    time: '09:00',
    day: 1, // Monday for weekly, 1st for monthly
  });

  // State for UI
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([
    { id: '1', name: '产品讨论群' },
    { id: '2', name: '技术支持群' },
    { id: '3', name: '市场营销群' },
    { id: '4', name: '客户服务群' },
    { id: '5', name: '公司公告群' },
  ]);

  // Mocked poster templates
  const templates = [
    { id: 'template1', name: '蓝色渐变' },
    { id: 'template2', name: '极简白' },
    { id: 'template3', name: '夜间模式' },
    { id: 'template4', name: '企业蓝' },
    { id: 'template5', name: '暖色调' },
  ];

  // Handle group selection
  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroupId(e.target.value);
    setNewSchedule(prev => ({ ...prev, groupId: e.target.value }));
  };

  // Handle frequency change
  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly' | 'once') => {
    setNewSchedule(prev => ({
      ...prev,
      frequency,
      // Reset day/date based on frequency
      day: frequency === 'weekly' ? 1 : frequency === 'monthly' ? 1 : undefined,
      date: frequency === 'once' ? format(new Date(), 'yyyy-MM-dd') : undefined,
    }));
  };

  // Handle day selection for weekly schedules
  const handleWeekDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSchedule(prev => ({ ...prev, day: parseInt(e.target.value) }));
  };

  // Handle day selection for monthly schedules
  const handleMonthDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSchedule(prev => ({ ...prev, day: parseInt(e.target.value) }));
  };

  // Handle date selection for one-time schedules
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSchedule(prev => ({ ...prev, date: e.target.value }));
  };

  // Handle time selection
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSchedule(prev => ({ ...prev, time: e.target.value }));
  };

  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSchedule(prev => ({ ...prev, templateId: e.target.value }));
  };

  // Save new schedule
  const handleSaveSchedule = () => {
    onSchedule(newSchedule);
    setIsAddingSchedule(false);
    // Reset form
    setNewSchedule({
      groupId: '',
      frequency: 'daily',
      time: '09:00',
      day: 1,
    });
    setSelectedGroupId('');
  };

  // Get next run time description
  const getNextRunDescription = (schedule: ScheduleItem): string => {
    const now = new Date();
    const nextRun = new Date(schedule.nextRunTime);
    
    // Same day
    if (nextRun.getDate() === now.getDate() && 
        nextRun.getMonth() === now.getMonth() && 
        nextRun.getFullYear() === now.getFullYear()) {
      return `今天 ${format(nextRun, 'HH:mm')}`;
    }
    
    // Tomorrow
    const tomorrow = addDays(now, 1);
    if (nextRun.getDate() === tomorrow.getDate() && 
        nextRun.getMonth() === tomorrow.getMonth() && 
        nextRun.getFullYear() === tomorrow.getFullYear()) {
      return `明天 ${format(nextRun, 'HH:mm')}`;
    }
    
    // Within 7 days
    if (nextRun.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(nextRun, 'EEE HH:mm', { locale: zhCN });
    }
    
    // Further in future
    return format(nextRun, 'MM月dd日 HH:mm');
  };

  // Get frequency display text
  const getFrequencyText = (schedule: ScheduleItem): string => {
    switch (schedule.frequency) {
      case 'daily':
        return '每天';
      case 'weekly':
        return '每周';
      case 'monthly':
        return '每月';
      case 'once':
        return '单次';
      default:
        return '未知';
    }
  };

  // Get schedule status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            进行中
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <PauseIcon className="w-3 h-3 mr-1" />
            已暂停
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            已完成
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircleIcon className="w-3 h-3 mr-1" />
            失败
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            未知
          </span>
        );
    }
  };

  // Animation variants for the add schedule form
  const formVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', overflow: 'visible' }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="border-b dark:border-gray-700 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <ClockIcon className="w-6 h-6 mr-2 text-primary-500" />
            海报定时生成
          </h2>
          <button
            onClick={() => setIsAddingSchedule(!isAddingSchedule)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isAddingSchedule ? (
              <>取消</>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-1" />
                新建计划
              </>
            )}
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          设置定时生成海报的计划，系统将在指定时间自动生成并保存海报
        </p>
      </div>

      {/* Add new schedule form */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate={isAddingSchedule ? "visible" : "hidden"}
        transition={{ duration: 0.3 }}
        className="border-b dark:border-gray-700"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            新建海报生成计划
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {/* Group selection */}
              <div>
                <label htmlFor="group" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  选择群聊
                </label>
                <select
                  id="group"
                  value={selectedGroupId}
                  onChange={handleGroupChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">选择群聊</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template selection */}
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  海报模板
                </label>
                <select
                  id="template"
                  value={newSchedule.templateId || ''}
                  onChange={handleTemplateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">默认模板</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  生成频率
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'daily', label: '每天' },
                    { value: 'weekly', label: '每周' },
                    { value: 'monthly', label: '每月' },
                    { value: 'once', label: '单次' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFrequencyChange(option.value as any)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                        newSchedule.frequency === option.value
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Time selection */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  生成时间
                </label>
                <input
                  type="time"
                  id="time"
                  value={newSchedule.time}
                  onChange={handleTimeChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Weekly day selection */}
              {newSchedule.frequency === 'weekly' && (
                <div>
                  <label htmlFor="weekday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    每周几生成
                  </label>
                  <select
                    id="weekday"
                    value={newSchedule.day}
                    onChange={handleWeekDayChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={1}>周一</option>
                    <option value={2}>周二</option>
                    <option value={3}>周三</option>
                    <option value={4}>周四</option>
                    <option value={5}>周五</option>
                    <option value={6}>周六</option>
                    <option value={0}>周日</option>
                  </select>
                </div>
              )}

              {/* Monthly day selection */}
              {newSchedule.frequency === 'monthly' && (
                <div>
                  <label htmlFor="monthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    每月几号生成
                  </label>
                  <select
                    id="monthday"
                    value={newSchedule.day}
                    onChange={handleMonthDayChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}日
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* One-time date selection */}
              {newSchedule.frequency === 'once' && (
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    选择日期
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newSchedule.date}
                    onChange={handleDateChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingSchedule(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveSchedule}
              disabled={!newSchedule.groupId}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </div>
      </motion.div>

      {/* Schedule list */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          已设置的计划
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无计划</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              点击"新建计划"按钮创建海报生成计划
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    群聊
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    频率
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    下次生成
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    状态
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {schedules.map((schedule) => (
                  <motion.tr 
                    key={schedule.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {schedule.groupName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {getFrequencyText(schedule)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {getNextRunDescription(schedule)}
                      </div>
                      {schedule.lastRunTime && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          上次: {format(new Date(schedule.lastRunTime), 'MM/dd HH:mm')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(schedule.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary-600 hover:text-primary-900 mr-3 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => {}}
                      >
                        {schedule.status === 'paused' ? (
                          <PlayIcon className="w-5 h-5" />
                        ) : (
                          <PauseIcon className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => onCancel(schedule.id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History section */}
      <div className="border-t dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowPathIcon className="w-5 h-5 mr-2 text-primary-500" />
          生成历史
        </h3>
        
        {/* Add history implementation later */}
        <div className="text-center py-6">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无历史记录</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            海报生成后将在此处显示历史记录
          </p>
        </div>
      </div>
    </div>
  );
};

export default PosterScheduler;
