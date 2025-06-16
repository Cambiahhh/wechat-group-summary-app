import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import summaryService from '../services/summaryService';
import wechatService from '../services/wechatService';
import { ChatSummary, ChatGroup } from '../types';
import { useAppContext } from '../context/AppContext';

interface UseChatSummaryOptions {
  groupId?: string;
  autoFetch?: boolean;
}

interface UseChatSummaryReturn {
  // Data
  summary: ChatSummary | null;
  summaries: ChatSummary[];
  group: ChatGroup | null;
  
  // Loading states
  isLoading: boolean;
  isFetchingSummaries: boolean;
  isGenerating: boolean;
  
  // Error states
  error: Error | null;
  
  // Actions
  generateSummary: (startDate: Date, endDate: Date, options?: {
    maxTokens?: number;
    temperature?: number;
    language?: 'zh' | 'en';
    detailLevel?: 'brief' | 'detailed' | 'comprehensive';
  }) => Promise<ChatSummary>;
  generateTodaySummary: (options?: {
    maxTokens?: number;
    temperature?: number;
    language?: 'zh' | 'en';
    detailLevel?: 'brief' | 'detailed' | 'comprehensive';
  }) => Promise<ChatSummary>;
  generateYesterdaySummary: (options?: {
    maxTokens?: number;
    temperature?: number;
    language?: 'zh' | 'en';
    detailLevel?: 'brief' | 'detailed' | 'comprehensive';
  }) => Promise<ChatSummary>;
  deleteSummary: (summaryId: string) => Promise<boolean>;
  generatePoster: (summaryId: string, options?: {
    style?: 'formal' | 'casual' | 'creative';
    maxLength?: number;
  }) => Promise<string>;
}

/**
 * 聊天总结Hook - 用于处理群聊总结数据和操作
 */
