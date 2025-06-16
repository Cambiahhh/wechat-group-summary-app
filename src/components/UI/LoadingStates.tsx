import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for props
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: 'thin' | 'normal' | 'thick';
  className?: string;
}

interface LoadingBarProps {
  progress?: number;
  color?: string;
  height?: number;
  className?: string;
  showPercentage?: boolean;
  isIndeterminate?: boolean;
}

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

interface ContentLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  transitionDuration?: number;
  className?: string;
}

interface SpinnerOverlayProps {
  isLoading: boolean;
  message?: string;
  overlayColor?: string;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Loading Spinner Component - provides different spinner styles
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'currentColor', 
  thickness = 'normal',
  className = ''
}) => {
  // Size mappings
  const sizeMap = {
    'xs': 'h-3 w-3',
    'sm': 'h-5 w-5',
    'md': 'h-8 w-8',
    'lg': 'h-12 w-12',
    'xl': 'h-16 w-16'
  };

  // Thickness mappings
  const thicknessMap = {
    'thin': 'border',
    'normal': 'border-2',
    'thick': 'border-4'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeMap[size]} ${thicknessMap[thickness]} rounded-full border-t-transparent border-b-transparent animate-spin`}
        style={{ borderLeftColor: color, borderRightColor: color }}
        role="status"
        aria-label="loading"
      ></div>
    </div>
  );
};

// Circular Progress Component - shows progress in a circle
export const CircularProgress: React.FC<LoadingBarProps> = ({
  progress = 0,
  color = '#0ea5e9',
  className = '',
  showPercentage = false,
}) => {
  // Calculate the stroke-dasharray and stroke-dashoffset for SVG circle
  const size = 50;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showPercentage && (
        <span className="absolute text-sm font-semibold">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

// Linear Progress Bar Component
export const LinearProgress: React.FC<LoadingBarProps> = ({
  progress = 0,
  color = '#0ea5e9',
  height = 4,
  className = '',
  showPercentage = false,
  isIndeterminate = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700" style={{ height }}>
        <div
          className={`rounded-full ${isIndeterminate ? 'animate-indeterminate-progress' : 'transition-all duration-300 ease-out'}`}
          style={{
            width: isIndeterminate ? '100%' : `${progress}%`,
            height,
            backgroundColor: color,
          }}
        ></div>
      </div>
      {showPercentage && (
        <div className="text-xs text-right mt-1">
          {isIndeterminate ? 'Loading...' : `${Math.round(progress)}%`}
        </div>
      )}
    </div>
  );
};

// Dots Loading Component
export const LoadingDots: React.FC<{ color?: string; className?: string }> = ({
  color = 'currentColor',
  className = '',
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <motion.div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
      />
      <motion.div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
      />
      <motion.div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
      />
    </div>
  );
};

// Skeleton Loading Component - for content placeholders
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  animation = 'pulse',
}) => {
  // Calculate default height based on variant
  const defaultHeight = variant === 'text' ? '1.2em' 
                      : variant === 'circular' ? '2.5rem'
                      : '4rem';

  // Apply correct border radius based on variant
  const borderRadius = variant === 'circular' ? '50%' 
                     : variant === 'rounded' ? '0.5rem'
                     : variant === 'text' ? '0.25rem'
                     : '0';

  // Animation class
  const animationClass = animation === 'pulse' ? 'animate-pulse' 
                       : animation === 'wave' ? 'animate-skeleton-wave'
                       : '';

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${animationClass} ${className}`}
      style={{
        width,
        height: height || defaultHeight,
        borderRadius,
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
};

// Content Loader Component - transitions between loading and content
export const ContentLoader: React.FC<ContentLoaderProps> = ({
  isLoading,
  children,
  loadingFallback,
  transitionDuration = 0.3,
  className = ''
}) => {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
          >
            {loadingFallback || (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="md" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: transitionDuration }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Full Screen Loading Spinner Overlay
export const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({
  isLoading,
  message = '加载中...',
  overlayColor = 'rgba(255, 255, 255, 0.8)',
  spinnerSize = 'lg'
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-50"
          style={{ backgroundColor: overlayColor }}
        >
          <LoadingSpinner size={spinnerSize} color="#0ea5e9" />
          {message && <p className="mt-4 text-gray-700 font-medium">{message}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Article Skeleton - pre-made skeleton for article/content layout
export const ArticleSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <Skeleton variant="text" height="2rem" width="60%" className="mb-2" />
      <Skeleton variant="text" height="1rem" />
      <Skeleton variant="text" height="1rem" />
      <Skeleton variant="text" height="1rem" width="80%" />
      
      <div className="pt-2">
        <Skeleton variant="rectangular" height="12rem" />
      </div>
      
      <div className="space-y-2 pt-2">
        <Skeleton variant="text" height="1rem" />
        <Skeleton variant="text" height="1rem" />
        <Skeleton variant="text" height="1rem" width="90%" />
        <Skeleton variant="text" height="1rem" width="85%" />
      </div>
    </div>
  );
};

// Card Skeleton - pre-made skeleton for card layout
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <Skeleton variant="rectangular" height="12rem" className="w-full" />
      
      <div className="p-4 space-y-3">
        <Skeleton variant="text" height="1.5rem" width="70%" />
        <Skeleton variant="text" height="1rem" />
        <Skeleton variant="text" height="1rem" width="90%" />
        
        <div className="pt-3 flex justify-between">
          <Skeleton variant="text" height="1rem" width="30%" />
          <Skeleton variant="rounded" height="2rem" width="30%" />
        </div>
      </div>
    </div>
  );
};

// Profile Skeleton - pre-made skeleton for user profile
export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Skeleton variant="circular" width="3rem" height="3rem" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" height="1.2rem" width="40%" />
        <Skeleton variant="text" height="0.9rem" width="70%" />
      </div>
    </div>
  );
};

// Progress Indicator with counter
export const ProgressCounter: React.FC<{ 
  current: number; 
  total: number; 
  className?: string;
  showProgress?: boolean;
}> = ({ current, total, className = '', showProgress = true }) => {
  const percentage = Math.round((current / total) * 100) || 0;

  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {current} / {total}
      </span>
      
      {showProgress && (
        <div className="ml-4 flex-1">
          <LinearProgress progress={percentage} height={4} />
        </div>
      )}
    </div>
  );
};

// Loading Button - Button with integrated loading state
export const LoadingButton: React.FC<{
  isLoading: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loadingText?: string;
  spinnerPosition?: 'left' | 'right';
}> = ({
  isLoading,
  onClick,
  children,
  className = '',
  disabled = false,
  loadingText,
  spinnerPosition = 'left'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative inline-flex items-center justify-center py-2 px-4 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${className}`}
    >
      {isLoading && spinnerPosition === 'left' && (
        <LoadingSpinner size="xs" className="mr-2" />
      )}
      
      {isLoading && loadingText ? loadingText : children}
      
      {isLoading && spinnerPosition === 'right' && (
        <LoadingSpinner size="xs" className="ml-2" />
      )}
    </button>
  );
};

export default {
  LoadingSpinner,
  CircularProgress,
  LinearProgress,
  LoadingDots,
  Skeleton,
  ContentLoader,
  SpinnerOverlay,
  ArticleSkeleton,
  CardSkeleton,
  ProfileSkeleton,
  ProgressCounter,
  LoadingButton
};
