import { ChatMessage, ChatSummary } from '../types';

/**
 * 格式化消息内容，处理特殊字符和表情符号
 */
export const formatMessageContent = (content: string): string => {
  if (!content) return '';
  
  // 替换网址为可点击的链接
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  content = content.replace(urlRegex, '<a href="$1" target="_blank" class="text-primary-600 hover:underline">$1</a>');
  
  // 替换常见表情符号
  const emojiMap: Record<string, string> = {
    ':)': '😊',
    ':(': '😢',
    ':D': '😁',
    ';)': '😉',
    ':P': '😋',
    ':O': '😮',
    ':/': '😕',
    ':|': '😐',
    ':*': '😘',
    '<3': '❤️',
    '(y)': '👍',
    '(n)': '👎',
  };
  
  for (const [textEmoji, graphicalEmoji] of Object.entries(emojiMap)) {
    content = content.replace(new RegExp(escapeRegExp(textEmoji), 'g'), graphicalEmoji);
  }
  
  // 处理微信特有的表情符号格式 [表情]
  const wxEmojiRegex = /\[([\u4e00-\u9fa5a-zA-Z0-9]+)\]/g;
  content = content.replace(wxEmojiRegex, (match, emojiName) => {
    // 这里可以根据表情名称返回对应的表情图片或Unicode表情
    // 示例实现，实际应用中可能需要一个更完整的表情映射表
    const commonEmojis: Record<string, string> = {
      '微笑': '😊',
      '撇嘴': '😏',
      '色': '😍',
      '发呆': '😳',
      '得意': '😎',
      '流泪': '😭',
      '害羞': '😊',
      '闭嘴': '🤐',
      '睡': '😴',
      '大哭': '😭',
      '尴尬': '😅',
      '发怒': '😡',
      '调皮': '😜',
      '呲牙': '😁',
      '惊讶': '😲',
      '难过': '😔',
      '酷': '😎',
      '冷汗': '😓',
      '抓狂': '😫',
      '吐': '🤮',
      '偷笑': '🤭',
      '愉快': '😄',
      '白眼': '🙄',
      '傲慢': '😒',
      '困': '😪',
      '惊恐': '😱',
      '憨笑': '😄',
      '赞': '👍',
      '点赞': '👍',
      '踩': '👎',
      'OK': '👌',
    };
    
    return commonEmojis[emojiName] || match;
  });
  
  return content;
};

/**
 * 转义正则表达式中的特殊字符
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 格式化聊天消息，处理不同类型的消息
 */
export const formatChatMessage = (message: ChatMessage): string => {
  if (!message) return '';
  
  switch (message.type) {
    case 'text':
      return formatMessageContent(message.content);
    case 'image':
      return '[图片]';
    case 'voice':
      return '[语音]';
    case 'video':
      return '[视频]';
    case 'file':
      return `[文件] ${message.content}`;
    case 'location':
      return '[位置]';
    case 'system':
      return `[系统消息] ${message.content}`;
    default:
      return message.content;
  }
};

/**
 * 从HTML字符串中提取纯文本
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * 将文本转换为安全的HTML（防止XSS）
 */
export const escapeHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * 格式化总结内容，支持Markdown语法
 */
export const formatSummaryContent = (content: string): string => {
  if (!content) return '';
  
  // 处理标题
  content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // 处理加粗和斜体
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 处理列表
  content = content.replace(/^\s*\d+\.\s(.*)$/gm, '<li>$1</li>');
  content = content.replace(/^\s*[-*]\s(.*)$/gm, '<li>$1</li>');
  
  // 将连续的列表项包装在<ul>或<ol>中（简化实现，实际可能需要更复杂的逻辑）
  const wrappedListItems = content.match(/<li>.*?<\/li>/g);
  if (wrappedListItems) {
    for (const listItemGroup of wrappedListItems) {
      if (listItemGroup.startsWith('<li>1.') || /^<li>\d+\./.test(listItemGroup)) {
        content = content.replace(listItemGroup, `<ol>${listItemGroup}</ol>`);
      } else {
        content = content.replace(listItemGroup, `<ul>${listItemGroup}</ul>`);
      }
    }
  }
  
  // 处理换行
  content = content.replace(/\n\n/g, '<br><br>');
  
  return content;
};

/**
 * 格式化数字（添加千位分隔符）
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-CN').format(num);
};

/**
 * 截断文本并添加省略号
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 格式化聊天群组名称（添加成员数量）
 */
export const formatGroupName = (name: string, membersCount: number): string => {
  return `${name} (${membersCount}人)`;
};

/**
 * 格式化总结标题
 */
export const formatSummaryTitle = (groupName: string, date: Date): string => {
  const formattedDate = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
  
  return `${groupName}聊天总结 (${formattedDate})`;
};

/**
 * 根据消息列表生成总结的关键词
 */
export const extractKeywords = (messages: ChatMessage[]): string[] => {
  if (!messages || !messages.length) return [];
  
  // 简单实现：提取所有文本消息内容，分词并计算频率
  const text = messages
    .filter(msg => msg.type === 'text')
    .map(msg => msg.content)
    .join(' ');
  
  // 分词并过滤常见停用词（实际应用中可能需要使用专业的NLP库）
  const stopWords = ['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
  const words = text.split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  for (const word of words) {
    if (word.length > 1 && !stopWords.includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }
  
  // 按频率排序并返回前10个关键词
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
};

/**
 * 美化显示消息发送时间
 */
export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    // 今天内的消息显示时间
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } else if (diffInHours < 48) {
    // 昨天的消息
    return `昨天 ${new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)}`;
  } else {
    // 更早的消息显示完整日期和时间
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 将纯文本转换为支持换行的HTML
 */
export const textToHtml = (text: string): string => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};
