import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './ImageEffects.scss';

interface FadeInImageProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
}

const FadeInImage: React.FC<FadeInImageProps> = ({
  src,
  alt,
  className = '',
  delay = 0,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={`fade-in-image-wrapper ${className}`}>
      <motion.div
        className="fade-in-image-container"
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: inView ? 0 : 20,
          opacity: inView ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
          delay: delay,
        }}
      >
        <img src={src} alt={alt} className="fade-in-image" />
      </motion.div>
    </div>
  );
};

export default FadeInImage;