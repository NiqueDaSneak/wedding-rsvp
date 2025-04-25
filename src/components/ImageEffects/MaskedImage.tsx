import React from 'react';
import './ImageEffects.scss';

type MaskShape =
  | 'circle'
  | 'diamond'
  | 'heart'
  | 'hexagon'
  | 'elegant'
  | 'none';

interface MaskedImageProps {
  src: string;
  alt: string;
  shape?: MaskShape;
  className?: string;
}

const MaskedImage: React.FC<MaskedImageProps> = ({
  src,
  alt,
  shape = 'circle',
  className = '',
}) => {
  const getClipPath = (maskType: MaskShape): string => {
    const masks = {
      circle: 'circle(45% at center)',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      heart:
        'path("M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z")',
      hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      elegant:
        'path("M 0,60 C 60,0 100,0 160,60 V 140 C 100,200 60,200 0,140 Z")',
      none: 'none',
    };

    return masks[maskType] || 'none';
  };

  return (
    <div className={`masked-image-container ${className}`}>
      <div
        className="masked-image"
        style={{
          WebkitClipPath: getClipPath(shape),
          clipPath: getClipPath(shape),
        }}
      >
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

export default MaskedImage;
