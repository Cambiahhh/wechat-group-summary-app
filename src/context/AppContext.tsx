import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ChatGroup, ChatSummary, User } from '../types';

// Define the state types
interface AppState {
  // User related state
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Application theme state
  theme: 'light' | 'dark' | 'system';
  
  // Chat related state
  selectedGroup: ChatGroup | null;
  recentSummaries: ChatSummary[];
  
  // Application status
  isLoading: boolean;
  error: string | null;
  notifications: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
    read: boolean;
  }[];
}

// Define the context actions/methods
interface AppContextProps extends AppState {
  // Authentication actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Chat actions
  selectGroup: (group: ChatGroup) => void;
  clearSelectedGroup: () => void;
  addSummary: (summary: ChatSummary) => void;
  removeSummary: (summaryId: string) => void;
  
  // Application status actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (type: 'info' | 'success' | 'warning' | 'error', message: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextProps>({} as AppContextProps);

// Define the provider props
interface AppProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize state
  const [state, setState] = useState<AppState>({
    currentUser: null,
    isAuthenticated: false,
    theme: 'light',
    selectedGroup: null,
    recentSummaries: [],
    isLoading: false,
    error: null,
    notifications: [],
  });
  
  // Authentication methods
  const login = async (username: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // In a real app, we would call an authentication API here
      // For now, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user1',
        name: username,
        role: 'user',
        groups: ['1', '2', '3'],
        isActive: true,
        lastSeen: new Date(),
        preferences: {
          theme: state.theme,
          notifications: true,
          autoSummary: true,
        }
      };
      
      setState(prev => ({
        ...prev,
        currentUser: mockUser,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred during login',
        isLoading: false,
      }));
    }
  };
  
  const logout = () => {
    setState(prev => ({
      ...prev,
      currentUser: null,
      isAuthenticated: false,
      selectedGroup: null,
    }));
  };
  
  // Theme methods
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setState(prev => ({ ...prev, theme }));
    
    // Apply theme to the document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Chat methods
  const selectGroup = (group: ChatGroup) => {
    setState(prev => ({ ...prev, selectedGroup: group }));
  };
  
  const clearSelectedGroup = () => {
    setState(prev => ({ ...prev, selectedGroup: null }));
  };
  
  const addSummary = (summary: ChatSummary) => {
    setState(prev => {
      // Check if the summary already exists, if so, replace it
      const existingIndex = prev.recentSummaries.findIndex(s => s.id === summary.id);
      let updatedSummaries;
      
      if (existingIndex >= 0) {
        updatedSummaries = [...prev.recentSummaries];
        updatedSummaries[existingIndex] = summary;
      } else {
        // Add to the beginning of the array
        updatedSummaries = [summary, ...prev.recentSummaries];
      }
      
      // Keep only the most recent summaries (e.g., last 10)
      if (updatedSummaries.length > 10) {
        updatedSummaries = updatedSummaries.slice(0, 10);
      }
      
      return { ...prev, recentSummaries: updatedSummaries };
    });
  };
  
  const removeSummary = (summaryId: string) => {
    setState(prev => ({
      ...prev,
      recentSummaries: prev.recentSummaries.filter(s => s.id !== summaryId),
    }));
  };
  
  // Application status methods
  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };
  
  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };
  
  const addNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const newNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date(),
      read: false,
    };
    
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications],
    }));
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
    }));
  };
  
  const clearNotifications = () => {
    setState(prev => ({ ...prev, notifications: [] }));
  };
  
  // Create the context value
  const contextValue: AppContextProps = {
    ...state,
    login,
    logout,
    setTheme,
    selectGroup,
    clearSelectedGroup,
    addSummary,
    removeSummary,
    setLoading,
    setError,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook for using the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
