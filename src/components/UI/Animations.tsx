import React, { ReactNode } from 'react';
import { motion, AnimatePresence, Variant, Variants } from 'framer-motion';

// Types
type AnimationDirection = 'up' | 'down' | 'left' | 'right';
type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'flip';
type StaggerDirection = 'forward' | 'reverse';

// Props interfaces
interface FadeProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  isVisible?: boolean;
}

interface SlideProps extends FadeProps {
  direction?: AnimationDirection;
  distance?: number;
}

interface ScaleProps extends FadeProps {
  initialScale?: number;
}

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

interface AnimatedListProps {
  children: ReactNode[];
  staggerChildren?: number;
  direction?: StaggerDirection;
  className?: string;
}

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  whileHover?: Variant;
  whileTap?: Variant;
  disabled?: boolean;
}

// Animation variants
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const getSlideVariants = (direction: AnimationDirection, distance: number): Variants => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'left' || direction === 'up' ? '' : '-';
  
  return {
    hidden: { opacity: 0, [axis]: `${sign}${distance}px` },
    visible: { 
      opacity: 1, 
      [axis]: 0,
      transition: {
        opacity: { duration: 0.4 },
        [axis]: { type: 'spring', stiffness: 300, damping: 30 }
      }
    },
    exit: { 
      opacity: 0, 
      [axis]: `${sign}${distance}px`,
      transition: { duration: 0.2 }
    }
  };
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      opacity: { duration: 0.4 },
      scale: { type: 'spring', stiffness: 300, damping: 30 }
    }
  },
  exit: { opacity: 0, scale: 0, transition: { duration: 0.2 } }
};

const bounceVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      opacity: { duration: 0.4 },
      y: { type: 'spring', stiffness: 400, damping: 10 }
    }
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const flipVariants: Variants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: { 
    opacity: 1, 
    rotateX: 0,
    transition: {
      opacity: { duration: 0.4 },
      rotateX: { type: 'spring', stiffness: 100, damping: 20 }
    }
  },
  exit: { opacity: 0, rotateX: -90, transition: { duration: 0.2 } }
};

const pageTransitionVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

// Components

// Fade Animation Component
export const FadeAnimation: React.FC<FadeProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = '', 
  isVisible = true 
}) => (
  <AnimatePresence mode="wait">
    {isVisible && (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeVariants}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Slide Animation Component
export const SlideAnimation: React.FC<SlideProps> = ({ 
  children, 
  direction = 'up', 
  distance = 50,
  duration = 0.5, 
  delay = 0, 
  className = '',
  isVisible = true
}) => (
  <AnimatePresence mode="wait">
    {isVisible && (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={getSlideVariants(direction, distance)}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Scale Animation Component
export const ScaleAnimation: React.FC<ScaleProps> = ({ 
  children, 
  initialScale = 0.8,
  duration = 0.5, 
  delay = 0, 
  className = '',
  isVisible = true
}) => {
  const customScaleVariants = {
    ...scaleVariants,
    hidden: { ...scaleVariants.hidden, scale: initialScale }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={customScaleVariants}
          transition={{ duration, delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Bounce Animation Component
export const BounceAnimation: React.FC<FadeProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = '',
  isVisible = true
}) => (
  <AnimatePresence mode="wait">
    {isVisible && (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={bounceVariants}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Flip Animation Component
export const FlipAnimation: React.FC<FadeProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  className = '',
  isVisible = true
}) => (
  <AnimatePresence mode="wait">
    {isVisible && (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={flipVariants}
        transition={{ duration, delay }}
        style={{ perspective: 1000 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Page Transition Component
export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children,
  className = ''
}) => (
  <motion.div
    className={className}
    initial="initial"
    animate="enter"
    exit="exit"
    variants={pageTransitionVariants}
  >
    {children}
  </motion.div>
);

// Animated List Component
export const AnimatedList: React.FC<AnimatedListProps> = ({ 
  children, 
  staggerChildren = 0.1,
  direction = 'forward',
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: 0.1,
        staggerDirection: direction === 'forward' ? 1 : -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: "spring", stiffness: 300, damping: 24 },
        opacity: { duration: 0.4 }
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Animated Button Component
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onClick,
  className = '',
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  disabled = false
}) => (
  <motion.button
    className={className}
    onClick={onClick}
    whileHover={disabled ? {} : whileHover}
    whileTap={disabled ? {} : whileTap}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

// Specialized animation components for common use cases
export const FadeIn: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '',
  delay = 0 
}) => (
  <FadeAnimation delay={delay} className={className}>
    {children}
  </FadeAnimation>
);

export const SlideInFromBottom: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '',
  delay = 0 
}) => (
  <SlideAnimation direction="up" delay={delay} className={className}>
    {children}
  </SlideAnimation>
);

export const SlideInFromLeft: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '',
  delay = 0 
}) => (
  <SlideAnimation direction="right" delay={delay} className={className}>
    {children}
  </SlideAnimation>
);

export const PopIn: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '',
  delay = 0 
}) => (
  <ScaleAnimation delay={delay} className={className}>
    {children}
  </ScaleAnimation>
);

export default {
  FadeAnimation,
  SlideAnimation,
  ScaleAnimation,
  BounceAnimation,
  FlipAnimation,
  PageTransition,
  AnimatedList,
  AnimatedButton,
  FadeIn,
  SlideInFromBottom,
  SlideInFromLeft,
  PopIn
};
