import React from 'react';
import { motion } from 'framer-motion';
import './ImageEffects.scss';

type TransitionType = 'fade' | 'scale' | 'slide' | 'morph';

interface TransitionImageProps {
  src: string;
  alt: string;
  type?: TransitionType;
  onClick?: () => void;
  className?: string;
}

const TransitionImage: React.FC<TransitionImageProps> = ({
  src,
  alt,
  type = 'fade',
  onClick,
  className = '',
}) => {
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.8, ease: 'easeOut' },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    slide: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.7, ease: 'easeOut' },
    },
    morph: {
      initial: { opacity: 0, borderRadius: '0%' },
      animate: { opacity: 1, borderRadius: '25%' },
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className={`transition-image-container ${className}`}
      initial={transitions[type].initial}
      animate={transitions[type].animate}
      transition={transitions[type].transition}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={src} alt={alt} className="transition-image" />
    </motion.div>
  );
};

export default TransitionImage;
