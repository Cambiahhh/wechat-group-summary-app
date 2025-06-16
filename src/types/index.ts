// WeChat Message Types
export interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'video' | 'file' | 'location' | 'system';
  avatar?: string;
  replyTo?: string;
  mentions?: string[];
  isRead?: boolean;
  groupId: string;
}

// Chat Summary Types
export interface ChatSummary {
  id: string;
  title: string;
  content: string;
  groupId: string;
  groupName: string;
  generatedAt: Date;
  timeRange: {
    start: Date;
    end: Date;
  };
  messageCount: number;
  wordCount: number;
  keyPoints: string[];
  topics: string[];
  participants: {
    userId: string;
    name: string;
    messageCount: number;
  }[];
  status: 'generating' | 'completed' | 'failed';
}

// User Types
export interface User {
  id: string;
  name: string;
  avatar?: string;
  phoneNumber?: string;
  email?: string;
  role: 'admin' | 'user';
  groups: string[]; // Group IDs the user belongs to
  isActive: boolean;
  lastSeen?: Date;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoSummary: boolean;
    summaryFrequency?: 'daily' | 'weekly' | 'monthly';
  };
}

// Chat Group Types
export interface ChatGroup {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  members: {
    userId: string;
    name: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
  }[];
  createdAt: Date;
  lastActiveAt: Date;
  messageCount: number;
  isArchived: boolean;
  settings?: {
    autoSummary: boolean;
    summaryFrequency: 'daily' | 'weekly' | 'monthly';
    posterGeneration: boolean;
    posterTemplate?: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
    timestamp: Date;
  };
}

// Deepseek API Types
export interface DeepseekRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface DeepseekResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Poster Generation Types
export interface PosterTemplate {
  id: string;
  name: string;
  thumbnail: string;
  aspectRatio: string;
  elements: PosterElement[];
}

export type PosterElementType = 'text' | 'image' | 'shape' | 'background';

export interface PosterElement {
  id: string;
  type: PosterElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  content?: string;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
    [key: string]: any;
  };
}

export interface GeneratedPoster {
  id: string;
  summaryId: string;
  groupId: string;
  createdAt: Date;
  imageUrl: string;
  templateId: string;
  status: 'generating' | 'completed' | 'failed';
}

// Schedule Types
export interface ScheduledTask {
  id: string;
  type: 'summary' | 'poster';
  groupId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customCron?: string;
  nextRunTime: Date;
  lastRunTime?: Date;
  lastRunStatus?: 'success' | 'failure';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  options?: Record<string, any>;
}
