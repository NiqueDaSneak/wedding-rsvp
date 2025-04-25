import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './ImageEffects.scss';

interface RandomRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  distance?: number;
}

const RandomRevealImage: React.FC<RandomRevealImageProps> = ({
  src,
  alt,
  className = '',
  distance = 100,
}) => {
  const [angle, setAngle] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Calculate a random angle on component mount
  useEffect(() => {
    const randomAngle = Math.floor(Math.random() * 360);
    setAngle(randomAngle);
  }, []);

  // Calculate x and y offsets based on the angle and distance
  const calculateOffset = (angleDeg: number, dist: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: Math.cos(angleRad) * dist,
      y: Math.sin(angleRad) * dist,
    };
  };

  const offset = calculateOffset(angle, distance);

  return (
    <div ref={ref} className={`reveal-image-wrapper ${className}`}>
      <motion.div
        className="reveal-image-container"
        initial={{
          x: offset.x,
          y: offset.y,
          opacity: 0,
        }}
        animate={
          inView
            ? { x: 0, y: 0, opacity: 1 }
            : { x: offset.x, y: offset.y, opacity: 0 }
        }
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
        }}
      >
        <img src={src} alt={alt} className="reveal-image" />
      </motion.div>
    </div>
  );
};

export default RandomRevealImage;
