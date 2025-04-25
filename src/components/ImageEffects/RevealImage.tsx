import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './ImageEffects.scss';

type RevealDirection = 'left' | 'right' | 'top' | 'bottom';

interface RevealImageProps {
  src: string;
  alt: string;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
}

const RevealImage: React.FC<RevealImageProps> = ({
  src,
  alt,
  direction = 'bottom',
  delay = 0,
  className = '',
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const directionVariants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    top: { y: -100, opacity: 0 },
    bottom: { y: 100, opacity: 0 },
  };

  return (
    <div ref={ref} className={`reveal-image-wrapper ${className}`}>
      <motion.div
        className="reveal-image-container"
        initial={directionVariants[direction]}
        animate={
          inView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]
        }
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
          delay: delay,
        }}
      >
        <img src={src} alt={alt} className="reveal-image" />
      </motion.div>
    </div>
  );
};

export default RevealImage;
