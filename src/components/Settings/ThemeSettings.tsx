import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  SwatchIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../context/AppContext';

interface ThemeSettingsProps {
  className?: string;
}

// Color theme options
const colorThemes = [
  { id: 'blue', name: '默认蓝', primary: '#0ea5e9', secondary: '#8b5cf6' },
  { id: 'purple', name: '紫色', primary: '#8b5cf6', secondary: '#ec4899' },
  { id: 'green', name: '绿色', primary: '#10b981', secondary: '#6366f1' },
  { id: 'amber', name: '琥珀色', primary: '#f59e0b', secondary: '#10b981' },
  { id: 'rose', name: '玫瑰色', primary: '#f43f5e', secondary: '#8b5cf6' },
  { id: 'gray', name: '灰色', primary: '#4b5563', secondary: '#6b7280' },
];

// Font family options
const fontFamilies = [
  { id: 'default', name: '默认', value: '"Inter var", Inter, system-ui, sans-serif' },
  { id: 'serif', name: '衬线字体', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'mono', name: '等宽字体', value: '"JetBrains Mono", monospace' },
  { id: 'rounded', name: '圆角字体', value: '"Hiragino Maru Gothic ProN", Quicksand, Comfortaa, sans-serif' },
];

// Font size options
const fontSizes = [
  { id: 'xs', name: '极小', value: '0.75' },
  { id: 'sm', name: '小', value: '0.875' },
  { id: 'md', name: '中', value: '1' },
  { id: 'lg', name: '大', value: '1.125' },
  { id: 'xl', name: '极大', value: '1.25' },
];

// Layout options
const layoutOptions = [
  { id: 'default', name: '默认', description: '标准布局' },
  { id: 'compact', name: '紧凑', description: '减少间距，显示更多内容' },
  { id: 'comfortable', name: '舒适', description: '增加间距，提高可读性' },
  { id: 'wide', name: '宽屏', description: '使用更多水平空间' },
];

/**
 * 主题设置组件 - 用于自定义应用程序的主题和布局
 */
