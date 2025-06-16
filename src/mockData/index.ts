import { ChatMessage, ChatGroup, User, ChatSummary } from '../types';
import { subDays, subHours, addDays } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: '张三',
    avatar: '/avatars/user1.png',
    email: 'zhangsan@example.com',
    phoneNumber: '13800000001',
    role: 'admin',
    groups: ['group1', 'group2', 'group5'],
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
    avatar: '/avatars/user2.png',
    email: 'lisi@example.com',
    phoneNumber: '13800000002',
    role: 'admin',
    groups: ['group1', 'group3', 'group5'],
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
    avatar: '/avatars/user3.png',
    email: 'wangwu@example.com',
    phoneNumber: '13800000003',
    role: 'user',
    groups: ['group1', 'group4', 'group5'],
    isActive: true,
    lastSeen: new Date(),
    preferences: {
      theme: 'system',
      notifications: true,
      autoSummary: false,
    }
  },
  {
    id: 'user4',
    name: '赵六',
    avatar: '/avatars/user4.png',
    email: 'zhaoliu@example.com',
    phoneNumber: '13800000004',
    role: 'user',
    groups: ['group1', 'group2', 'group5'],
    isActive: true,
    lastSeen: new Date(),
    preferences: {
      theme: 'light',
      notifications: false,
      autoSummary: true,
      summaryFrequency: 'weekly',
    }
  },
  {
    id: 'user5',
    name: '钱七',
    avatar: '/avatars/user5.png',
    email: 'qianqi@example.com',
    phoneNumber: '13800000005',
    role: 'user',
    groups: ['group2', 'group4', 'group5'],
    isActive: false,
    lastSeen: subDays(new Date(), 5),
  }
];

