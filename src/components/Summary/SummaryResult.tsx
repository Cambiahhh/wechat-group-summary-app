import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardIcon, 
  ShareIcon, 
  DocumentDuplicateIcon,
  ChevronDownIcon,
  CheckIcon,
  DocumentArrowDownIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { ChatSummary } from '../../types';
import { format } from 'date-fns';

interface SummaryResultProps {
  summary: ChatSummary | null;
  isLoading?: boolean;
  onCopy?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
}

/**
 * 总结结果组件，显示AI生成的群聊总结内容
 */
const SummaryResult: React.FC<SummaryResultProps> = ({
  summary,
  isLoading = false,
  onCopy,
  onShare,
  onDownload,
  onEdit
}) => {
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle copy to clipboard
  const handleCopy = () => {
    if (!summary?.content) return;
    
    navigator.clipboard.writeText(summary.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onCopy) onCopy();
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  // Handle share
  const handleShare = () => {
    if (!summary?.content) return;
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: summary.title,
        text: summary.content,
      })
      .catch(err => console.error('Error sharing: ', err));
    } else {
      // Fallback to custom share handler
      if (onShare) onShare();
    }
  };

  // Format content with proper styling
  const formatContent = (content: string) => {
    if (!content) return '';
    
    // Replace markdown headings with styled divs
    let formattedContent = content.replace(/## (.*?)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h2>');
    
    // Replace bullet points
    formattedContent = formattedContent.replace(/- (.*?)$/gm, '<li class="ml-4">$1</li>');
    
    // Replace bold text
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Add paragraph tags to text blocks
    formattedContent = formattedContent.split('\n\n').map(paragraph => {
      // Skip if it's already a heading or list
      if (paragraph.startsWith('<h2') || paragraph.startsWith('<li')) {
        return paragraph;
      }
      return `<p class="mb-3">${paragraph}</p>`;
    }).join('');
    
    return formattedContent;
  };

  // Get text size class based on selected size
  const getTextSizeClass = () => {
    switch (textSize) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800 min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">正在生成总结...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <DocumentDuplicateIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">暂无总结内容</h3>
          <p className="text-gray-500 dark:text-gray-400">
            请从左侧选择群聊并点击生成总结按钮
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm dark:bg-gray-800 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with title and actions */}
      <div className="border-b dark:border-gray-700 p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{summary.title}</h2>
          <div className="flex space-x-2">
            {/* Format options button */}
            <div className="relative">
              <button
                onClick={() => setShowFormatOptions(!showFormatOptions)}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              
              {/* Format options dropdown */}
              {showFormatOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 dark:bg-gray-700">
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">文本大小</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setTextSize('sm')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          textSize === 'sm' 
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        小
                      </button>
                      <button 
                        onClick={() => setTextSize('base')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          textSize === 'base' 
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        中
                      </button>
                      <button 
                        onClick={() => setTextSize('lg')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          textSize === 'lg' 
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        大
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 relative group"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardIcon className="w-5 h-5" />
              )}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                复制
              </span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 relative group"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                分享
              </span>
            </button>

            {/* Download button */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 relative group"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  下载
                </span>
              </button>
            )}
          </div>
        </div>
        
        {/* Summary metadata */}
        <div className="mt-2 flex flex-wrap text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-4 mb-1">
            生成时间: {format(summary.generatedAt, 'yyyy-MM-dd HH:mm')}
          </span>
          <span className="mr-4 mb-1">
            消息数: {summary.messageCount}
          </span>
          <span className="mr-4 mb-1">
            字数: {summary.wordCount}
          </span>
          <span className="mb-1">
            群组: {summary.groupName}
          </span>
        </div>
      </div>

      {/* Summary content */}
      <div className="flex-1 p-6 overflow-auto">
        <div 
          className={`prose prose-sm max-w-none dark:prose-invert ${getTextSizeClass()}`}
          dangerouslySetInnerHTML={{ __html: formatContent(summary.content) }}
        ></div>
        
        {/* Key points section */}
        {summary.keyPoints && summary.keyPoints.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg dark:bg-gray-700/50">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">核心要点</h3>
            <ul className="space-y-1">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-800 text-xs mr-2 dark:bg-primary-900 dark:text-primary-200">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer with topics/tags */}
      {summary.topics && summary.topics.length > 0 && (
        <div className="border-t dark:border-gray-700 p-4">
          <div className="flex flex-wrap gap-2">
            {summary.topics.map((topic, index) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SummaryResult;