const ThemeSettings: React.FC<ThemeSettingsProps> = ({ className = '' }) => {
  // Get theme context
  const { theme: currentTheme, setTheme } = useAppContext();
  
  // Local state for settings
  const [colorTheme, setColorTheme] = useState<string>('blue');
  const [fontFamily, setFontFamily] = useState<string>('default');
  const [fontSize, setFontSize] = useState<string>('md');
  const [layout, setLayout] = useState<string>('default');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSettingsChanged, setIsSettingsChanged] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(currentTheme || 'light');
  
  // Check if system prefers dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Calculate effective theme (actual light/dark mode)
  const effectiveTheme = 
    themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;
  
  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setColorTheme(parsed.colorTheme || 'blue');
        setFontFamily(parsed.fontFamily || 'default');
        setFontSize(parsed.fontSize || 'md');
        setLayout(parsed.layout || 'default');
      } catch (error) {
        console.error('Failed to parse saved theme settings:', error);
      }
    }
  }, []);
  
  // Monitor for changes to detect if settings have been modified
  useEffect(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    
    if (!savedSettings) {
      setIsSettingsChanged(true);
      return;
    }
    
    try {
      const parsed = JSON.parse(savedSettings);
      const hasChanges = 
        parsed.colorTheme !== colorTheme || 
        parsed.fontFamily !== fontFamily || 
        parsed.fontSize !== fontSize || 
        parsed.layout !== layout;
      
      setIsSettingsChanged(hasChanges);
    } catch (error) {
      setIsSettingsChanged(true);
    }
  }, [colorTheme, fontFamily, fontSize, layout]);
  
  // Apply theme settings to the document
  useEffect(() => {
    // Apply font family
    const selectedFont = fontFamilies.find(font => font.id === fontFamily);
    if (selectedFont) {
      document.documentElement.style.setProperty('--font-sans', selectedFont.value);
    }
    
    // Apply font size
    const selectedSize = fontSizes.find(size => size.id === fontSize);
    if (selectedSize) {
      document.documentElement.style.setProperty('--font-size-base', `${selectedSize.value}rem`);
    }
    
    // Apply layout spacing
    switch (layout) {
      case 'compact':
        document.documentElement.style.setProperty('--spacing-unit', '0.2rem');
        break;
      case 'comfortable':
        document.documentElement.style.setProperty('--spacing-unit', '0.35rem');
        break;
      case 'wide':
        document.documentElement.style.setProperty('--max-width', '1400px');
        break;
      default:
        document.documentElement.style.setProperty('--spacing-unit', '0.25rem');
        document.documentElement.style.setProperty('--max-width', '1200px');
    }
    
    // Apply color theme
    const selectedTheme = colorThemes.find(theme => theme.id === colorTheme);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--color-primary-500', selectedTheme.primary);
      document.documentElement.style.setProperty('--color-secondary-500', selectedTheme.secondary);
      
      // Generate other shades of the primary color (simplified approach)
      const generateShades = (baseColor: string, name: string) => {
        // This is a simplified approach - in a real app you would use a color library
        // to properly generate color shades
        const lighten = (color: string, amount: number): string => {
          // Simple lightening by adding white (not accurate for production)
          return color;
        };
        
        const darken = (color: string, amount: number): string => {
          // Simple darkening by adding black (not accurate for production)
          return color;
        };
        
        document.documentElement.style.setProperty(`--color-${name}-50`, lighten(baseColor, 0.9));
        document.documentElement.style.setProperty(`--color-${name}-100`, lighten(baseColor, 0.8));
        document.documentElement.style.setProperty(`--color-${name}-200`, lighten(baseColor, 0.6));
        document.documentElement.style.setProperty(`--color-${name}-300`, lighten(baseColor, 0.4));
        document.documentElement.style.setProperty(`--color-${name}-400`, lighten(baseColor, 0.2));
        document.documentElement.style.setProperty(`--color-${name}-600`, darken(baseColor, 0.2));
        document.documentElement.style.setProperty(`--color-${name}-700`, darken(baseColor, 0.4));
        document.documentElement.style.setProperty(`--color-${name}-800`, darken(baseColor, 0.6));
        document.documentElement.style.setProperty(`--color-${name}-900`, darken(baseColor, 0.8));
      };
      
      generateShades(selectedTheme.primary, 'primary');
      generateShades(selectedTheme.secondary, 'secondary');
    }
    
  }, [colorTheme, fontFamily, fontSize, layout]);
  
  // Handle theme mode change
  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    setTheme(mode);
  };
  
  // Save theme settings
  const saveSettings = () => {
    setIsSaving(true);
    
    try {
      const settings = {
        colorTheme,
        fontFamily,
        fontSize,
        layout,
      };
      
      localStorage.setItem('themeSettings', JSON.stringify(settings));
      setIsSettingsChanged(false);
      
      // Show success notification (using app context in a real application)
    } catch (error) {
      console.error('Failed to save theme settings:', error);
      // Show error notification
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 800); // Simulate saving delay
    }
  };
  
  // Reset to default settings
  const resetToDefaults = () => {
    setColorTheme('blue');
    setFontFamily('default');
    setFontSize('md');
    setLayout('default');
  };
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm dark:bg-gray-800 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">主题设置</h2>
        
        {/* Light/Dark Mode Toggle */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <SunIcon className="w-5 h-5 mr-2 text-amber-500" />
            显示模式
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleThemeModeChange('light')}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                themeMode === 'light'
                  ? 'bg-primary-100 text-primary-800 border-2 border-primary-500 dark:bg-primary-900 dark:text-primary-100'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SunIcon className="w-5 h-5 mr-2" />
              浅色模式
            </button>
            
            <button
              onClick={() => handleThemeModeChange('dark')}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                themeMode === 'dark'
                  ? 'bg-primary-100 text-primary-800 border-2 border-primary-500 dark:bg-primary-900 dark:text-primary-100'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <MoonIcon className="w-5 h-5 mr-2" />
              深色模式
            </button>
            
            <button
              onClick={() => handleThemeModeChange('system')}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                themeMode === 'system'
                  ? 'bg-primary-100 text-primary-800 border-2 border-primary-500 dark:bg-primary-900 dark:text-primary-100'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              跟随系统
            </button>
          </div>
          
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            当前显示模式: <span className="font-medium">{themeMode === 'system' ? `系统设置 (${effectiveTheme})` : themeMode === 'dark' ? '深色' : '浅色'}</span>
          </p>
        </div>
        
        {/* Color Theme Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <SwatchIcon className="w-5 h-5 mr-2 text-primary-500" />
            颜色主题
          </h3>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorThemes.map(theme => (
              <button
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                className={`group relative flex flex-col items-center p-2 rounded-lg border-2 ${
                  colorTheme === theme.id
                    ? 'border-primary-500 dark:border-primary-400'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex space-x-1 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: theme.secondary }}
                  ></div>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{theme.name}</span>
                
                {colorTheme === theme.id && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Typography Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-500" />
            字体和排版
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Family Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                字体家族
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {fontFamilies.map(font => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
              
              <div className="mt-3 p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                <p style={{ fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value || 'inherit' }}>
                  预览文本 - 这是使用所选字体的示例文本
                </p>
              </div>
            </div>
            
            {/* Font Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                字体大小
              </label>
              <div className="flex space-x-2">
                {fontSizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setFontSize(size.id)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm ${
                      fontSize === size.id
                        ? 'bg-primary-100 text-primary-800 font-medium dark:bg-primary-900 dark:text-primary-100'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                    style={{ fontSize: `${size.value}rem` }}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-3 bg-gray-50 rounded-md p-3 dark:bg-gray-700">
                <p className="text-sm" style={{ fontSize: `${fontSizes.find(s => s.id === fontSize)?.value || 1}rem` }}>
                  小文本示例
                </p>
                <p className="text-base" style={{ fontSize: `${(parseFloat(fontSizes.find(s => s.id === fontSize)?.value || '1') * 1.25)}rem` }}>
                  中等文本示例
                </p>
                <p className="text-lg font-medium" style={{ fontSize: `${(parseFloat(fontSizes.find(s => s.id === fontSize)?.value || '1') * 1.5)}rem` }}>
                  大文本示例
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Layout Options */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <Squares2X2Icon className="w-5 h-5 mr-2 text-primary-500" />
            布局设置
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {layoutOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setLayout(option.id)}
                className={`p-4 rounded-lg border-2 text-left ${
                  layout === option.id
                    ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <h4 className="font-medium text-gray-900 dark:text-white">{option.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            恢复默认设置
          </button>
          
          <button
            onClick={saveSettings}
            disabled={isSaving || !isSettingsChanged}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed`}
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
      </div>
    </motion.div>
  );
};

export default ThemeSettings;
