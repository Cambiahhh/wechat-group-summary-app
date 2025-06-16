import { ChatMessage, ChatGroup, User } from '../types';
import { formatMessageContent, formatChatMessage } from '../utils/formatters';
import { getStartOfDay, getEndOfDay } from '../utils/dateUtils';

/**
 * 微信消息服务 - 模拟微信API行为，用于获取和处理群聊消息
 */
class WeChatService {
  // 模拟数据存储
  private groups: ChatGroup[];
  private messages: ChatMessage[];
  private users: User[];
  
  constructor() {
    // 初始化模拟数据
    this.groups = this.initMockGroups();
    this.users = this.initMockUsers();
    this.messages = this.initMockMessages();
  }

  /**
   * 获取所有群聊列表
   */
  async getGroups(): Promise<ChatGroup[]> {
    // 模拟API延迟
    await this.mockApiDelay();
    return [...this.groups];
  }

  /**
   * 获取指定群聊信息
   */
  async getGroupById(groupId: string): Promise<ChatGroup | null> {
    await this.mockApiDelay();
    const group = this.groups.find(g => g.id === groupId);
    return group || null;
  }

  /**
   * 获取指定群聊的所有消息
   */
  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    await this.mockApiDelay();
    return this.messages.filter(m => m.groupId === groupId);
  }

  /**
   * 按时间范围过滤消息
   */
  async getMessagesByTimeRange(
    groupId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<ChatMessage[]> {
    await this.mockApiDelay();
    
    // 确保开始和结束时间是当天的开始和结束
    const start = getStartOfDay(startDate);
    const end = getEndOfDay(endDate);
    
    return this.messages.filter(message => 
      message.groupId === groupId &&
      message.timestamp >= start &&
      message.timestamp <= end
    );
  }

  /**
   * 获取今日消息
   */
  async getTodayMessages(groupId: string): Promise<ChatMessage[]> {
    const today = new Date();
    return this.getMessagesByTimeRange(groupId, today, today);
  }

  /**
   * 获取昨日消息
   */
  async getYesterdayMessages(groupId: string): Promise<ChatMessage[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getMessagesByTimeRange(groupId, yesterday, yesterday);
  }

  /**
   * 获取本周消息
   */
  async getThisWeekMessages(groupId: string): Promise<ChatMessage[]> {
    await this.mockApiDelay();
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // 从周一开始
    
    return this.messages.filter(message => 
      message.groupId === groupId &&
      message.timestamp >= getStartOfDay(startOfWeek) &&
      message.timestamp <= getEndOfDay(today)
    );
  }

  /**
   * 按关键词搜索消息
   */
  async searchMessages(groupId: string, keyword: string): Promise<ChatMessage[]> {
    await this.mockApiDelay();
    
    if (!keyword.trim()) return [];
    
    const lowerKeyword = keyword.toLowerCase();
    return this.messages.filter(message => 
      message.groupId === groupId &&
      message.content.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 获取指定用户在群聊中的消息
   */
  async getUserMessages(groupId: string, userId: string): Promise<ChatMessage[]> {
    await this.mockApiDelay();
    
    return this.messages.filter(message => 
      message.groupId === groupId &&
      message.senderId === userId
    );
  }

  /**
   * 模拟发送消息
   */
  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    await this.mockApiDelay();
    
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
    };
    
    this.messages.push(newMessage);
    return newMessage;
  }

  /**
   * 获取群聊消息统计
   */
  async getGroupStats(groupId: string): Promise<{
    totalMessages: number;
    activeUsers: number;
    lastActiveTime: Date;
  }> {
    await this.mockApiDelay();
    
    const groupMessages = this.messages.filter(m => m.groupId === groupId);
    const uniqueUsers = new Set(groupMessages.map(m => m.senderId));
    
    // 获取最后活跃时间
    const timestamps = groupMessages.map(m => m.timestamp);
    const lastActiveTime = timestamps.length > 0 
      ? new Date(Math.max(...timestamps.map(t => t.getTime())))
      : new Date();
    
    return {
      totalMessages: groupMessages.length,
      activeUsers: uniqueUsers.size,
      lastActiveTime,
    };
  }

  /**
   * 模拟API延迟
   */
  private async mockApiDelay(minMs = 100, maxMs = 500): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * 初始化模拟群聊数据
   */
  private initMockGroups(): ChatGroup[] {
    return [
      {
        id: '1',
        name: '产品讨论群',
        description: '用于讨论产品功能和规划',
        members: [
          { userId: 'user1', name: '张三', role: 'owner', joinedAt: new Date(2023, 0, 15) },
          { userId: 'user2', name: '李四', role: 'admin', joinedAt: new Date(2023, 0, 15) },
          { userId: 'user3', name: '王五', role: 'member', joinedAt: new Date(2023, 0, 16) },
          { userId: 'user4', name: '赵六', role: 'member', joinedAt: new Date(2023, 0, 17) },
        ],
        createdAt: new Date(2023, 0, 15),
        lastActiveAt: new Date(),
        messageCount: 1258,
        isArchived: false,
        settings: {
          autoSummary: true,
          summaryFrequency: 'daily',
          posterGeneration: true,
        }
      },
      {
        id: '2',
        name: '技术支持群',
        description: '解决用户技术问题',
        members: [
          { userId: 'user1', name: '张三', role: 'admin', joinedAt: new Date(2023, 1, 10) },
          { userId: 'user4', name: '赵六', role: 'owner', joinedAt: new Date(2023, 1, 10) },
          { userId: 'user5', name: '钱七', role: 'member', joinedAt: new Date(2023, 1, 11) },
        ],
        createdAt: new Date(2023, 1, 10),
        lastActiveAt: new Date(),
        messageCount: 867,
        isArchived: false,
        settings: {
          autoSummary: true,
          summaryFrequency: 'weekly',
          posterGeneration: false,
        }
      },
      {
        id: '3',
        name: '市场营销群',
        description: '讨论市场策略和活动',
        members: [
          { userId: 'user2', name: '李四', role: 'owner', joinedAt: new Date(2023, 2, 5) },
          { userId: 'user6', name: '孙八', role: 'admin', joinedAt: new Date(2023, 2, 5) },
          { userId: 'user7', name: '周九', role: 'member', joinedAt: new Date(2023, 2, 6) },
          { userId: 'user8', name: '吴十', role: 'member', joinedAt: new Date(2023, 2, 7) },
        ],
        createdAt: new Date(2023, 2, 5),
        lastActiveAt: new Date(),
        messageCount: 976,
        isArchived: false,
        settings: {
          autoSummary: true,
          summaryFrequency: 'daily',
          posterGeneration: true,
          posterTemplate: 'template1',
        }
      },
      {
        id: '4',
        name: '客户服务群',
        description: '处理客户反馈和投诉',
        members: [
          { userId: 'user3', name: '王五', role: 'admin', joinedAt: new Date(2023, 3, 20) },
          { userId: 'user5', name: '钱七', role: 'owner', joinedAt: new Date(2023, 3, 20) },
          { userId: 'user9', name: '郑十一', role: 'member', joinedAt: new Date(2023, 3, 21) },
        ],
        createdAt: new Date(2023, 3, 20),
        lastActiveAt: new Date(),
        messageCount: 623,
        isArchived: false,
        settings: {
          autoSummary: false,
          summaryFrequency: 'daily',
          posterGeneration: false,
        }
      },
      {
        id: '5',
        name: '公司公告群',
        description: '公司重要通知发布',
        members: [
          { userId: 'user1', name: '张三', role: 'owner', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user2', name: '李四', role: 'admin', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user3', name: '王五', role: 'member', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user4', name: '赵六', role: 'member', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user5', name: '钱七', role: 'member', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user6', name: '孙八', role: 'member', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user7', name: '周九', role: 'member', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user8', name: '吴十', role: 'member', joinedAt: new Date(2023, 0, 1) },
          { userId: 'user9', name: '郑十一', role: 'member', joinedAt: new Date(2023, 0, 1) },
        ],
        createdAt: new Date(2023, 0, 1),
        lastActiveAt: new Date(),
        messageCount: 152,
        isArchived: false,
        settings: {
          autoSummary: true,
          summaryFrequency: 'weekly',
          posterGeneration: true,
          posterTemplate: 'template2',
        }
      },
    ];
  }

  /**
   * 初始化模拟用户数据
   */
  private initMockUsers(): User[] {
    return [
      {
        id: 'user1',
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'admin',
        groups: ['1', '2', '5'],
        isActive: true,
        lastSeen: new Date(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSummary: true,
          summaryFrequency: 'daily',
        }
      },
      {
        id: 'user2',
        name: '李四',
        email: 'lisi@example.com',
        role: 'admin',
        groups: ['1', '3', '5'],
        isActive: true,
        lastSeen: new Date(),
        preferences: {
          theme: 'dark',
          notifications: true,
          autoSummary: true,
          summaryFrequency: 'daily',
        }
      },
      {
        id: 'user3',
        name: '王五',
        role: 'user',
        groups: ['1', '4', '5'],
        isActive: true,
        lastSeen: new Date(),
      },
      {
        id: 'user4',
        name: '赵六',
        role: 'user',
        groups: ['1', '2', '5'],
        isActive: true,
        lastSeen: new Date(),
      },
      {
        id: 'user5',
        name: '钱七',
        role: 'user',
        groups: ['2', '4', '5'],
        isActive: false,
        lastSeen: new Date(2023, 5, 15),
      },
      {
        id: 'user6',
        name: '孙八',
        role: 'user',
        groups: ['3', '5'],
        isActive: true,
        lastSeen: new Date(),
      },
      {
        id: 'user7',
        name: '周九',
        role: 'user',
        groups: ['3', '5'],
        isActive: true,
        lastSeen: new Date(),
      },
      {
        id: 'user8',
        name: '吴十',
        role: 'user',
        groups: ['3', '5'],
        isActive: false,
        lastSeen: new Date(2023, 6, 1),
      },
      {
        id: 'user9',
        name: '郑十一',
        role: 'user',
        groups: ['4', '5'],
        isActive: true,
        lastSeen: new Date(),
      }
    ];
  }

  /**
   * 初始化模拟消息数据
   */
  private initMockMessages(): ChatMessage[] {
    // 生成今天的消息
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // 产品讨论群的今日消息
    const productGroupTodayMessages = [
      this.createMockMessage('1', 'user1', '张三', '大家好，关于新功能的开发进度，我想听听大家的意见。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30)),
      this.createMockMessage('1', 'user2', '李四', '我觉得我们应该优先完成用户反馈最多的那几个功能点，特别是搜索优化。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 32)),
      this.createMockMessage('1', 'user3', '王五', '同意李四的观点，另外我们还需要考虑性能问题，最近用户反馈说APP在某些情况下会卡顿。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 33)),
      this.createMockMessage('1', 'user4', '赵六', '我已经查看了性能日志，主要是在处理大量图片时内存占用过高导致的，我会在这周内优化。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 35)),
      this.createMockMessage('1', 'user1', '张三', '太好了，那我们下周一之前需要完成这两个优先级最高的任务，大家没问题吧？', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 37)),
      this.createMockMessage('1', 'user2', '李四', '没问题，我会负责搜索功能的优化。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 38)),
      this.createMockMessage('1', 'user3', '王五', '我来协助赵六处理性能问题，我们会在周五前提交初步方案。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 40)),
      this.createMockMessage('1', 'user1', '张三', '张总刚发消息说客户希望看到下周的演示版本，我们能赶上吗？', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 15)),
      this.createMockMessage('1', 'user4', '赵六', '应该没问题，我这边今晚加班处理性能问题。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 17)),
      this.createMockMessage('1', 'user2', '李四', '搜索功能明天就能完成初版，周末可以进行测试。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 20)),
      this.createMockMessage('1', 'user1', '张三', '太好了，谢谢大家的配合！[微笑]', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 22)),
      this.createMockMessage('1', 'user3', '王五', '我整理了一份性能优化的技术方案，大家看一下有什么建议', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30)),
      this.createMockMessage('1', 'user3', '王五', '文件：性能优化方案v1.0.pdf', 'file', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 31)),
      this.createMockMessage('1', 'user4', '赵六', '方案看起来不错，我建议把图片懒加载的优先级提高，这对当前问题的解决最直接。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 40)),
      this.createMockMessage('1', 'user2', '李四', '同意赵六的建议，另外可以考虑引入图片压缩库减少内存占用。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 45)),
    ];
    
    // 技术支持群的今日消息
    const techSupportTodayMessages = [
      this.createMockMessage('2', 'user4', '赵六', '今天有三个紧急bug需要处理，我已经在JIRA上创建了任务。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0)),
      this.createMockMessage('2', 'user1', '张三', '我来处理账号同步的问题，已经定位到原因了。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 5)),
      this.createMockMessage('2', 'user5', '钱七', '数据库查询优化的任务我负责，预计下午能完成。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 10)),
      this.createMockMessage('2', 'user4', '赵六', '太好了，那第三个关于缓存失效的问题我来处理。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 12)),
      this.createMockMessage('2', 'user1', '张三', '我这边修复好了，提交了PR，请大家review一下。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 45)),
      this.createMockMessage('2', 'user4', '赵六', '我已经review了，代码看起来没问题，可以合并。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 50)),
      this.createMockMessage('2', 'user5', '钱七', '数据库查询优化完成了，性能提升了约40%，详细数据我发在群里。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 20)),
      this.createMockMessage('2', 'user5', '钱七', '图片：性能测试结果.jpg', 'image', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 21)),
    ];
    
    // 市场营销群的今日消息
    const marketingTodayMessages = [
      this.createMockMessage('3', 'user2', '李四', '关于下个月的促销活动，我们需要确定主题和预算。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0)),
      this.createMockMessage('3', 'user6', '孙八', '我觉得可以考虑"夏日清凉"主题，针对天气热的特点做促销。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 5)),
      this.createMockMessage('3', 'user7', '周九', '好主意，我们可以推出一系列降温相关的产品。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 8)),
      this.createMockMessage('3', 'user8', '吴十', '预算方面，我们上个季度的营销费用节余了一部分，可以用在这次活动上。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 12)),
      this.createMockMessage('3', 'user2', '李四', '很好，那就定"夏日清凉"主题。关于时间，我建议7月15日开始，为期三周。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 15)),
      this.createMockMessage('3', 'user6', '孙八', '我已经联系了几家KOL，他们对合作很感兴趣，报价我待会发出来。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 20)),
      this.createMockMessage('3', 'user7', '周九', '线下活动场地已经考察了几个，价格和条件我整理了一份表格。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30)),
      this.createMockMessage('3', 'user7', '周九', '文件：场地对比表.xlsx', 'file', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 31)),
      this.createMockMessage('3', 'user2', '李四', '谢谢，我看了一下，建议选择市中心的那个场地，虽然价格稍高，但人流量大。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 40)),
      this.createMockMessage('3', 'user8', '吴十', '同意，而且那个场地的设施更完善，适合我们的互动环节。', 'text', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 45)),
    ];
    
    return [
      ...productGroupTodayMessages,
      ...techSupportTodayMessages,
      ...marketingTodayMessages,
      // 添加更多的模拟消息...
    ];
  }

  /**
   * 创建单条模拟消息
   */
  private createMockMessage(
    groupId: string,
    senderId: string,
    sender: string,
    content: string,
    type: 'text' | 'image' | 'voice' | 'video' | 'file' | 'location' | 'system' = 'text',
    timestamp: Date = new Date()
  ): ChatMessage {
    return {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      groupId,
      senderId,
      sender,
      content,
      timestamp,
      type,
      isRead: true,
      mentions: []
    };
  }
}

// 导出服务实例
const wechatService = new WeChatService();
export default wechatService;
