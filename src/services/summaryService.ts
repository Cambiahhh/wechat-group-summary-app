import { ChatMessage, ChatSummary } from '../types';
import deepseekService from './deepseekService';
import wechatService from './wechatService';
import { formatMessageContent, formatSummaryTitle, extractKeywords } from '../utils/formatters';
import { getStartOfDay, getEndOfDay } from '../utils/dateUtils';

/**
 * 聊天总结服务 - 处理微信消息并生成总结
 */
class SummaryService {
  private summaryHistory: ChatSummary[] = [];
  
  /**
   * 根据时间范围生成群聊总结
   */
  async generateSummary(
    groupId: string,
    startDate: Date,
    endDate: Date,
    options: {
      maxTokens?: number;
      temperature?: number;
      language?: 'zh' | 'en';
      detailLevel?: 'brief' | 'detailed' | 'comprehensive';
    } = {}
  ): Promise<ChatSummary> {
    try {
      // 获取群聊信息
      const group = await wechatService.getGroupById(groupId);
      if (!group) {
        throw new Error(`找不到ID为${groupId}的群聊`);
      }
      
      // 获取指定时间范围内的消息
      const messages = await wechatService.getMessagesByTimeRange(
        groupId,
        startDate,
        endDate
      );
      
      if (messages.length === 0) {
        throw new Error('所选时间范围内没有消息');
      }
      
      // 转换消息为文本格式
      const formattedContent = this.formatMessagesToText(messages);
      
      // 调用Deepseek API生成总结
      const summaryContent = await deepseekService.summarizeChat(
        formattedContent,
        options
      );
      
      // 从消息中提取关键词
      const keywords = extractKeywords(messages);
      
      // 创建总结对象
      const summary: ChatSummary = {
        id: `summary_${Date.now()}`,
        title: formatSummaryTitle(group.name, new Date()),
        content: summaryContent,
        groupId: group.id,
        groupName: group.name,
        generatedAt: new Date(),
        timeRange: {
          start: startDate,
          end: endDate,
        },
        messageCount: messages.length,
        wordCount: summaryContent.length,
        keyPoints: this.extractKeyPoints(summaryContent),
        topics: keywords,
        participants: this.getParticipantsStats(messages),
        status: 'completed',
      };
      
      // 保存到历史记录
      this.saveSummary(summary);
      
      return summary;
    } catch (error: any) {
      console.error('生成总结失败:', error);
      throw new Error(`生成总结失败: ${error.message}`);
    }
  }
  
