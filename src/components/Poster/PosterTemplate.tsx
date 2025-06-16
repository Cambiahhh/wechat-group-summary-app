import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatSummary } from '../../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

// Types for poster templates
export interface PosterTemplateType {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  aspectRatio: '1:1' | '4:3' | '3:4' | '16:9';
  background: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  preview: React.ReactNode;
}

interface PosterTemplateProps {
  summary?: ChatSummary;
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
  customText?: {
    title?: string;
    content?: string;
  };
}

const PosterTemplate: React.FC<PosterTemplateProps> = ({
  summary,
  selectedTemplateId = 'template1',
  onSelectTemplate,
  customText,
}) => {
  const [previewMode, setPreviewMode] = useState<'grid' | 'carousel'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Use custom text if provided, otherwise use summary data
  const title = customText?.title || summary?.title || '群聊内容总结';
  const content = customText?.content || summary?.content?.substring(0, 200) || '这里将显示总结内容...';
  const currentDate = format(new Date(), 'yyyy年MM月dd日', { locale: zhCN });

  // Define available poster templates
  const templates: PosterTemplateType[] = [
    {
      id: 'template1',
      name: '蓝色渐变',
      description: '清新简约的蓝色渐变背景设计，适合正式场合',
      thumbnail: '/templates/blue-gradient-thumb.jpg',
      aspectRatio: '3:4',
      background: 'linear-gradient(135deg, #1a75ff 0%, #0043a9 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
      fontFamily: 'Arial, sans-serif',
      preview: (
        <div className="h-full" style={{ background: 'linear-gradient(135deg, #1a75ff 0%, #0043a9 100%)', color: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
          <div className="p-6 flex flex-col h-full">
            <div className="text-right mb-2 opacity-70 text-sm">微信群聊总结</div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
            <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: '#ffd700' }}></div>
            <div className="flex-grow text-base leading-relaxed">{content}</div>
            <div className="mt-4 text-sm opacity-80 text-right">{currentDate}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'template2',
      name: '极简白',
      description: '简洁明亮的白色背景设计，突出文字内容',
      thumbnail: '/templates/minimalist-white-thumb.jpg',
      aspectRatio: '3:4',
      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
      textColor: '#333333',
      accentColor: '#ff4081',
      fontFamily: '"Helvetica Neue", sans-serif',
      preview: (
        <div className="h-full" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)', color: '#333333', fontFamily: '"Helvetica Neue", sans-serif' }}>
          <div className="p-6 flex flex-col h-full">
            <div className="text-right mb-2 opacity-70 text-sm">微信群聊总结</div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
            <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: '#ff4081' }}></div>
            <div className="flex-grow text-base leading-relaxed">{content}</div>
            <div className="mt-4 text-sm opacity-80 text-right">{currentDate}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'template3',
      name: '夜间模式',
      description: '暗色系设计，降低视觉疲劳，适合夜间查看',
      thumbnail: '/templates/dark-mode-thumb.jpg',
      aspectRatio: '3:4',
      background: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)',
      textColor: '#ffffff',
      accentColor: '#00e5ff',
      fontFamily: 'Roboto, sans-serif',
      preview: (
        <div className="h-full" style={{ background: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)', color: '#ffffff', fontFamily: 'Roboto, sans-serif' }}>
          <div className="p-6 flex flex-col h-full">
            <div className="text-right mb-2 opacity-70 text-sm">微信群聊总结</div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
            <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: '#00e5ff' }}></div>
            <div className="flex-grow text-base leading-relaxed">{content}</div>
            <div className="mt-4 text-sm opacity-80 text-right">{currentDate}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'template4',
      name: '企业蓝',
      description: '专业稳重的蓝色设计，适合商务和工作场景',
      thumbnail: '/templates/corporate-blue-thumb.jpg',
      aspectRatio: '3:4',
      background: 'linear-gradient(135deg, #0a2463 0%, #3e92cc 100%)',
      textColor: '#ffffff',
      accentColor: '#d8315b',
      fontFamily: 'Montserrat, sans-serif',
      preview: (
        <div className="h-full" style={{ background: 'linear-gradient(135deg, #0a2463 0%, #3e92cc 100%)', color: '#ffffff', fontFamily: 'Montserrat, sans-serif' }}>
          <div className="p-6 flex flex-col h-full">
            <div className="text-right mb-2 opacity-70 text-sm">微信群聊总结</div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
            <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: '#d8315b' }}></div>
            <div className="flex-grow text-base leading-relaxed">{content}</div>
            <div className="mt-4 text-sm opacity-80 text-right">{currentDate}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'template5',
      name: '暖色调',
      description: '温暖活泼的橙红色系设计，适合轻松活跃的内容',
      thumbnail: '/templates/warm-colors-thumb.jpg',
      aspectRatio: '3:4',
      background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
      textColor: '#ffffff',
      accentColor: '#ffca3a',
      fontFamily: 'Open Sans, sans-serif',
      preview: (
        <div className="h-full" style={{ background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', color: '#ffffff', fontFamily: 'Open Sans, sans-serif' }}>
          <div className="p-6 flex flex-col h-full">
            <div className="text-right mb-2 opacity-70 text-sm">微信群聊总结</div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
            <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: '#ffca3a' }}></div>
            <div className="flex-grow text-base leading-relaxed">{content}</div>
            <div className="mt-4 text-sm opacity-80 text-right">{currentDate}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'template6',
      name: '绿色环保',
      description: '清新的绿色主题，传递环保和生机的感觉',
      thumbnail: '/templates/green-nature-thumb.jpg',
      aspectRatio: '3:4',
      background: 'linear-gradient(135deg, #76b852 0%, #8DC26F 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd166',
      fontFamily: 'Lato, sans-serif',
      preview: (
        <div className="h-full" style={{ background: 'linear-gradient(135deg, #76b852 0%, #8DC26F 100%)', color: '#ffffff', fontFamily: 'Lato, sans-serif' }}>
          <div className="p-6 flex flex-col h-full">
            <div className="text-right mb-2 opacity-70 text-sm">微信群聊总结</div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">{title}</h2>
            <div className="w-1/4 h-1 mb-4" style={{ backgroundColor: '#ffd166' }}></div>
            <div className="flex-grow text-base leading-relaxed">{content}</div>
            <div className="mt-4 text-sm opacity-80 text-right">{currentDate}</div>
          </div>
        </div>
      ),
    },
  ];

  // Handlers
  const handleNextTemplate = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length);
  };

  const handlePreviousTemplate = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + templates.length) % templates.length);
  };

  const togglePreviewMode = () => {
    setPreviewMode((prev) => (prev === 'grid' ? 'carousel' : 'grid'));
  };

  const toggleExpandPreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  // Selected template
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">选择海报模板</h2>
        <div className="flex space-x-2">
          <button
            onClick={togglePreviewMode}
            className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            {previewMode === 'grid' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleExpandPreview}
            className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {previewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all h-40 ${
                selectedTemplateId === template.id
                  ? 'border-primary-500 shadow-md'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-full w-full">
                {template.preview}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-center text-xs">
                {template.name}
              </div>
              {selectedTemplateId === template.id && (
                <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Carousel View */}
      {previewMode === 'carousel' && (
        <div className="relative">
          <div className="flex justify-center items-center">
            <button
              onClick={handlePreviousTemplate}
              className="absolute left-0 z-10 p-1 bg-white bg-opacity-80 rounded-full shadow-md dark:bg-gray-800"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-96 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-full w-full">
                {templates[currentIndex].preview}
              </div>
            </motion.div>
            
            <button
              onClick={handleNextTemplate}
              className="absolute right-0 z-10 p-1 bg-white bg-opacity-80 rounded-full shadow-md dark:bg-gray-800"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{templates[currentIndex].name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{templates[currentIndex].description}</p>
            <div className="flex justify-center mt-2">
              {templates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`mx-1 w-2 h-2 rounded-full ${
                    currentIndex === index ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => onSelectTemplate(templates[currentIndex].id)}
              className={`mt-4 px-4 py-2 rounded-md ${
                selectedTemplateId === templates[currentIndex].id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {selectedTemplateId === templates[currentIndex].id ? '已选择' : '选择此模板'}
            </button>
          </div>
        </div>
      )}

      {/* Expanded Preview Modal */}
      {isPreviewExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl dark:bg-gray-800">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedTemplate.name} - 预览
              </h3>
              <button
                onClick={toggleExpandPreview}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="w-full h-[60vh] rounded-lg overflow-hidden shadow-lg">
                {selectedTemplate.preview}
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-500 dark:text-gray-400">{selectedTemplate.description}</p>
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={toggleExpandPreview}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          当前选择: {selectedTemplate.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {selectedTemplate.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs dark:bg-gray-600 dark:text-gray-300">
            尺寸比例: {selectedTemplate.aspectRatio}
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs dark:bg-gray-600 dark:text-gray-300">
            字体: {selectedTemplate.fontFamily.split(',')[0].replace(/["']/g, '')}
          </span>
          <span 
            className="inline-flex items-center px-2 py-1 rounded-md text-xs text-white"
            style={{ backgroundColor: selectedTemplate.accentColor }}
          >
            强调色
          </span>
        </div>
      </div>
    </div>
  );
};

// Export responsive wrapper for different devices
export const ResponsivePosterTemplate: React.FC<PosterTemplateProps> = (props) => {
  return (
    <div className="poster-template-responsive">
      {/* Mobile View */}
      <div className="block md:hidden">
        <PosterTemplate {...props} />
      </div>
      
      {/* Tablet/Desktop View */}
      <div className="hidden md:block">
        <PosterTemplate {...props} />
      </div>
    </div>
  );
};

export default PosterTemplate;
</file_content>