// Mock Chat Groups
export const mockGroups: ChatGroup[] = [
  {
    id: 'group1',
    name: '产品讨论群',
    avatar: '/avatars/group1.png',
    description: '用于讨论产品功能和规划',
    members: [
      { userId: 'user1', name: '张三', role: 'owner', joinedAt: subDays(new Date(), 30) },
      { userId: 'user2', name: '李四', role: 'admin', joinedAt: subDays(new Date(), 30) },
      { userId: 'user3', name: '王五', role: 'member', joinedAt: subDays(new Date(), 29) },
      { userId: 'user4', name: '赵六', role: 'member', joinedAt: subDays(new Date(), 28) },
    ],
    createdAt: subDays(new Date(), 30),
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
    id: 'group2',
    name: '技术支持群',
    avatar: '/avatars/group2.png',
    description: '解决用户技术问题',
    members: [
      { userId: 'user1', name: '张三', role: 'admin', joinedAt: subDays(new Date(), 20) },
      { userId: 'user4', name: '赵六', role: 'owner', joinedAt: subDays(new Date(), 20) },
      { userId: 'user5', name: '钱七', role: 'member', joinedAt: subDays(new Date(), 19) },
    ],
    createdAt: subDays(new Date(), 20),
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
    id: 'group3',
    name: '市场营销群',
    avatar: '/avatars/group3.png',
    description: '讨论市场策略和活动',
    members: [
      { userId: 'user2', name: '李四', role: 'owner', joinedAt: subDays(new Date(), 15) },
      { userId: 'user6', name: '孙八', role: 'admin', joinedAt: subDays(new Date(), 15) },
      { userId: 'user7', name: '周九', role: 'member', joinedAt: subDays(new Date(), 14) },
      { userId: 'user8', name: '吴十', role: 'member', joinedAt: subDays(new Date(), 13) },
    ],
    createdAt: subDays(new Date(), 15),
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
    id: 'group4',
    name: '客户服务群',
    avatar: '/avatars/group4.png',
    description: '处理客户反馈和投诉',
    members: [
      { userId: 'user3', name: '王五', role: 'admin', joinedAt: subDays(new Date(), 10) },
      { userId: 'user5', name: '钱七', role: 'owner', joinedAt: subDays(new Date(), 10) },
      { userId: 'user9', name: '郑十一', role: 'member', joinedAt: subDays(new Date(), 9) },
    ],
    createdAt: subDays(new Date(), 10),
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
    id: 'group5',
    name: '公司公告群',
    avatar: '/avatars/group5.png',
    description: '公司重要通知发布',
    members: [
      { userId: 'user1', name: '张三', role: 'owner', joinedAt: subDays(new Date(), 60) },
      { userId: 'user2', name: '李四', role: 'admin', joinedAt: subDays(new Date(), 60) },
      { userId: 'user3', name: '王五', role: 'member', joinedAt: subDays(new Date(), 60) },
      { userId: 'user4', name: '赵六', role: 'member', joinedAt: subDays(new Date(), 60) },
      { userId: 'user5', name: '钱七', role: 'member', joinedAt: subDays(new Date(), 60) },
    ],
    createdAt: subDays(new Date(), 60),
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

// Mock Chat Messages - Today's conversation in Product Discussion Group
export const mockMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    sender: '张三',
    content: '大家好，关于新功能的开发进度，我想听听大家的意见。',
    timestamp: subHours(new Date(), 5),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg2',
    senderId: 'user2',
    sender: '李四',
    content: '我觉得我们应该优先完成用户反馈最多的那几个功能点，特别是搜索优化。',
    timestamp: subHours(new Date(), 4.9),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg3',
    senderId: 'user3',
    sender: '王五',
    content: '同意李四的观点，另外我们还需要考虑性能问题，最近用户反馈说APP在某些情况下会卡顿。',
    timestamp: subHours(new Date(), 4.8),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg4',
    senderId: 'user4',
    sender: '赵六',
    content: '我已经查看了性能日志，主要是在处理大量图片时内存占用过高导致的，我会在这周内优化。',
    timestamp: subHours(new Date(), 4.7),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg5',
    senderId: 'user1',
    sender: '张三',
    content: '太好了，那我们下周一之前需要完成这两个优先级最高的任务，大家没问题吧？',
    timestamp: subHours(new Date(), 4.6),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg6',
    senderId: 'user2',
    sender: '李四',
    content: '没问题，我会负责搜索功能的优化。',
    timestamp: subHours(new Date(), 4.5),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg7',
    senderId: 'user3',
    sender: '王五',
    content: '我来协助赵六处理性能问题，我们会在周五前提交初步方案。',
    timestamp: subHours(new Date(), 4.4),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg8',
    senderId: 'user1',
    sender: '张三',
    content: '张总刚发消息说客户希望看到下周的演示版本，我们能赶上吗？',
    timestamp: subHours(new Date(), 2),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg9',
    senderId: 'user4',
    sender: '赵六',
    content: '应该没问题，我这边今晚加班处理性能问题。',
    timestamp: subHours(new Date(), 1.9),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg10',
    senderId: 'user2',
    sender: '李四',
    content: '搜索功能明天就能完成初版，周末可以进行测试。',
    timestamp: subHours(new Date(), 1.8),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg11',
    senderId: 'user1',
    sender: '张三',
    content: '太好了，谢谢大家的配合！[微笑]',
    timestamp: subHours(new Date(), 1.7),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg12',
    senderId: 'user3',
    sender: '王五',
    content: '我整理了一份性能优化的技术方案，大家看一下有什么建议',
    timestamp: subHours(new Date(), 1),
    type: 'text',
    groupId: 'group1',
  },
  {
    id: 'msg13',
    senderId: 'user3',
    sender: '王五',
    content: '性能优化方案v1.0.pdf',
    timestamp: subHours(new Date(), 0.9),
    type: 'file',
    groupId: 'group1',
  },
];

// Mock Technical Support Group Messages
export const mockTechSupportMessages: ChatMessage[] = [
  {
    id: 'techmsg1',
    senderId: 'user4',
    sender: '赵六',
    content: '今天有三个紧急bug需要处理，我已经在JIRA上创建了任务。',
    timestamp: subHours(new Date(), 6),
    type: 'text',
    groupId: 'group2',
  },
  {
    id: 'techmsg2',
    senderId: 'user1',
    sender: '张三',
    content: '我来处理账号同步的问题，已经定位到原因了。',
    timestamp: subHours(new Date(), 5.9),
    type: 'text',
    groupId: 'group2',
  },
  {
    id: 'techmsg3',
    senderId: 'user5',
    sender: '钱七',
    content: '数据库查询优化的任务我负责，预计下午能完成。',
    timestamp: subHours(new Date(), 5.8),
    type: 'text',
    groupId: 'group2',
  },
  {
    id: 'techmsg4',
    senderId: 'user5',
    sender: '钱七',
    content: '性能测试结果.jpg',
    timestamp: subHours(new Date(), 1),
    type: 'image',
    groupId: 'group2',
  },
];

