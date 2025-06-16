import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  KeyIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import deepseekService from '../../services/deepseekService';
import { useAppContext } from '../../context/AppContext';

interface APISettingsProps {
  className?: string;
}

interface APIQuota {
  used: number;
  total: number;
  remaining: number;
}

interface APISettings {
  apiKey: string;
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

/**
 * API设置组件，用于配置和管理Deepseek API相关设置
 */
const APISettings: React.FC<APISettingsProps> = ({ className = '' }) => {
  // State for API settings
  const [settings, setSettings] = useState<APISettings>({
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    apiUrl: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
    model: 'deepseek-reasoner',
    temperature: 0.7,
    maxTokens: 1024,
  });

  // State for UI and feedback
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestSuccessful, setIsTestSuccessful] = useState<boolean | null>(null);
  const [testMessage, setTestMessage] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [quota, setQuota] = useState<APIQuota | null>(null);
  const [isLoadingQuota, setIsLoadingQuota] = useState(false);

  const { addNotification } = useAppContext();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('apiSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsed,
        }));
      } catch (error) {
        console.error('Failed to parse saved API settings:', error);
      }
    }
    
    // Fetch API quota information
    fetchQuota();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Parse numeric values
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = parseFloat(value);
      
      // Add validation for numeric ranges
      if (name === 'temperature' && (parsedValue < 0 || parsedValue > 1)) {
        return; // Temperature must be between 0 and 1
      }
      if (name === 'maxTokens' && (parsedValue < 1 || parsedValue > 4096)) {
        return; // Token limit between 1 and 4096
      }
    }
    
    setSettings({
      ...settings,
      [name]: parsedValue,
    });
  };

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage (in a real app, you might save to backend too)
      localStorage.setItem('apiSettings', JSON.stringify(settings));
      
      // Update environment variables if possible
      // Note: In browser environment, you can't directly modify .env files
      // This would typically be handled by a backend endpoint
      
      addNotification('success', 'API设置已保存');
    } catch (error) {
      console.error('Failed to save settings:', error);
      addNotification('error', '保存设置失败');
    } finally {
      setIsSaving(false);
    }
  };

  // Test API connection
  const testApiConnection = async () => {
    setIsTesting(true);
    setIsTestSuccessful(null);
    setTestMessage('');
    
    try {
      // Make a simple API call to test the connection
      const testPrompt = 'Hello, this is a test message to verify API connectivity.';
      await deepseekService.summarizeChat(testPrompt, {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: 50, // Use smaller value for test
      });
      
      setIsTestSuccessful(true);
      setTestMessage('API连接成功，服务正常');
      addNotification('success', 'API连接测试成功');
    } catch (error) {
      console.error('API connection test failed:', error);
      setIsTestSuccessful(false);
      setTestMessage(`API连接失败: ${error instanceof Error ? error.message : '未知错误'}`);
      addNotification('error', 'API连接测试失败');
    } finally {
      setIsTesting(false);
    }
  };

  // Fetch API quota information
  const fetchQuota = async () => {
    setIsLoadingQuota(true);
    
    try {
      const quotaInfo = await deepseekService.getApiQuota();
      setQuota(quotaInfo);
    } catch (error) {
      console.error('Failed to fetch API quota:', error);
      addNotification('error', '获取API配额信息失败');
    } finally {
      setIsLoadingQuota(false);
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">API设置</h2>
      
      {/* API Key Configuration */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
          <KeyIcon className="w-5 h-5 mr-2 text-primary-500" />
          API密钥配置
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deepseek API密钥
            </label>
            <div className="relative">
              <input
                id="apiKey"
                name="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showApiKey ? '隐藏' : '显示'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              您可以从Deepseek官网获取API密钥。密钥将被安全地存储在您的浏览器中。
            </p>
          </div>
          
          <div>
            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API端点URL
            </label>
            <input
              id="apiUrl"
              name="apiUrl"
              type="text"
              value={settings.apiUrl}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://api.deepseek.com/v1"
            />
          </div>
        </div>
      </div>
      
      {/* API Parameters */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
          <CogIcon className="w-5 h-5 mr-2 text-primary-500" />
          API调用参数设置
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模型
            </label>
            <select
              id="model"
              name="model"
              value={settings.model}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="deepseek-reasoner">deepseek-reasoner</option>
              <option value="deepseek-chat">deepseek-chat</option>
              <option value="deepseek-coder">deepseek-coder</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              选择用于生成总结的AI模型
            </p>
          </div>
          
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              温度 ({settings.temperature})
            </label>
            <input
              id="temperature"
              name="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={handleInputChange}
              className="block w-full rounded-md focus:outline-none focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              控制生成文本的随机性：较低的值更加确定性，较高的值更加创造性
            </p>
          </div>
          
          <div>
            <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大生成令牌数
            </label>
            <input
              id="maxTokens"
              name="maxTokens"
              type="number"
              min="1"
              max="4096"
              value={settings.maxTokens}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              限制AI生成的最大令牌数量，影响输出长度
            </p>
          </div>
        </div>
      </div>
      
      {/* API Connection Test */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
          <ArrowPathIcon className="w-5 h-5 mr-2 text-primary-500" />
          API连接测试
        </h3>
        
        <div>
          <button
            onClick={testApiConnection}
            disabled={isTesting || !settings.apiKey}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isTesting ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                测试中...
              </>
            ) : (
              '测试API连接'
            )}
          </button>
          
          {isTestSuccessful !== null && (
            <div className={`mt-3 p-3 rounded-md ${isTestSuccessful ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {isTestSuccessful ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${isTestSuccessful ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {testMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* API Usage Statistics */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-primary-500" />
          API使用统计
        </h3>
        
        {isLoadingQuota ? (
          <div className="flex justify-center py-4">
            <ArrowPathIcon className="animate-spin h-6 w-6 text-gray-400" />
          </div>
        ) : quota ? (
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">已使用</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{quota.used.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">剩余</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{quota.remaining.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">总额度</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{quota.total.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="text-xs text-right mb-1 flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">使用率:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{Math.round((quota.used / quota.total) * 100)}%</span>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                    style={{ width: `${(quota.used / quota.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                最近更新时间: {new Date().toLocaleString()}
                <button 
                  onClick={fetchQuota} 
                  className="ml-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  刷新
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            无法获取API使用数据。请确保您的API密钥有效并且已连接到服务。
          </div>
        )}
      </div>
      
      {/* API Documentation */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-500" />
          API文档参考
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700/50">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            访问以下资源获取更多关于Deepseek API的信息：
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a 
                href="https://platform.deepseek.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Deepseek API 官方文档
              </a>
            </li>
            <li>
              <a 
                href="https://platform.deepseek.com/examples" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                API 使用示例
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <>
              <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
              保存中...
            </>
          ) : (
            '保存设置'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default APISettings;
