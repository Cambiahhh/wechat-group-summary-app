import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

interface SchedulerTask {
  id: string;
  type: 'summary' | 'poster';
  groupId: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  customCron?: string;
  nextRunTime: Date;
  lastRunTime?: Date;
  lastRunStatus?: 'success' | 'failure';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  options?: Record<string, any>;
}

interface SchedulerOptions {
  onTaskRun?: (task: SchedulerTask) => Promise<void>;
  autoStart?: boolean;
  checkInterval?: number; // in milliseconds
}

/**
 * 调度器Hook - 用于管理定时任务
 */
export function useScheduler(options: SchedulerOptions = {}) {
  const { onTaskRun, autoStart = true, checkInterval = 60000 } = options;
  
  const [tasks, setTasks] = useState<SchedulerTask[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<SchedulerTask | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { addNotification } = useAppContext();
  const timerRef = useRef<number | null>(null);
  
  // 从localStorage加载任务配置
  const loadTasks = useCallback(() => {
    try {
      const savedTasks = localStorage.getItem('scheduler_tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // 转换字符串日期为Date对象
        const processedTasks = parsedTasks.map((task: any) => ({
          ...task,
          nextRunTime: new Date(task.nextRunTime),
          lastRunTime: task.lastRunTime ? new Date(task.lastRunTime) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        setTasks(processedTasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tasks'));
      addNotification('error', '加载任务配置失败');
    }
  }, [addNotification]);
  
  // 保存任务配置到localStorage
  const saveTasks = useCallback((updatedTasks: SchedulerTask[]) => {
    try {
      localStorage.setItem('scheduler_tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save tasks'));
      addNotification('error', '保存任务配置失败');
    }
  }, [addNotification]);
  
  // 添加新任务
  const addTask = useCallback((task: Omit<SchedulerTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: SchedulerTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      saveTasks(updatedTasks);
      return updatedTasks;
    });
    
    addNotification('success', '新任务已添加');
    return newTask;
  }, [addNotification, saveTasks]);
  
  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<SchedulerTask>) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        addNotification('error', '更新任务失败：找不到指定任务');
        return prevTasks;
      }
      
      const updatedTask = {
        ...prevTasks[taskIndex],
        ...updates,
        updatedAt: new Date()
      };
      
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex] = updatedTask;
      saveTasks(updatedTasks);
      
      return updatedTasks;
    });
  }, [addNotification, saveTasks]);
  
  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(t => t.id !== taskId);
      saveTasks(updatedTasks);
      return updatedTasks;
    });
    addNotification('success', '任务已删除');
  }, [addNotification, saveTasks]);
  
  // 启用/禁用任务
  const toggleTaskActive = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;
      
      const updatedTask = {
        ...prevTasks[taskIndex],
        isActive: !prevTasks[taskIndex].isActive,
        updatedAt: new Date()
      };
      
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex] = updatedTask;
      saveTasks(updatedTasks);
      
      addNotification(
        'info', 
        `任务已${updatedTask.isActive ? '启用' : '禁用'}`
      );
      
      return updatedTasks;
    });
  }, [addNotification, saveTasks]);
  
  // 计算任务下一次执行时间
  const calculateNextRunTime = useCallback((task: SchedulerTask): Date => {
    const now = new Date();
    let nextRun = new Date();
    
    switch (task.frequency) {
      case 'hourly':
        nextRun.setHours(nextRun.getHours() + 1);
        nextRun.setMinutes(0);
        nextRun.setSeconds(0);
        nextRun.setMilliseconds(0);
        break;
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(9); // 每天早上9点执行
        nextRun.setMinutes(0);
        nextRun.setSeconds(0);
        nextRun.setMilliseconds(0);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay() || 7)); // 下周一
        nextRun.setHours(9);
        nextRun.setMinutes(0);
        nextRun.setSeconds(0);
        nextRun.setMilliseconds(0);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        nextRun.setDate(1); // 下月1号
        nextRun.setHours(9);
        nextRun.setMinutes(0);
        nextRun.setSeconds(0);
        nextRun.setMilliseconds(0);
        break;
      case 'custom':
        // 自定义cron逻辑，这里简化处理，实际应该使用cron解析库
        if (task.customCron) {
          // 简单示例：格式为 "小时:分钟"，比如 "9:30" 表示每天早上9点30分执行
          try {
            const [hour, minute] = task.customCron.split(':').map(Number);
            nextRun.setDate(nextRun.getDate() + 1);
            nextRun.setHours(hour);
            nextRun.setMinutes(minute);
            nextRun.setSeconds(0);
            nextRun.setMilliseconds(0);
          } catch (err) {
            console.error('Invalid custom cron format:', task.customCron);
            nextRun.setDate(nextRun.getDate() + 1);
          }
        }
        break;
      default:
        nextRun.setDate(nextRun.getDate() + 1);
        break;
    }
    
    // 确保下次运行时间在当前时间之后
    if (nextRun <= now) {
      return calculateNextRunTime({...task, lastRunTime: now});
    }
    
    return nextRun;
  }, []);
  
  // 手动触发任务执行
  const runTask = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('任务不存在');
      }
      
      setCurrentTask(task);
      
      // 如果提供了onTaskRun回调，则执行
      if (onTaskRun) {
        await onTaskRun(task);
      }
      
      // 更新任务状态
      updateTask(taskId, {
        lastRunTime: new Date(),
        lastRunStatus: 'success',
        nextRunTime: calculateNextRunTime(task)
      });
      
      addNotification('success', `任务 "${task.type === 'summary' ? '总结生成' : '海报生成'}" 执行成功`);
    } catch (err) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        updateTask(taskId, {
          lastRunTime: new Date(),
          lastRunStatus: 'failure'
        });
      }
      
      setError(err instanceof Error ? err : new Error('Task execution failed'));
      addNotification('error', `任务执行失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setCurrentTask(null);
    }
  }, [tasks, onTaskRun, updateTask, calculateNextRunTime, addNotification]);
  
  // 检查并执行到期任务
  const checkTasks = useCallback(() => {
    const now = new Date();
    
    tasks.forEach(task => {
      if (task.isActive && task.nextRunTime <= now) {
        runTask(task.id).catch(console.error);
      }
    });
  }, [tasks, runTask]);
  
  // 启动调度器
  const startScheduler = useCallback(() => {
    if (isRunning) return;
    
    checkTasks(); // 立即检查一次
    
    // 设置定时器
    const timerId = window.setInterval(checkTasks, checkInterval);
    timerRef.current = timerId;
    setIsRunning(true);
    
    addNotification('info', '任务调度器已启动');
  }, [isRunning, checkTasks, checkInterval, addNotification]);
  
  // 停止调度器
  const stopScheduler = useCallback(() => {
    if (!isRunning || timerRef.current === null) return;
    
    window.clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    
    addNotification('info', '任务调度器已停止');
  }, [isRunning, addNotification]);
  
  // 在组件挂载时初始化
  useEffect(() => {
    loadTasks();
    
    // 如果autoStart为true，则自动启动调度器
    if (autoStart) {
      startScheduler();
    }
    
    // 在组件卸载时清理
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [loadTasks, autoStart, startScheduler]);
  
  return {
    tasks,
    currentTask,
    isRunning,
    error,
    
    // 任务管理方法
    addTask,
    updateTask,
    deleteTask,
    toggleTaskActive,
    
    // 调度器控制方法
    startScheduler,
    stopScheduler,
    
    // 手动触发方法
    runTask,
    
    // 工具方法
    calculateNextRunTime,
  };
}

export default useScheduler;
</file_content__>
