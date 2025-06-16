import React, { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChatMessage } from '../../types';
import { formatMessageContent, formatMessageTime } from '../../utils/formatters';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface ChatListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

/**
 * 聊天列表组件 - 展示微信消息列表，按时间线分组
 */
const ChatList: React.FC<ChatListProps> = ({
  messages,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = '没有消息记录'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // 按日期分组的消息
  const [groupedMessages, setGroupedMessages] = useState<{
    date: string;
    messages: ChatMessage[];
  }[]>([]);

  // 处理消息分组
  useEffect(() => {
    if (!messages?.length) {
      setGroupedMessages([]);
      return;
    }

    const groups = messages.reduce((acc, message) => {
      const messageDate = new Date(message.timestamp);
      let dateStr: string;
      
      if (isToday(messageDate)) {
        dateStr = '今天';
      } else if (isYesterday(messageDate)) {
        dateStr = '昨天';
      } else {
        dateStr = format(messageDate, 'yyyy年MM月dd日', { locale: zhCN });
      }
      
      const existingGroup = acc.find(group => group.date === dateStr);
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        acc.push({
          date: dateStr,
          messages: [message],
        });
      }
      
      return acc;
    }, [] as { date: string; messages: ChatMessage[] }[]);
    
    // 确保每个组内的消息按时间排序
    groups.forEach(group => {
      group.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
    
    // 按日期从最近到最早排序
    groups.sort((a, b) => {
      if (a.date === '今天') return -1;
      if (b.date === '今天') return 1;
      if (a.date === '昨天') return -1;
      if (b.date === '昨天') return 1;
      
      const dateA = new Date(a.date.replace(/年|月|日/g, match => match === '年' ? '-' : match === '月' ? '-' : ''));
      const dateB = new Date(b.date.replace(/年|月|日/g, match => match === '年' ? '-' : match === '月' ? '-' : ''));
      
      return dateB.getTime() - dateA.getTime();
    });
    
    setGroupedMessages(groups);
  }, [messages]);

  // 设置无限滚动
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, onLoadMore, isLoading]);

  // 渲染消息项
  const renderMessage = (message: ChatMessage) => {
    return (
      <motion.div 
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex mb-4"
      >
        {/* 用户头像 */}
        <div className="flex-shrink-0">
          {message.avatar ? (
            <img 
              src={message.avatar} 
              alt={message.sender}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
              <UserCircleIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        {/* 消息内容 */}
        <div className="ml-3 max-w-[80%]">
          <div className="flex items-baseline">
            <span className="font-medium text-gray-900 dark:text-white">{message.sender}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>
          <div className="mt-1 px-4 py-2 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            {message.type === 'text' ? (
              <p className="text-gray-700 dark:text-gray-300">{formatMessageContent(message.content)}</p>
            ) : message.type === 'image' ? (
              <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-700">
                <span className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  [图片]
                </span>
              </div>
            ) : message.type === 'file' ? (
              <div className="flex items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-700">
                <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="ml-2 text-gray-700 dark:text-gray-300">{message.content}</span>
              </div>
            ) : message.type === 'voice' ? (
              <div className="flex items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-700">
                <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                <span className="ml-2 text-gray-700 dark:text-gray-300">[语音]</span>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
            )}
          </div>
          
          {/* 回复消息显示 */}
          {message.replyTo && (
            <div className="mt-1 ml-2 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">回复消息</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染日期分组
  const renderDateGroup = (dateGroup: { date: string; messages: ChatMessage[] }, index: number) => {
    return (
      <div key={`date-${dateGroup.date}-${index}`} className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {dateGroup.date}
          </div>
        </div>
        <div className="space-y-4">
          {dateGroup.messages.map(renderMessage)}
        </div>
      </div>
    );
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-col h-full overflow-y-auto p-4"
    >
      {isLoading && messages.length === 0 ? (
        <div className="flex justify-center p-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {hasMore && (
            <div 
              ref={loadMoreRef} 
              className="flex justify-center p-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <button 
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={onLoadMore}
                >
                  加载更多
                </button>
              )}
            </div>
          )}
          
          {groupedMessages.map(renderDateGroup)}
        </>
      )}
    </div>
  );
};

export default ChatList;