// Mock Marketing Group Messages
export const mockMarketingMessages: ChatMessage[] = [
  {
    id: 'mktmsg1',
    senderId: 'user2',
    sender: '李四',
    content: '关于下个月的促销活动，我们需要确定主题和预算。',
    timestamp: subHours(new Date(), 7),
    type: 'text',
    groupId: 'group3',
  },
  {
    id: 'mktmsg2',
    senderId: 'user6',
    sender: '孙八',
    content: '我觉得可以考虑"夏日清凉"主题，针对天气热的特点做促销。',
    timestamp: subHours(new Date(), 6.9),
    type: 'text',
    groupId: 'group3',
  },
  {
    id: 'mktmsg3',
    senderId: 'user7',
    sender: '周九',
    content: '场地对比表.xlsx',
    timestamp: subHours(new Date(), 4),
    type: 'file',
    groupId: 'group3',
  },
];

// Mock Summaries
export const mockSummaries: ChatSummary[] = [
  {
    id: 'summary1',
    title: '产品讨论群聊天总结 (2023年7月15日)',
    content: `
## 主要讨论内容
团队讨论了当前产品开发的优先级问题，重点关注以下两个方面：

1. **搜索功能优化**：根据用户反馈，这是用户最关注的功能点之一，由李四负责实施。

2. **性能问题解决**：特别是在处理大量图片时出现的卡顿问题，原因是内存占用过高，由赵六主导、王五协助解决。

## 行动计划
- 搜索功能优化将由李四负责，计划在下周一前完成
- 性能问题将由赵六和王五共同解决，周五前提交初步优化方案
- 团队将为下周的客户演示准备版本

## 结论
团队一致同意将上述两项作为本周的优先任务，争取在下周一之前交付结果，以满足客户演示的需求。
    `,
    groupId: 'group1',
    groupName: '产品讨论群',
    generatedAt: subHours(new Date(), 1),
    timeRange: {
      start: subDays(new Date(), 1),
      end: new Date(),
    },
    messageCount: 13,
    wordCount: 254,
    keyPoints: [
      '搜索功能优化由李四负责',
      '性能问题由赵六和王五协助解决',
      '下周一之前完成优先任务',
      '准备下周客户演示版本'
    ],
    topics: ['搜索优化', '性能问题', '内存占用', '客户演示', '任务优先级'],
    participants: [
      { userId: 'user1', name: '张三', messageCount: 3 },
      { userId: 'user2', name: '李四', messageCount: 2 },
      { userId: 'user3', name: '王五', messageCount: 3 },
      { userId: 'user4', name: '赵六', messageCount: 2 }
    ],
    status: 'completed'
  },
  {
    id: 'summary2',
    title: '技术支持群聊天总结 (2023年7月14日)',
    content: `
## 主要讨论内容
今天技术支持团队讨论了三个需要紧急处理的bug问题：

1. **账号同步问题**：由张三负责处理，已经成功定位到原因。
2. **数据库查询优化**：由钱七负责，预计当天下午完成。
3. **缓存失效问题**：由赵六处理。

## 行动计划
- 张三已提交PR修复账号同步问题，等待review
- 钱七完成了数据库查询优化，性能提升约40%
- 所有bug修复应在本周内完成

## 结论
团队合理分配任务，高效解决了当日的紧急问题，保证了系统的稳定运行。
    `,
    groupId: 'group2',
    groupName: '技术支持群',
    generatedAt: subDays(new Date(), 1),
    timeRange: {
      start: subDays(new Date(), 2),
      end: subDays(new Date(), 1),
    },
    messageCount: 8,
    wordCount: 185,
    keyPoints: [
      '三个紧急bug需要处理',
      '账号同步问题已修复',
      '数据库查询优化完成',
      '性能提升约40%'
    ],
    topics: ['bug修复', '账号同步', '数据库优化', '性能提升', 'PR审核'],
    participants: [
      { userId: 'user4', name: '赵六', messageCount: 3 },
      { userId: 'user1', name: '张三', messageCount: 2 },
      { userId: 'user5', name: '钱七', messageCount: 3 }
    ],
    status: 'completed'
  },
  {
    id: 'summary3',
    title: '市场营销群聊天总结 (2023年7月13日)',
    content: `
## 主要讨论内容
市场团队讨论了即将到来的夏季促销活动，确定了以下要点：

1. **活动主题**：确定"夏日清凉"作为主题。
2. **活动时间**：7月15日至8月5日。
3. **场地选择**：倾向于选择市中心的场地，虽然价格较高，但人流量大。

## 行动计划
- 联系KOL进行合作推广
- 确认活动场地并签订合同
- 准备促销材料和宣传内容

## 结论
团队确定了夏季促销活动的主要方向和计划，接下来将展开详细的执行准备工作。
    `,
    groupId: 'group3',
    groupName: '市场营销群',
    generatedAt: subDays(new Date(), 2),
    timeRange: {
      start: subDays(new Date(), 3),
      end: subDays(new Date(), 2),
    },
    messageCount: 10,
    wordCount: 162,
    keyPoints: [
      '"夏日清凉"主题',
      '7月15日至8月5日活动时间',
      '选择市中心场地',
      'KOL合作推广'
    ],
    topics: ['促销活动', '夏季主题', '场地选择', 'KOL合作', '营销策略'],
    participants: [
      { userId: 'user2', name: '李四', messageCount: 3 },
      { userId: 'user6', name: '孙八', messageCount: 2 },
      { userId: 'user7', name: '周九', messageCount: 3 },
      { userId: 'user8', name: '吴十', messageCount: 2 }
    ],
    status: 'completed'
  }
];

