import React from 'react';
import { Parallax } from 'react-parallax';
import './ImageEffects.scss';

interface ParallaxImageProps {
  imgSrc: string;
  strength?: number;
  children?: React.ReactNode;
  height?: string;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({
  imgSrc,
  strength = 500,
  children,
  height = '100vh',
}) => {
  return (
    <Parallax
      bgImage={imgSrc}
      strength={strength}
      className="parallax-container"
      bgClassName="parallax-bg"
      contentClassName="parallax-content"
      bgImageStyle={{ objectFit: 'cover' }}
      style={{ height }}
    >
      <div className="parallax-inner">{children}</div>
    </Parallax>
  );
};

export default ParallaxImage;