  /**
   * 生成今日群聊总结
   */
  async generateTodaySummary(
    groupId: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      language?: 'zh' | 'en';
      detailLevel?: 'brief' | 'detailed' | 'comprehensive';
    } = {}
  ): Promise<ChatSummary> {
    const today = new Date();
    return this.generateSummary(
      groupId,
      getStartOfDay(today),
      getEndOfDay(today),
      options
    );
  }
  
  /**
   * 生成昨日群聊总结
   */
  async generateYesterdaySummary(
    groupId: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      language?: 'zh' | 'en';
      detailLevel?: 'brief' | 'detailed' | 'comprehensive';
    } = {}
  ): Promise<ChatSummary> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return this.generateSummary(
      groupId,
      getStartOfDay(yesterday),
      getEndOfDay(yesterday),
      options
    );
  }
  
  /**
   * 获取指定群聊的历史总结
   */
  async getSummaryHistory(groupId: string): Promise<ChatSummary[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
    
    return this.summaryHistory
      .filter(summary => summary.groupId === groupId)
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }
  
  /**
   * 获取指定ID的总结
   */
  async getSummaryById(summaryId: string): Promise<ChatSummary | null> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
    
    const summary = this.summaryHistory.find(s => s.id === summaryId);
    return summary || null;
  }
  
  /**
   * 删除指定总结
   */
  async deleteSummary(summaryId: string): Promise<boolean> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
    
    const initialLength = this.summaryHistory.length;
    this.summaryHistory = this.summaryHistory.filter(s => s.id !== summaryId);
    
    return this.summaryHistory.length < initialLength;
  }
  
  /**
   * 保存总结到历史记录
   */
  private saveSummary(summary: ChatSummary): void {
    // 检查是否已存在相同ID的总结，如果存在则更新
    const existingIndex = this.summaryHistory.findIndex(s => s.id === summary.id);
    
    if (existingIndex >= 0) {
      this.summaryHistory[existingIndex] = summary;
    } else {
      this.summaryHistory.push(summary);
    }
    
    // 在实际应用中，这里应该调用API将总结保存到数据库
  }
  
  /**
   * 将消息列表格式化为文本
   */
  private formatMessagesToText(messages: ChatMessage[]): string {
    let formattedText = `以下是微信群聊消息记录，请根据这些内容生成总结：\n\n`;
    
    // 按照发送时间排序
    const sortedMessages = [...messages].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // 格式化每条消息
    sortedMessages.forEach((message, index) => {
      const time = message.timestamp.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      formattedText += `${time} ${message.sender}: `;
      
      switch (message.type) {
        case 'text':
          formattedText += formatMessageContent(message.content);
          break;
        case 'image':
          formattedText += '[图片]';
          break;
        case 'voice':
          formattedText += '[语音]';
          break;
        case 'video':
          formattedText += '[视频]';
          break;
        case 'file':
          formattedText += `[文件] ${message.content}`;
          break;
        case 'location':
          formattedText += '[位置]';
          break;
        case 'system':
          formattedText += `[系统消息] ${message.content}`;
          break;
        default:
          formattedText += message.content;
      }
      
      formattedText += '\n';
    });
    
    return formattedText;
  }
  
  /**
   * 从总结内容中提取关键点
   */
  private extractKeyPoints(summaryContent: string): string[] {
    const keyPoints: string[] = [];
    
    // 使用正则表达式匹配"重要决策和结论"部分的内容
    const conclusionMatch = summaryContent.match(/## 重要决策和结论\s+([\s\S]*?)(?=\s+##|$)/);
    if (conclusionMatch && conclusionMatch[1]) {
      const conclusionText = conclusionMatch[1].trim();
      
      // 按行分割，去除空行
      const lines = conclusionText.split('\n').filter(line => line.trim().length > 0);
      
      // 处理带有序号或无序号的点
      lines.forEach(line => {
        // 移除前导的数字和点或者无序列表符号
        const cleanLine = line.trim().replace(/^(\d+\.|\*|-)\s*/, '');
        if (cleanLine.length > 0) {
          keyPoints.push(cleanLine);
        }
      });
    }
    
    // 如果没有找到关键点，从整个内容中提取一些重要句子
    if (keyPoints.length === 0) {
      const sentences = summaryContent.split(/[.!?。！？]/);
      const importantSentences = sentences
        .filter(s => s.trim().length > 10)
        .filter(s => !s.includes('##'))
        .slice(0, 3);
      
      keyPoints.push(...importantSentences.map(s => s.trim()));
    }
    
    return keyPoints;
  }
  
  /**
   * 获取参与者统计信息
   */
  private getParticipantsStats(messages: ChatMessage[]): {
    userId: string;
    name: string;
    messageCount: number;
  }[] {
    const participantsMap = new Map<string, { userId: string; name: string; messageCount: number }>();
    
    messages.forEach(message => {
      if (!participantsMap.has(message.senderId)) {
        participantsMap.set(message.senderId, {
          userId: message.senderId,
          name: message.sender,
          messageCount: 1
        });
      } else {
        const participant = participantsMap.get(message.senderId)!;
        participant.messageCount += 1;
      }
    });
    
    // 转换为数组并按消息数量排序
    return Array.from(participantsMap.values())
      .sort((a, b) => b.messageCount - a.messageCount);
  }
  
  /**
   * 生成海报文案
   */
  async generatePosterContent(
    summaryId: string,
    options: {
      style?: 'formal' | 'casual' | 'creative';
      maxLength?: number;
    } = {}
  ): Promise<string> {
    try {
      // 获取总结内容
      const summary = await this.getSummaryById(summaryId);
      if (!summary) {
        throw new Error(`找不到ID为${summaryId}的总结`);
      }
      
      // 调用Deepseek API生成海报文案
      const posterContent = await deepseekService.generatePosterContent(
        summary.content,
        {
          style: options.style,
          maxTokens: options.maxLength || 150
        }
      );
      
      return posterContent;
    } catch (error: any) {
      console.error('生成海报文案失败:', error);
      throw new Error(`生成海报文案失败: ${error.message}`);
    }
  }
}

// 导出服务实例
const summaryService = new SummaryService();
export default summaryService;
