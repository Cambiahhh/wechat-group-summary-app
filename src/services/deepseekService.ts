import { deepseekApi } from './api';
import { DeepseekRequest, DeepseekResponse } from '../types';

/**
 * Deepseek API服务 - 用于提供AI文本总结功能
 */
class DeepseekService {
  private apiKey: string;
  private defaultModel: string = 'deepseek-reasoner';
  
  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('警告: Deepseek API密钥未配置。请在.env文件中设置VITE_DEEPSEEK_API_KEY');
    }
  }

  /**
   * 验证API密钥是否已配置
   */
  private validateApiKey(): boolean {
    if (!this.apiKey) {
      throw new Error('Deepseek API密钥未配置。请在设置中添加有效的API密钥');
    }
    return true;
  }

  /**
   * 生成微信群聊内容摘要
   * @param messages 需要总结的消息内容
   * @param options 配置选项
   */
  async summarizeChat(
    messages: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      language?: 'zh' | 'en';
      detailLevel?: 'brief' | 'detailed' | 'comprehensive';
    } = {}
  ): Promise<string> {
    try {
      this.validateApiKey();

      const {
        model = this.defaultModel,
        maxTokens = 1024,
        temperature = 0.7,
        language = 'zh',
        detailLevel = 'comprehensive'
      } = options;

      // 构建提示词系统消息
      const systemPrompt = this.buildSystemPrompt(language, detailLevel);

      // 准备请求体
      const requestBody: DeepseekRequest = {
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: messages
          }
        ],
        temperature,
        max_tokens: maxTokens
      };

      // 发送API请求
      const response = await deepseekApi.post<DeepseekResponse>('/chat/completions', requestBody);

      if (response.success === false) {
        throw new Error(response.error?.message || '调用Deepseek API失败');
      }

      // 处理响应
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content;
      } else {
        throw new Error('无法从Deepseek API响应中提取内容');
      }
    } catch (error: any) {
      console.error('摘要生成失败:', error);
      throw new Error(`摘要生成失败: ${error.message || '未知错误'}`);
    }
  }

  /**
   * 构建系统提示词
   */
  private buildSystemPrompt(language: 'zh' | 'en', detailLevel: 'brief' | 'detailed' | 'comprehensive'): string {
    const languageText = language === 'zh' ? '中文' : 'English';
    
    let detailText = '';
    switch (detailLevel) {
      case 'brief':
        detailText = language === 'zh' 
          ? '请提供简短的总结，只包含主要话题和结论。' 
          : 'Please provide a brief summary with only main topics and conclusions.';
        break;
      case 'detailed':
        detailText = language === 'zh'
          ? '请提供详细总结，包括主要讨论点和重要细节。'
          : 'Please provide a detailed summary including main discussion points and important details.';
        break;
      case 'comprehensive':
        detailText = language === 'zh'
          ? '请提供全面详尽的总结，包括所有重要讨论点、决策、行动项和关键信息。'
          : 'Please provide a comprehensive summary including all important discussion points, decisions, action items, and key information.';
        break;
    }
    
    if (language === 'zh') {
      return `你是一位专业的微信群聊总结助手。你的任务是分析下面的微信群聊记录，并生成一份结构化的总结。
      
请使用${languageText}回复，并按以下格式组织内容：

## 主要讨论内容
[概述群聊中讨论的主要话题和重点]

## 重要决策和结论
[列出群聊中达成的任何决策、共识或结论]

## 待办事项和后续行动
[列出需要跟进的任何任务、行动项或约定]

## 值得注意的信息
[包含群聊中提到的任何重要日期、数字、链接或其他关键信息]

${detailText}

请确保总结客观、准确，不添加原始聊天中不存在的信息。`;
    } else {
      return `You are a professional WeChat group chat summarization assistant. Your task is to analyze the following WeChat group chat records and generate a structured summary.
      
Please respond in ${languageText} and organize the content in the following format:

## Main Discussion Topics
[Outline the main topics and key points discussed in the group chat]

## Important Decisions and Conclusions
[List any decisions, consensus, or conclusions reached in the group chat]

## Action Items and Follow-ups
[List any tasks, action items, or commitments that need follow-up]

## Notable Information
[Include any important dates, numbers, links, or other key information mentioned in the chat]

${detailText}

Please ensure the summary is objective, accurate, and does not add information that doesn't exist in the original chat.`;
    }
  }

  /**
   * 生成海报文案
   * @param summary 聊天总结内容
   * @param options 配置选项
   */
  async generatePosterContent(
    summary: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      style?: 'formal' | 'casual' | 'creative';
    } = {}
  ): Promise<string> {
    try {
      this.validateApiKey();

      const {
        model = this.defaultModel,
        maxTokens = 512,
        temperature = 0.8,
        style = 'formal'
      } = options;

      // 构建提示词
      let stylePrompt = '';
      switch (style) {
        case 'formal':
          stylePrompt = '请使用正式、专业的语言风格';
          break;
        case 'casual':
          stylePrompt = '请使用轻松、随意的语言风格';
          break;
        case 'creative':
          stylePrompt = '请使用创意十足、引人入胜的语言风格';
          break;
      }

      const systemPrompt = `你是一位专业的海报文案创作助手。你的任务是根据提供的群聊总结内容，创作一段简洁有力的海报文案。
      ${stylePrompt}。
      文案应当突出重点，吸引读者注意，篇幅控制在100-150字之间。
      不要使用"群聊总结"、"微信记录"等词语，让文案看起来像是一篇独立的内容。`;

      // 准备请求体
      const requestBody: DeepseekRequest = {
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `根据以下群聊总结创作海报文案：\n\n${summary}`
          }
        ],
        temperature,
        max_tokens: maxTokens
      };

      // 发送API请求
      const response = await deepseekApi.post<DeepseekResponse>('/chat/completions', requestBody);

      if (response.success === false) {
        throw new Error(response.error?.message || '调用Deepseek API失败');
      }

      // 处理响应
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content;
      } else {
        throw new Error('无法从Deepseek API响应中提取内容');
      }
    } catch (error: any) {
      console.error('海报文案生成失败:', error);
      throw new Error(`海报文案生成失败: ${error.message || '未知错误'}`);
    }
  }

  /**
   * 获取API剩余配额信息
   */
  async getApiQuota(): Promise<{ used: number; total: number; remaining: number }> {
    try {
      this.validateApiKey();
      
      // 这里假设Deepseek API提供了查询配额的端点
      // 在真实场景中需要根据实际API文档进行调整
      const response = await deepseekApi.get('/quota');
      
      if (response.success === false) {
        throw new Error(response.error?.message || '获取API配额信息失败');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('获取API配额信息失败:', error);
      // 如果API不支持查询配额，返回模拟数据
      return { used: 0, total: 1000, remaining: 1000 };
    }
  }
}

// 导出服务实例
const deepseekService = new DeepseekService();
export default deepseekService;
