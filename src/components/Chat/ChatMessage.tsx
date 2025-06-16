import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { formatMessageContent, formatMessageTime } from '../../utils/formatters';
import { UserCircleIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { 
  ShareIcon, 
  BookmarkIcon,
  ClipboardIcon,
  TrashIcon,
  FaceSmileIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage?: boolean;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onReaction?: (messageId: string, reaction: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage = false,
  onReply,
  onDelete,
  onCopy,
  onReaction
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content)
        .then(() => console.log('Content copied to clipboard'))
        .catch(err => console.error('Failed to copy: ', err));
    }
    setShowOptions(false);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {formatMessageContent(message.content)}
          </p>
        );
      case 'image':
        return (
          <div className="relative max-w-xs">
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <span className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                [图片]
              </span>
              {/* For actual implementation, uncomment this and use real image URL */}
              {/* <img 
                src={message.content} 
                alt="Shared image" 
                className="w-full h-full object-cover"
                loading="lazy"
              /> */}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200 flex items-center justify-center">
              <button className="opacity-0 hover:opacity-100 bg-black bg-opacity-50 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="flex items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-700">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
            <div className="ml-2">
              <div className="flex items-center space-x-2">
                <div className="w-24 h-1.5 bg-gray-300 rounded-full overflow-hidden dark:bg-gray-600">
                  <div className="bg-blue-500 h-full w-1/2 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">0:08</span>
              </div>
              <button className="mt-1 text-xs text-blue-500">播放</button>
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{message.content}</p>
              <button className="mt-1 text-xs text-blue-500">下载</button>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="relative max-w-xs">
            <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">0:45</span>
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">位置分享</span>
            </div>
            <div className="mt-1 bg-gray-200 w-full h-20 rounded dark:bg-gray-600">
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                地图预览
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{message.content}</p>
          </div>
        );
      case 'system':
        return (
          <div className="bg-gray-100 px-3 py-2 rounded-lg text-center text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            {message.content}
          </div>
        );
      default:
        return <p className="text-gray-700 dark:text-gray-300">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative group flex mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => {
        setShowOptions(false);
        setShowReactions(false);
      }}
    >
      {/* User avatar */}
      <div className="flex-shrink-0">
        {message.avatar ? (
          <img
            src={message.avatar}
            alt={message.sender}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
            <UserCircleIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={`max-w-[80%] ${isOwnMessage ? 'mr-3' : 'ml-3'}`}>
        <div className={`flex items-baseline ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
          <span className={`font-medium text-gray-900 dark:text-white ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
            {message.sender}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
        <div className={`mt-1 px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100' 
            : 'bg-white shadow-sm dark:bg-gray-800'
        }`}>
          {renderMessageContent()}
        </div>

        {/* Reply to message indicator */}
        {message.replyTo && (
          <div className="mt-1 ml-2 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">回复消息</p>
          </div>
        )}

        {/* Message options */}
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} top-0 mt-8 bg-white rounded-lg shadow-lg z-10 dark:bg-gray-800`}
          >
            {showReactions ? (
              <div className="flex p-1 space-x-1">
                {reactions.map((reaction) => (
                  <button
                    key={reaction}
                    className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                    onClick={() => {
                      onReaction && onReaction(message.id, reaction);
                      setShowReactions(false);
                      setShowOptions(false);
                    }}
                  >
                    <span className="text-xl">{reaction}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex p-1">
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                  onClick={() => setShowReactions(true)}
                >
                  <FaceSmileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                  onClick={() => {
                    onReply && onReply(message.id);
                    setShowOptions(false);
                  }}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                  onClick={handleCopy}
                >
                  <ClipboardIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                  onClick={() => {
                    // Implementation would depend on share API availability
                    setShowOptions(false);
                  }}
                >
                  <ShareIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                  onClick={() => {
                    // Implementation would depend on bookmark functionality
                    setShowOptions(false);
                  }}
                >
                  <BookmarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                {onDelete && (
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                    onClick={() => {
                      onDelete(message.id);
                      setShowOptions(false);
                    }}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {/* Message reactions display (if any) */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex mt-1 ml-2">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="mr-1 bg-gray-100 rounded-full px-2 py-0.5 text-xs dark:bg-gray-700">
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Message options trigger for mobile */}
      <button 
        className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
      >
        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
      </button>
    </motion.div>
  );
};

export default ChatMessage;
