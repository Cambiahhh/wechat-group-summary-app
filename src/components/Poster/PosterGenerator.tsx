import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  PhotoIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  ArrowsPointingOutIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { ChatSummary } from '../../types';
import { useAppContext } from '../../context/AppContext';
import summaryService from '../../services/summaryService';
import html2canvas from 'html2canvas';

interface PosterGeneratorProps {
  summary?: ChatSummary | null;
  onGenerated?: (imageUrl: string) => void;
  onClose?: () => void;
}

interface PosterTemplate {
  id: string;
  name: string;
  thumbnail: string;
  background: string;
  textColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

const PosterGenerator: React.FC<PosterGeneratorProps> = ({ 
  summary,
  onGenerated,
  onClose 
}) => {
  // State for poster content and configuration
  const [title, setTitle] = useState<string>(summary?.title || '');
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1');
  const [customOptions, setCustomOptions] = useState({
    backgroundColor: '#1a75ff',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    borderRadius: '12px',
    padding: '20px',
  });
  
  const posterRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useAppContext();

  // Available poster templates
  const templates: PosterTemplate[] = [
    {
      id: 'template1',
      name: '蓝色渐变',
      thumbnail: '/templates/blue-gradient-thumb.jpg',
      background: 'linear-gradient(135deg, #1a75ff 0%, #0043a9 100%)',
      textColor: '#ffffff',
      secondaryColor: '#e3f2fd',
      accentColor: '#ffd700',
      fontFamily: 'Arial, sans-serif',
    },
    {
      id: 'template2',
      name: '极简白',
      thumbnail: '/templates/minimalist-white-thumb.jpg',
      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
      textColor: '#333333',
      secondaryColor: '#666666',
      accentColor: '#ff4081',
      fontFamily: '"Helvetica Neue", sans-serif',
    },
    {
      id: 'template3',
      name: '夜间模式',
      thumbnail: '/templates/dark-mode-thumb.jpg',
      background: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)',
      textColor: '#ffffff',
      secondaryColor: '#cccccc',
      accentColor: '#00e5ff',
      fontFamily: 'Roboto, sans-serif',
    },
    {
      id: 'template4',
      name: '企业蓝',
      thumbnail: '/templates/corporate-blue-thumb.jpg',
      background: 'linear-gradient(135deg, #0a2463 0%, #3e92cc 100%)',
      textColor: '#ffffff',
      secondaryColor: '#eff1f3',
      accentColor: '#d8315b',
      fontFamily: 'Montserrat, sans-serif',
    },
    {
      id: 'template5',
      name: '暖色调',
      thumbnail: '/templates/warm-colors-thumb.jpg',
      background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
      textColor: '#ffffff',
      secondaryColor: '#ffe8d6',
      accentColor: '#ffca3a',
      fontFamily: 'Open Sans, sans-serif',
    },
  ];

