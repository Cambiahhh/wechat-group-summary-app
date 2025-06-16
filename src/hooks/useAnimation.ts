import { useState, useEffect, useCallback } from 'react';
import { AnimationControls, useAnimation, Variants } from 'framer-motion';
import { useRef } from 'react';

/**
 * Animation preset types
 */
export type AnimationPreset = 
  | 'fadeIn'
  | 'fadeOut'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideOutUp'
  | 'slideOutDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'rotate';

/**
 * Animation duration presets
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'very-slow';

/**
 * Animation easing presets
 */
export type AnimationEasing = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring';

export interface AnimationOptions {
  duration?: number | AnimationDuration;
  delay?: number;
  easing?: AnimationEasing;
  repeat?: number | 'infinity';
  repeatType?: 'loop' | 'reverse' | 'mirror';
  onStart?: () => void;
  onComplete?: () => void;
}

/**
 * Transform duration preset to milliseconds
 */
const getDuration = (duration: number | AnimationDuration): number => {
  if (typeof duration === 'number') return duration;
  
  switch (duration) {
    case 'fast': return 0.2;
    case 'normal': return 0.5;
    case 'slow': return 0.8;
    case 'very-slow': return 1.5;
    default: return 0.5;
  }
};

/**
 * Transform easing preset to actual easing value
 */
const getEasing = (easing: AnimationEasing): string | number[] => {
  switch (easing) {
    case 'linear': return [0, 0, 1, 1];
    case 'ease': return [0.25, 0.1, 0.25, 1];
    case 'ease-in': return [0.42, 0, 1, 1];
    case 'ease-out': return [0, 0, 0.58, 1];
    case 'ease-in-out': return [0.42, 0, 0.58, 1];
    case 'spring': return [0.25, 0.8, 0.5, 1];
    default: return [0.25, 0.1, 0.25, 1]; // Default to ease
  }
};

/**
 * Get animation variants based on preset
 */
const getPresetVariants = (preset: AnimationPreset, options: AnimationOptions = {}): Variants => {
  const { duration = 'normal', delay = 0, easing = 'ease' } = options;
  const durationMs = getDuration(duration);
  const easingValue = getEasing(easing);

  const transitionBase = {
    duration: durationMs,
    delay,
    ease: easingValue,
  };
  
  // Add repeat configuration if provided
  const transition = {
    ...transitionBase,
    ...(options.repeat && { 
      repeat: options.repeat === 'infinity' ? Infinity : options.repeat,
      ...(options.repeatType && { repeatType: options.repeatType })
    }),
  };

  const getTransitionWithType = (type: string) => ({
    ...transition,
    type
  });

  const springTransition = getTransitionWithType('spring');
  const tweenTransition = getTransitionWithType('tween');

  switch (preset) {
    case 'fadeIn':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: tweenTransition }
      };
    case 'fadeOut':
      return {
        initial: { opacity: 1 },
        animate: { opacity: 0, transition: tweenTransition }
      };
    case 'slideInUp':
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: springTransition }
      };
    case 'slideInDown':
      return {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0, transition: springTransition }
      };
    case 'slideInLeft':
      return {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0, transition: springTransition }
      };
    case 'slideInRight':
      return {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0, transition: springTransition }
      };
    case 'slideOutUp':
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 0, y: -50, transition: springTransition }
      };
    case 'slideOutDown':
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 0, y: 50, transition: springTransition }
      };
    case 'slideOutLeft':
      return {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 0, x: -50, transition: springTransition }
      };
    case 'slideOutRight':
      return {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 0, x: 50, transition: springTransition }
      };
    case 'scaleIn':
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: springTransition }
      };
    case 'scaleOut':
      return {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 0, scale: 0.8, transition: springTransition }
      };
    case 'bounce':
      return {
        initial: { y: 0 },
        animate: { y: [0, -15, 0], transition: { ...springTransition, times: [0, 0.5, 1], duration: 0.6 } }
      };
    case 'pulse':
      return {
        initial: { scale: 1 },
        animate: { scale: [1, 1.05, 1], transition: { ...tweenTransition, times: [0, 0.5, 1] } }
      };
    case 'shake':
      return {
        initial: { x: 0 },
        animate: { x: [0, -10, 10, -10, 10, 0], transition: { ...springTransition, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } }
      };
    case 'rotate':
      return {
        initial: { rotate: 0 },
        animate: { rotate: 360, transition: { ...tweenTransition, duration: 1 } }
      };
    default:
      return {
        initial: {},
        animate: {}
      };
  }
};

/**
 * Custom hook for handling animations
 */
export function useAnimations() {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const callbackRef = useRef<(() => void) | null>(null);

  /**
   * Start an animation with the given preset and options
   */
  const animate = useCallback(async (
    preset: AnimationPreset, 
    options: AnimationOptions = {}
  ) => {
    const { onStart, onComplete } = options;
    const variants = getPresetVariants(preset, options);
    
    try {
      setIsAnimating(true);
      if (onStart) onStart();
      
      // Store onComplete callback for later use
      callbackRef.current = onComplete || null;
      
      // Start the animation
      await controls.start(variants.animate);
      
      setHasAnimated(true);
      setIsAnimating(false);
      
      // Execute the callback if it exists
      if (callbackRef.current) {
        callbackRef.current();
        callbackRef.current = null;
      }
    } catch (error) {
      console.error('Animation error:', error);
      setIsAnimating(false);
    }
  }, [controls]);

  /**
   * Stop the current animation
   */
  const stop = useCallback(() => {
    controls.stop();
    setIsAnimating(false);
  }, [controls]);

  /**
   * Reset animation state
   */
  const reset = useCallback(() => {
    setHasAnimated(false);
    setIsAnimating(false);
    callbackRef.current = null;
  }, []);

  /**
   * Get a full set of animation props ready to spread into a motion component
   */
  const getAnimationProps = useCallback((
    preset: AnimationPreset,
    options: AnimationOptions = {}
  ) => {
    const variants = getPresetVariants(preset, options);
    
    return {
      initial: variants.initial,
      animate: controls,
      onAnimationStart: options.onStart,
      onAnimationComplete: options.onComplete,
    };
  }, [controls]);

  /**
   * Dynamically calculate animation parameters based on element properties
   */
  const calculateDynamicAnimation = useCallback((
    elementSize: { width: number, height: number },
    viewportSize: { width: number, height: number },
    basePreset: AnimationPreset
  ): { preset: AnimationPreset, options: AnimationOptions } => {
    // Default options
    const options: AnimationOptions = {
      duration: 'normal',
      easing: 'spring',
    };
    
    // Calculate animation distance based on element size relative to viewport
    const sizeRatio = Math.min(elementSize.width / viewportSize.width, elementSize.height / viewportSize.height);
    
    // Adjust duration based on element size
    if (sizeRatio > 0.7) {
      options.duration = 'slow';
    } else if (sizeRatio < 0.3) {
      options.duration = 'fast';
    }
    
    // Return the best animation for this element
    return { preset: basePreset, options };
  }, []);

  return {
    controls,
    isAnimating,
    hasAnimated,
    animate,
    stop,
    reset,
    getAnimationProps,
    calculateDynamicAnimation,
    getPresetVariants
  };
}

export default useAnimations;
