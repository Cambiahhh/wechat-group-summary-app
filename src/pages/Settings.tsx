import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  KeyIcon,
  PaintBrushIcon,
  BellIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  TrashIcon,
  ArrowPathIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import deepseekService from '../services/deepseekService';

// Settings page component
const Settings: React.FC = () => {
  const { theme, setTheme } = useAppContext();

  // API settings
  const [apiKey, setApiKey] = useState<string>('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [apiQuota, setApiQuota] = useState<{
    used: number;
    total: number;
    remaining: number;
  } | null>(null);

  // UI settings
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(theme || 'system');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [summarySummaryNotifications, setSummarySummaryNotifications] = useState(true);
  const [posterNotifications, setPosterNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Data management
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'txt'>('json');
  const [clearingSummaries, setClearingSummaries] = useState(false);
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState<'7' | '30' | '90' | 'forever'>('30');

  // Get API key from environment or local storage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('deepseek_api_key') || import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    setApiKey(storedApiKey);

    // Check API key validity
    if (storedApiKey) {
      checkApiKeyValidity(storedApiKey);
      fetchApiQuota();
    }

    // Get other settings from localStorage if available
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    const storedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' || 'medium';
    const storedAnimationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    const storedNotificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    const storedSummaryNotifications = localStorage.getItem('summarySummaryNotifications') !== 'false';
    const storedPosterNotifications = localStorage.getItem('posterNotifications') !== 'false';
    const storedSoundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    const storedExportFormat = localStorage.getItem('exportFormat') as 'json' | 'csv' | 'txt' || 'json';
    const storedRetentionPeriod = localStorage.getItem('dataRetentionPeriod') as '7' | '30' | '90' | 'forever' || '30';

    setSelectedTheme(storedTheme);
    setFontSize(storedFontSize);
    setAnimationsEnabled(storedAnimationsEnabled);
    setNotificationsEnabled(storedNotificationsEnabled);
    setSummarySummaryNotifications(storedSummaryNotifications);
    setPosterNotifications(storedPosterNotifications);
    setSoundEnabled(storedSoundEnabled);
    setExportFormat(storedExportFormat);
    setDataRetentionPeriod(storedRetentionPeriod);
  }, []);

  // Check if API key is valid
  const checkApiKeyValidity = async (key: string) => {
    // This would typically involve making a test API call to verify the key
    try {
      setApiKeyValid(null); // Loading state
      const response = await fetch('https://api.deepseek.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      setApiKeyValid(response.ok);
      return response.ok;
    } catch (error) {
      console.error('Error checking API key:', error);
      setApiKeyValid(false);
      return false;
    }
  };

  // Fetch API quota information
  const fetchApiQuota = async () => {
    try {
      const quota = await deepseekService.getApiQuota();
      setApiQuota(quota);
    } catch (error) {
      console.error('Error fetching API quota:', error);
    }
  };

  // Save API key
  const handleSaveApiKey = async () => {
    setIsSavingKey(true);
    const isValid = await checkApiKeyValidity(apiKey);

    if (isValid) {
      localStorage.setItem('deepseek_api_key', apiKey);
      // Reload quota information
      fetchApiQuota();
    }

    setIsSavingKey(false);
  };

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Handle font size change
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');

    switch (size) {
      case 'small':
        document.documentElement.classList.add('text-sm');
        break;
      case 'medium':
        document.documentElement.classList.add('text-base');
        break;
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
    }
  };

  // Toggle animations
  const handleToggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('animationsEnabled', String(newValue));

    if (!newValue) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  // Handle notification settings
  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', String(newValue));
  };

  const handleToggleSummaryNotifications = () => {
    const newValue = !summarySummaryNotifications;
    setSummarySummaryNotifications(newValue);
    localStorage.setItem('summarySummaryNotifications', String(newValue));
  };

  const handleTogglePosterNotifications = () => {
    const newValue = !posterNotifications;
    setPosterNotifications(newValue);
    localStorage.setItem('posterNotifications', String(newValue));
  };

  const handleToggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', String(newValue));
  };

  // Handle data management
  const handleExportData = () => {
    // This would handle exporting data in the selected format
    alert(`Exporting data in ${exportFormat} format`);
  };

  const handleClearSummaries = () => {
    setClearingSummaries(true);
    // Simulate clearing data
    setTimeout(() => {
      setClearingSummaries(false);
      alert('所有摘要都已清除');
    }, 1000);
  };

  const handleChangeRetentionPeriod = (period: '7' | '30' | '90' | 'forever') => {
    setDataRetentionPeriod(period);
    localStorage.setItem('dataRetentionPeriod', period);
  };

  return (
    <motion.div
      className="space-y-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <Cog6ToothIcon className="h-8 w-8 text-gray-500 dark:text-gray-400 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">设置</h1>
      </div>

      {/* API Settings Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="flex items-center mb-4">
          <KeyIcon className="h-6 w-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">API 设置</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deepseek API 密钥
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type={showApiKey ? "text" : "password"}
                id="apiKey"
                name="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              设置您的 Deepseek API 密钥以启用摘要生成功能。
              <a href="https://deepseek.com/api-keys" target="_blank" rel="noopener noreferrer" className="ml-1 text-primary-600 hover:text-primary-500 dark:text-primary-400">
                获取 API 密钥
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300 inline-flex items-center">
                API 状态：
                {apiKeyValid === null ? (
                  <span className="ml-2 text-gray-500 dark:text-gray-400">未验证</span>
                ) : apiKeyValid ? (
                  <span className="ml-2 text-green-500 flex items-center">
                    <CheckIcon className="h-5 w-5 mr-1" />
                    有效
                  </span>
                ) : (
                  <span className="ml-2 text-red-500">无效</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSaveApiKey}
              disabled={isSavingKey || !apiKey}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSavingKey ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  验证中...
                </>
              ) : (
                '保存并验证'
              )}
            </button>
          </div>

          {apiQuota && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md dark:bg-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API 配额使用情况</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${(apiQuota.used / apiQuota.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>已使用: {apiQuota.used} 次请求</span>
                <span>总计: {apiQuota.total} 次请求</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* UI Settings Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="flex items-center mb-4">
          <PaintBrushIcon className="h-6 w-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">界面设置</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              主题
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`relative flex flex-col items-center p-3 rounded-lg border ${
                  selectedTheme === 'light'
                    ? 'border-primary-500 ring-2 ring-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="p-2 bg-gray-100 rounded-full mb-2">
                  <SunIcon className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">浅色</span>
                {selectedTheme === 'light' && (
                  <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`relative flex flex-col items-center p-3 rounded-lg border ${
                  selectedTheme === 'dark'
                    ? 'border-primary-500 ring-2 ring-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="p-2 bg-gray-800 rounded-full mb-2">
                  <MoonIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">深色</span>
                {selectedTheme === 'dark' && (
                  <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeChange('system')}
                className={`relative flex flex-col items-center p-3 rounded-lg border ${
                  selectedTheme === 'system'
                    ? 'border-primary-500 ring-2 ring-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                  <ComputerDesktopIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">系统</span>
                {selectedTheme === 'system' && (
                  <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              字体大小
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'small', label: '小' },
                { value: 'medium', label: '中' },
                { value: 'large', label: '大' },
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFontSizeChange(size.value as 'small' | 'medium' | 'large')}
                  className={`px-4 py-2 rounded-md ${
                    fontSize === size.value
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                动画效果
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                启用或禁用界面动画效果
              </p>
            </div>
            <button
              onClick={handleToggleAnimations}
              role="switch"
              aria-checked={animationsEnabled}
              className={`${
                animationsEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    animationsEnabled
                      ? 'opacity-0 duration-100 ease-out'
                      : 'opacity-100 duration-200 ease-in'
                  } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                  aria-hidden="true"
                >
                  <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={`${
                    animationsEnabled
                      ? 'opacity-100 duration-200 ease-in'
                      : 'opacity-0 duration-100 ease-out'
                  } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                  aria-hidden="true"
                >
                  <svg className="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Notifications Settings Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="flex items-center mb-4">
          <BellIcon className="h-6 w-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">通知设置</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                启用通知
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                显示应用程序通知
              </p>
            </div>
            <button
              onClick={handleToggleNotifications}
              role="switch"
              aria-checked={notificationsEnabled}
              className={`${
                notificationsEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              ></span>
            </button>
          </div>

          {notificationsEnabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    总结通知
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    当群聊总结生成完成时通知
                  </p>
                </div>
                <button
                  onClick={handleToggleSummaryNotifications}
                  role="switch"
                  aria-checked={summarySummaryNotifications}
                  className={`${
                    summarySummaryNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      summarySummaryNotifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    海报通知
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    当海报生成完成时通知
                  </p>
                </div>
                <button
                  onClick={handleTogglePosterNotifications}
                  role="switch"
                  aria-checked={posterNotifications}
                  className={`${
                    posterNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      posterNotifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    声音提醒
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    启用通知声音
                  </p>
                </div>
                <button
                  onClick={handleToggleSound}
                  role="switch"
                  aria-checked={soundEnabled}
                  className={`${
                    soundEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  ></span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Data Management Section */}
      <section className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <div className="flex items-center mb-4">
          <DocumentDuplicateIcon className="h-6 w-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">数据管理</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                导出数据
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                将您的摘要数据导出为文件
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {[
                { value: 'json', label: 'JSON' },
                { value: 'csv', label: 'CSV' },
                { value: 'txt', label: 'TXT' },
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value as 'json' | 'csv' | 'txt')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    exportFormat === format.value
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                数据保留期
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                设置摘要数据的保留时间
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {[
                { value: '7', label: '7天' },
                { value: '30', label: '30天' },
                { value: '90', label: '90天' },
                { value: 'forever', label: '永久' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => handleChangeRetentionPeriod(period.value as '7' | '30' | '90' | 'forever')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    dataRetentionPeriod === period.value
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div>
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800"
              >
                导出数据
              </button>
            </div>
            <div>
              <button
                onClick={handleClearSummaries}
                disabled={clearingSummaries}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
              >
                {clearingSummaries ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    清除中...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-1" />
                    清除所有摘要
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Settings;