  // Initialize with summary content if available
  useEffect(() => {
    if (summary) {
      setTitle(summary.title);
      
      // Generate poster content based on summary
      const generateContent = async () => {
        setIsGenerating(true);
        try {
          const posterContent = await summaryService.generatePosterContent(
            summary.id,
            { style: 'creative', maxLength: 150 }
          );
          setContent(posterContent);
        } catch (error) {
          console.error('Failed to generate poster content:', error);
          // Use summary content as fallback
          setContent(summary.content.substring(0, 300) + '...');
          addNotification('error', '生成海报文案失败，已使用总结内容');
        } finally {
          setIsGenerating(false);
        }
      };
      
      generateContent();
    }
  }, [summary, addNotification]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Update custom options based on selected template
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomOptions(prev => ({
        ...prev,
        backgroundColor: template.background.startsWith('linear-gradient') 
          ? template.background 
          : template.background,
        textColor: template.textColor,
        accentColor: template.accentColor,
        fontFamily: template.fontFamily,
      }));
    }
  };

  // Handle content regeneration
  const handleRegenerateContent = async () => {
    if (!summary) return;
    
    setIsGenerating(true);
    try {
      const posterContent = await summaryService.generatePosterContent(
        summary.id,
        { style: 'creative', maxLength: 150 }
      );
      setContent(posterContent);
      addNotification('success', '海报文案已重新生成');
    } catch (error) {
      console.error('Failed to regenerate content:', error);
      addNotification('error', '重新生成海报文案失败');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate poster image from the DOM element
  const generatePosterImage = async () => {
    if (!posterRef.current) return;
    
    setIsRendering(true);
    
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: null,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      setPosterImage(imageUrl);
      
      if (onGenerated) {
        onGenerated(imageUrl);
      }
      
      addNotification('success', '海报生成成功');
    } catch (error) {
      console.error('Failed to generate poster:', error);
      addNotification('error', '生成海报图片失败');
    } finally {
      setIsRendering(false);
    }
  };

  // Download generated poster
  const downloadPoster = () => {
    if (!posterImage) return;
    
    const link = document.createElement('a');
    const filename = `poster-${new Date().toISOString().slice(0, 10)}.png`;
    
    link.href = posterImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get current template
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  // Poster style based on current template and custom options
  const posterStyle = {
    background: customOptions.backgroundColor,
    color: customOptions.textColor,
    fontFamily: customOptions.fontFamily,
    borderRadius: customOptions.borderRadius,
    padding: customOptions.padding,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">海报生成器</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Poster preview */}
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm dark:bg-gray-900 p-4 flex flex-col items-center justify-center">
            <div className="relative w-full">
              {/* Poster preview */}
              <div
                ref={posterRef}
                className="w-full aspect-[3/4] overflow-hidden"
                style={posterStyle}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Logo or watermark */}
                  <div className="text-right mb-2 opacity-70 text-sm" style={{ color: customOptions.textColor }}>
                    微信群聊总结
                  </div>
                  
                  {/* Title */}
                  <h2 
                    className="text-2xl font-bold mb-4 leading-tight" 
                    style={{ color: customOptions.textColor }}
                  >
                    {title}
                  </h2>
                  
                  {/* Accent line */}
                  <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: customOptions.accentColor }}></div>
                  
                  {/* Content */}
                  <div className="flex-grow text-lg leading-relaxed" style={{ color: customOptions.textColor }}>
                    {isGenerating ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse">正在生成海报内容...</div>
                      </div>
                    ) : (
                      content
                    )}
                  </div>
                  
                  {/* Footer with date */}
                  <div 
                    className="mt-4 text-sm opacity-80 text-right" 
                    style={{ color: customOptions.textColor }}
                  >
                    {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
              
              {/* Editable overlay */}
              <button 
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-sm hover:bg-white"
                onClick={() => {/* Enable editing mode logic would go here */}}
              >
                <PencilIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={generatePosterImage}
                disabled={isRendering || isGenerating}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isRendering ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    生成海报
                  </>
                )}
              </button>
              
              <button
                onClick={handleRegenerateContent}
                disabled={isGenerating || !summary}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    重新生成文案
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Generated image preview */}
          {posterImage && (
            <motion.div 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm dark:bg-gray-900 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">生成的海报</h3>
              <div className="flex flex-col items-center">
                <img src={posterImage} alt="Generated poster" className="max-h-80 object-contain shadow-lg rounded-md" />
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={downloadPoster}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    下载海报
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Right column - Controls */}
        <div className="space-y-6">
          {/* Template selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">选择模板</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-primary-500 shadow-md' 
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div 
                    className="w-full aspect-[3/4]" 
                    style={{ 
                      background: template.background,
                      borderRadius: '6px',
                    }}
                  >
                    <div className="flex items-center justify-center h-full text-center">
                      <span style={{ color: template.textColor }} className="text-sm font-medium">
                        {template.name}
                      </span>
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <span className="absolute top-1 right-1 bg-primary-500 rounded-full p-1">
                      <CheckIcon className="h-3 w-3 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content edit */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">编辑内容</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="poster-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标题
                </label>
                <input
                  id="poster-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="海报标题"
                />
              </div>
              <div>
                <label htmlFor="poster-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  内容
                </label>
                <textarea
                  id="poster-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="海报内容"
                />
              </div>
            </div>
          </div>
          
          {/* Appearance customization */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">自定义外观</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  文本颜色
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={customOptions.textColor}
                    onChange={(e) => setCustomOptions({...customOptions, textColor: e.target.value})}
                    className="h-8 w-8 rounded-full overflow-hidden cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {customOptions.textColor}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  强调色
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={customOptions.accentColor}
                    onChange={(e) => setCustomOptions({...customOptions, accentColor: e.target.value})}
                    className="h-8 w-8 rounded-full overflow-hidden cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {customOptions.accentColor}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  字体大小
                </label>
                <select
                  value={customOptions.fontSize}
                  onChange={(e) => setCustomOptions({...customOptions, fontSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="14px">小 (14px)</option>
                  <option value="16px">中 (16px)</option>
                  <option value="18px">大 (18px)</option>
                  <option value="20px">特大 (20px)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  圆角
                </label>
                <select
                  value={customOptions.borderRadius}
                  onChange={(e) => setCustomOptions({...customOptions, borderRadius: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="0px">无</option>
                  <option value="8px">小</option>
                  <option value="12px">中</option>
                  <option value="16px">大</option>
                  <option value="24px">特大</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;