// Mock Poster items for gallery
export const mockPosters = [
  {
    id: 'poster1',
    imageUrl: '/posters/poster1.jpg',
    title: '产品开发优先级与行动计划',
    createdAt: subHours(new Date(), 3),
    groupId: 'group1',
    groupName: '产品讨论群',
    summaryId: 'summary1',
    status: 'completed',
    templateId: 'template1',
  },
  {
    id: 'poster2',
    imageUrl: '/posters/poster2.jpg',
    title: '技术支持团队Bug修复进度',
    createdAt: subDays(new Date(), 1),
    groupId: 'group2',
    groupName: '技术支持群',
    summaryId: 'summary2',
    status: 'completed',
    templateId: 'template3',
  },
  {
    id: 'poster3',
    imageUrl: '/posters/poster3.jpg',
    title: '"夏日清凉"促销活动规划',
    createdAt: subDays(new Date(), 2),
    groupId: 'group3',
    groupName: '市场营销群',
    summaryId: 'summary3',
    status: 'completed',
    templateId: 'template5',
  }
];

// Mock Scheduled Tasks
export const mockScheduledTasks = [
  {
    id: 'task1',
    type: 'summary',
    groupId: 'group1',
    frequency: 'daily',
    nextRunTime: addDays(new Date(), 1),
    lastRunTime: new Date(),
    lastRunStatus: 'success',
    isActive: true,
    createdAt: subDays(new Date(), 10),
    updatedAt: new Date(),
  },
  {
    id: 'task2',
    type: 'poster',
    groupId: 'group1',
    frequency: 'weekly',
    nextRunTime: addDays(new Date(), 5),
    lastRunTime: subDays(new Date(), 2),
    lastRunStatus: 'success',
    isActive: true,
    createdAt: subDays(new Date(), 15),
    updatedAt: new Date(),
    options: {
      templateId: 'template1'
    }
  },
  {
    id: 'task3',
    type: 'summary',
    groupId: 'group3',
    frequency: 'daily',
    nextRunTime: addDays(new Date(), 1),
    lastRunTime: new Date(),
    lastRunStatus: 'success',
    isActive: true,
    createdAt: subDays(new Date(), 5),
    updatedAt: new Date(),
  }
];

export default {
  users: mockUsers,
  groups: mockGroups,
  messages: mockMessages,
  techSupportMessages: mockTechSupportMessages,
  marketingMessages: mockMarketingMessages,
  summaries: mockSummaries,
  posters: mockPosters,
  scheduledTasks: mockScheduledTasks
};