export function useChatSummary(options: UseChatSummaryOptions = {}): UseChatSummaryReturn {
  const { groupId, autoFetch = true } = options;
  const queryClient = useQueryClient();
  const { addNotification } = useAppContext();
  
  // States
  const [currentSummary, setCurrentSummary] = useState<ChatSummary | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Query for fetching group details
  const {
    data: group,
    error: groupError,
    isLoading: isLoadingGroup,
  } = useQuery(
    ['chatGroup', groupId],
    async () => {
      if (!groupId) return null;
      return wechatService.getGroupById(groupId);
    },
    {
      enabled: !!groupId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (err: Error) => {
        setError(err);
      },
    }
  );

  // Query for fetching summary history
  const {
    data: summaries = [],
    isLoading: isFetchingSummaries,
    error: summariesError,
    refetch: refetchSummaries,
  } = useQuery(
    ['chatSummaries', groupId],
    async () => {
      if (!groupId) return [];
      return summaryService.getSummaryHistory(groupId);
    },
    {
      enabled: !!groupId && autoFetch,
      staleTime: 60 * 1000, // 1 minute
      onError: (err: Error) => {
        setError(err);
      },
    }
  );

  // Mutation for generating summary
  const {
    mutateAsync: generateSummaryAsync,
    isLoading: isGenerating,
  } = useMutation(
    async ({ 
      groupId, 
      startDate, 
      endDate, 
      options = {} 
    }: { 
      groupId: string; 
      startDate: Date; 
      endDate: Date; 
      options?: any 
    }) => {
      return summaryService.generateSummary(groupId, startDate, endDate, options);
    },
    {
      onSuccess: (newSummary) => {
        setCurrentSummary(newSummary);
        // Invalidate and refetch summaries
        queryClient.invalidateQueries(['chatSummaries', groupId]);
        addNotification('success', '总结生成成功');
      },
      onError: (err: Error) => {
        setError(err);
        addNotification('error', `总结生成失败: ${err.message}`);
      },
    }
  );

  // Mutation for deleting summary
  const {
    mutateAsync: deleteSummaryAsync,
    isLoading: isDeleting,
  } = useMutation(
    async (summaryId: string) => {
      return summaryService.deleteSummary(summaryId);
    },
    {
      onSuccess: (success, summaryId) => {
        if (success) {
          // If we deleted the current summary, clear it
          if (currentSummary && currentSummary.id === summaryId) {
            setCurrentSummary(null);
          }
          // Invalidate and refetch summaries
          queryClient.invalidateQueries(['chatSummaries', groupId]);
          addNotification('success', '总结已删除');
        }
      },
      onError: (err: Error) => {
        setError(err);
        addNotification('error', `删除总结失败: ${err.message}`);
      },
    }
  );

  // Mutation for generating poster content
  const {
    mutateAsync: generatePosterAsync,
  } = useMutation(
    async ({ 
      summaryId, 
      options = {} 
    }: { 
      summaryId: string; 
      options?: any 
    }) => {
      return summaryService.generatePosterContent(summaryId, options);
    },
    {
      onSuccess: () => {
        addNotification('success', '海报文案生成成功');
      },
      onError: (err: Error) => {
        setError(err);
        addNotification('error', `海报文案生成失败: ${err.message}`);
      },
    }
  );

  // Handle errors from queries
  useEffect(() => {
    if (groupError) setError(groupError as Error);
    if (summariesError) setError(summariesError as Error);
  }, [groupError, summariesError]);

  // Clear errors when groupId changes
  useEffect(() => {
    setError(null);
  }, [groupId]);

  // When summaries change, update current summary if it exists in the list
  useEffect(() => {
    if (currentSummary && summaries.length > 0) {
      const updatedSummary = summaries.find(s => s.id === currentSummary.id);
      if (updatedSummary) {
        setCurrentSummary(updatedSummary);
      }
    } else if (summaries.length > 0 && !currentSummary) {
      // Set the most recent summary as current if there is no current summary
      setCurrentSummary(summaries[0]);
    }
  }, [summaries, currentSummary]);

  // Wrapper functions for the API calls
  const generateSummary = useCallback(
    async (startDate: Date, endDate: Date, options = {}) => {
      if (!groupId) {
        throw new Error('No group selected');
      }
      
      try {
        const result = await generateSummaryAsync({ groupId, startDate, endDate, options });
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to generate summary'));
        throw err;
      }
    },
    [groupId, generateSummaryAsync]
  );

  const generateTodaySummary = useCallback(
    async (options = {}) => {
      if (!groupId) {
        throw new Error('No group selected');
      }
      
      try {
        const result = await summaryService.generateTodaySummary(groupId, options);
        setCurrentSummary(result);
        // Invalidate and refetch summaries
        queryClient.invalidateQueries(['chatSummaries', groupId]);
        addNotification('success', '今日总结生成成功');
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to generate today summary'));
        addNotification('error', `今日总结生成失败: ${err instanceof Error ? err.message : 'Unknown error'}`);
        throw err;
      }
    },
    [groupId, queryClient, addNotification]
  );

  const generateYesterdaySummary = useCallback(
    async (options = {}) => {
      if (!groupId) {
        throw new Error('No group selected');
      }
      
      try {
        const result = await summaryService.generateYesterdaySummary(groupId, options);
        setCurrentSummary(result);
        // Invalidate and refetch summaries
        queryClient.invalidateQueries(['chatSummaries', groupId]);
        addNotification('success', '昨日总结生成成功');
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to generate yesterday summary'));
        addNotification('error', `昨日总结生成失败: ${err instanceof Error ? err.message : 'Unknown error'}`);
        throw err;
      }
    },
    [groupId, queryClient, addNotification]
  );

  const deleteSummary = useCallback(
    async (summaryId: string) => {
      try {
        return await deleteSummaryAsync(summaryId);
      } catch (err) {
        throw err;
      }
    },
    [deleteSummaryAsync]
  );

  const generatePoster = useCallback(
    async (summaryId: string, options = {}) => {
      try {
        return await generatePosterAsync({ summaryId, options });
      } catch (err) {
        throw err;
      }
    },
    [generatePosterAsync]
  );

  // Combine loading states
  const isLoading = isLoadingGroup || isFetchingSummaries;

  return {
    summary: currentSummary,
    summaries,
    group,
    isLoading,
    isFetchingSummaries,
    isGenerating,
    error,
    generateSummary,
    generateTodaySummary,
    generateYesterdaySummary,
    deleteSummary,
    generatePoster,
  };
}

export default useChatSummary;
