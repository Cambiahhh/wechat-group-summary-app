import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { ChatMessage } from '../../types';

interface ChatImportProps {
  onImportComplete: (messages: ChatMessage[]) => void;
  isProcessing?: boolean;
  error?: string | null;
}

const ChatImport: React.FC<ChatImportProps> = ({
  onImportComplete,
  isProcessing = false,
  error = null,
}) => {
  // State for handling different import methods
  const [importMethod, setImportMethod] = useState<'file' | 'manual'>('file');
  const [manualText, setManualText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [parsedMessages, setParsedMessages] = useState<ChatMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setImportStatus('idle');
      // Reset any previous errors or progress
      setUploadProgress(0);
    }
  };

  // Handle file drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setImportStatus('idle');
      setUploadProgress(0);
    }
  };

  // Prevent default behaviors for drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle manual text input
  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setManualText(e.target.value);
    setImportStatus('idle');
  };

  // Process and parse the imported file or manual text
  const handleProcessImport = async () => {
    if (importMethod === 'file' && !selectedFile) {
      setImportStatus('error');
      return;
    }

    if (importMethod === 'manual' && !manualText.trim()) {
      setImportStatus('error');
      return;
    }

    setImportStatus('importing');

    try {
      let importedMessages: ChatMessage[] = [];

      if (importMethod === 'file') {
        // Simulate file processing with progress updates
        await simulateFileProcessing();

        // In a real application, you would parse the file content here
        // For example:
        const fileContent = await readFileContent(selectedFile!);
        importedMessages = parseMessageContent(fileContent);
      } else {
        // Parse manual text input
        importedMessages = parseMessageContent(manualText);
      }

      setParsedMessages(importedMessages);
      onImportComplete(importedMessages);
      setImportStatus('success');
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    }
  };

  // Simulate file processing with progress updates
  const simulateFileProcessing = async (): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });
  };

  // Read file content
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  // Parse message content into ChatMessage objects
  const parseMessageContent = (content: string): ChatMessage[] => {
    // This is a simplified example parser
    // In a real app, you would implement a proper parser based on WeChat export format
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const messages: ChatMessage[] = [];
    
    lines.forEach((line, index) => {
      // Simple parsing logic (for demonstration)
      // Format expected: [time] sender: message
      const match = line.match(/\[(.*?)\]\s*(.*?):\s*(.*)/);
      
      if (match) {
        const [_, timeStr, sender, content] = match;
        const timestamp = new Date();
        
        try {
          // Try to parse time if in a recognizable format
          const timeParts = timeStr.split(':');
          if (timeParts.length >= 2) {
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            timestamp.setHours(hours, minutes, 0, 0);
          }
        } catch (e) {
          // Ignore time parsing errors
        }
        
        messages.push({
          id: `imported_${index}`,
          sender,
          senderId: `sender_${index}`,
          content,
          timestamp,
          type: 'text',
          groupId: 'imported_group',
        });
      }
    });
    
    return messages;
  };

  // Handle file selection via button click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear the selected file or manual text
  const handleClearInput = () => {
    if (importMethod === 'file') {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setManualText('');
    }
    setImportStatus('idle');
    setUploadProgress(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">导入聊天记录</h2>
      
      {/* Import method selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              importMethod === 'file'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setImportMethod('file')}
          >
            <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
            上传文件
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center ${
              importMethod === 'manual'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setImportMethod('manual')}
          >
            <PencilSquareIcon className="w-5 h-5 mr-2" />
            手动输入
          </button>
        </div>
      </div>

      {/* File upload section */}
      {importMethod === 'file' && (
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".txt,.html,.csv"
          />
          
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-500"
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleFileDrop}
            >
              <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                点击或拖拽文件至此处上传
              </p>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-500">
                支持 .txt, .html, .csv 格式文件
              </p>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-8 h-8 text-primary-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={handleClearInput}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    处理中... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual text input section */}
      {importMethod === 'manual' && (
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={manualText}
              onChange={handleManualTextChange}
              placeholder="请粘贴聊天记录，每行格式为：[时间] 发送者: 消息内容"
              className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {manualText && (
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={handleClearInput}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            示例：[10:30] 张三: 早上好，今天的会议几点开始？
          </p>
        </div>
      )}

      {/* Status messages */}
      {importStatus === 'error' || error ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start dark:bg-red-900/30 dark:text-red-400"
        >
          <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">导入失败</p>
            <p className="text-sm">
              {error || (importMethod === 'file' ? '请选择有效的文件' : '请输入有效的聊天记录')}
            </p>
          </div>
        </motion.div>
      ) : importStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-start dark:bg-green-900/30 dark:text-green-400"
        >
          <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">导入成功</p>
            <p className="text-sm">成功导入 {parsedMessages.length} 条消息</p>
          </div>
        </motion.div>
      ) : null}

      {/* Action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          onClick={handleClearInput}
        >
          清除
        </button>
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-gray-800"
          onClick={handleProcessImport}
          disabled={
            isProcessing ||
            importStatus === 'importing' ||
            (importMethod === 'file' && !selectedFile) ||
            (importMethod === 'manual' && !manualText.trim())
          }
        >
          {isProcessing || importStatus === 'importing' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </>
          ) : (
            '开始导入'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatImport;
