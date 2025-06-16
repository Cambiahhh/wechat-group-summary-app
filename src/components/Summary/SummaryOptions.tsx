import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  BookOpenIcon,
  TagIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SummaryOptionsProps {
  onOptionsChange: (options: SummaryOptionsType) => void;
  defaultOptions?: Partial<SummaryOptionsType>;
  isLoading?: boolean;
}

export interface SummaryOptionsType {
  summaryLength: 'short' | 'medium' | 'long';
  summaryStyle: 'formal' | 'casual' | 'creative';
  focusPoints: string[];
  template: string;
  language: 'zh' | 'en';
  includeParticipants: boolean;
  includeTimestamps: boolean;
  detailLevel: 'brief' | 'detailed' | 'comprehensive';
}

/**
 * 总结选项组件 - 用于配置总结生成的各项参数
 */
const SummaryOptions: React.FC<SummaryOptionsProps> = ({
  onOptionsChange,
  defaultOptions,
  isLoading = false,
}) => {
  // Initialize with default options or provided defaults
  const [options, setOptions] = useState<SummaryOptionsType>({
    summaryLength: 'medium',
    summaryStyle: 'formal',
    focusPoints: [],
    template: 'standard',
    language: 'zh',
    includeParticipants: true,
    includeTimestamps: true,
    detailLevel: 'detailed',
    ...(defaultOptions || {})
  });

  const [customFocusPoint, setCustomFocusPoint] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Template options
  const templates = [
    { id: 'standard', name: '标准模板', description: '包含主要讨论内容、决策和后续行动的综合总结' },
    { id: 'concise', name: '简洁模板', description: '仅包含关键点和决策的精简总结' },
    { id: 'detailed', name: '详细模板', description: '包含全面细节和背景信息的详尽总结' },
    { id: 'action', name: '行动导向', description: '重点突出待办事项和后续步骤的总结' },
    { id: 'decision', name: '决策记录', description: '重点突出已做决策和结论的总结' },
  ];

  // Common focus points
  const commonFocusPoints = [
    '决策事项',
    '任务分配',
    '问题讨论',
    '项目进度',
    '重要通知',
    '意见冲突',
    '达成共识',
  ];

  // Update options and notify parent component
  const updateOption = <K extends keyof SummaryOptionsType>(
    key: K,
    value: SummaryOptionsType[K]
  ) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  // Toggle focus points
  const toggleFocusPoint = (point: string) => {
    let newFocusPoints: string[];
    
    if (options.focusPoints.includes(point)) {
      newFocusPoints = options.focusPoints.filter(p => p !== point);
    } else {
      newFocusPoints = [...options.focusPoints, point];
    }
    
    updateOption('focusPoints', newFocusPoints);
  };

  // Add custom focus point
  const addCustomFocusPoint = () => {
    if (customFocusPoint.trim() && !options.focusPoints.includes(customFocusPoint.trim())) {
      const newFocusPoints = [...options.focusPoints, customFocusPoint.trim()];
      updateOption('focusPoints', newFocusPoints);
      setCustomFocusPoint('');
    }
  };

  // Reset all options to defaults
  const resetOptions = () => {
    const defaultOptionsValues: SummaryOptionsType = {
      summaryLength: 'medium',
      summaryStyle: 'formal',
      focusPoints: [],
      template: 'standard',
      language: 'zh',
      includeParticipants: true,
      includeTimestamps: true,
      detailLevel: 'detailed',
    };
    
    setOptions(defaultOptionsValues);
    onOptionsChange(defaultOptionsValues);
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
      {/* Header with toggle */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500 mr-2 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">总结选项</h3>
        </div>
        <div className="flex items-center">
          {isLoading && (
            <ArrowPathIcon className="w-4 h-4 text-gray-500 animate-spin mr-2 dark:text-gray-400" />
          )}
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label={isExpanded ? '收起选项' : '展开选项'}
          >
            <ChevronDownIcon
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Options content */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-6">
        {/* Summary Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            总结长度
          </label>
          <div className="flex space-x-2">
            {(['short', 'medium', 'long'] as const).map(length => (
              <button
                key={length}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  options.summaryLength === length
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => updateOption('summaryLength', length)}
              >
                {length === 'short' ? '简短' : length === 'medium' ? '适中' : '详细'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {options.summaryLength === 'short' 
              ? '生成简短的总结（约100-200字）' 
              : options.summaryLength === 'medium' 
                ? '生成适中长度的总结（约300-500字）' 
                : '生成详细的总结（约600-1000字）'}
          </p>
        </div>

        {/* Summary Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            总结风格
          </label>
          <div className="flex space-x-2">
            {(['formal', 'casual', 'creative'] as const).map(style => (
              <button
                key={style}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  options.summaryStyle === style
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => updateOption('summaryStyle', style)}
              >
                {style === 'formal' ? '正式' : style === 'casual' ? '随意' : '创意'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {options.summaryStyle === 'formal' 
              ? '使用专业、正式的语言风格' 
              : options.summaryStyle === 'casual' 
                ? '使用轻松、日常的语言风格' 
                : '使用生动、有创意的语言风格'}
          </p>
        </div>

        {/* Detail Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            详细程度
          </label>
          <div className="flex space-x-2">
            {(['brief', 'detailed', 'comprehensive'] as const).map(level => (
              <button
                key={level}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  options.detailLevel === level
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => updateOption('detailLevel', level)}
              >
                {level === 'brief' ? '简要' : level === 'detailed' ? '详细' : '全面'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {options.detailLevel === 'brief' 
              ? '仅包含主要话题和结论' 
              : options.detailLevel === 'detailed' 
                ? '包括主要讨论点和重要细节' 
                : '包括所有重要讨论点、决策和行动项'}
          </p>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            总结模板
          </label>
          <select
            value={options.template}
            onChange={(e) => updateOption('template', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {templates.find(t => t.id === options.template)?.description || '选择总结内容的组织方式'}
          </p>
        </div>

        {/* Focus Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            总结关注点
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {commonFocusPoints.map((point) => (
              <button
                key={point}
                onClick={() => toggleFocusPoint(point)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  options.focusPoints.includes(point)
                    ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {options.focusPoints.includes(point) && (
                  <CheckIcon className="w-4 h-4 mr-1" />
                )}
                {point}
              </button>
            ))}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              value={customFocusPoint}
              onChange={(e) => setCustomFocusPoint(e.target.value)}
              placeholder="添加自定义关注点"
              className="flex-grow rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomFocusPoint();
                }
              }}
            />
            <button
              onClick={addCustomFocusPoint}
              disabled={!customFocusPoint.trim()}
              className="rounded-r-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.focusPoints
              .filter(point => !commonFocusPoints.includes(point))
              .map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200"
                >
                  {point}
                  <button
                    onClick={() => toggleFocusPoint(point)}
                    className="ml-1 text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            语言
          </label>
          <div className="flex space-x-2">
            {(['zh', 'en'] as const).map(lang => (
              <button
                key={lang}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  options.language === lang
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => updateOption('language', lang)}
              >
                {lang === 'zh' ? '中文' : '英文'}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            其他选项
          </label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={options.includeParticipants}
                onChange={(e) => updateOption('includeParticipants', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                包含参与者信息
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={options.includeTimestamps}
                onChange={(e) => updateOption('includeTimestamps', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                包含时间信息
              </span>
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={resetOptions}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            重置为默认
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryOptions;
