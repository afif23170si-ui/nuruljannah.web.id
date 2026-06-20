"use client";

import { motion } from 'framer-motion';

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: any;
  animationTo?: any;
  easing?: any;
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const BlurText = ({
  text = '',
  delay = 150,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = [0.22, 1, 0.36, 1], // Smoother custom easing curve
  onAnimationComplete,
  stepDuration = 0.8
}: BlurTextProps) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const defaultFrom = { 
    filter: 'blur(8px)', 
    opacity: 0, 
    y: direction === 'top' ? -20 : 20 
  };
  
  const defaultTo = { 
    filter: 'blur(0px)', 
    opacity: 1, 
    y: 0 
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay / 1000 },
    },
  };

  const item = {
    hidden: animationFrom || defaultFrom,
    visible: {
      ...(animationTo || defaultTo),
      transition: { duration: stepDuration, ease: easing }
    }
  };

  return (
    <motion.h1 
      className={className} 
      style={{ display: 'flex', flexWrap: 'wrap' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: rootMargin, amount: threshold }}
      variants={container}
    >
      {elements.map((segment, index) => {
        if (segment === '<br/>') {
          return <div key={index} className="w-full" />;
        }
        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            variants={item}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </motion.h1>
  );
};

export default BlurText;
