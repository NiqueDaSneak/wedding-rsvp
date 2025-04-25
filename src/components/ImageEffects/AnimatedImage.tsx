import React from 'react';
import { motion } from 'framer-motion';
import './ImageEffects.scss';

type AnimationEffect = 'breathe' | 'glow' | 'float' | 'none';

interface AnimatedImageProps {
  src: string;
  alt: string;
  effect?: AnimationEffect;
  className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  effect = 'breathe',
  className = '',
}) => {
  const animations = {
    breathe: {
      animate: {
        scale: [1, 1.03, 1],
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
        },
      },
    },
    glow: {
      animate: {
        boxShadow: [
          '0 0 0 rgba(255, 255, 255, 0)',
          '0 0 20px rgba(255, 255, 255, 0.5)',
          '0 0 0 rgba(255, 255, 255, 0)',
        ],
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'loop',
        },
      },
    },
    float: {
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
        },
      },
    },
    none: {},
  };

  return (
    <motion.div
      className={`animated-image-container ${className}`}
      initial={{}}
      animate={animations[effect].animate}
    >
      <img src={src} alt={alt} className="animated-image" />
    </motion.div>
  );
};

export default AnimatedImage;
