import React, { useRef } from 'react';
import './AnimatedHashtag.scss';

const AnimatedHashtag: React.FC = () => {
  const textRef = useRef<SVGTextElement>(null);

  return (
    <div className="animated-hashtag">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background subtle glow */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Main text - using CSS animations instead of JS */}
        <text
          ref={textRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="hashtag-text"
          filter="url(#glow)"
        >
          #itsclemmertime
        </text>

        {/* Subtle animated underline */}
        <line x1="150" y1="65" x2="450" y2="65" className="hashtag-underline" />
      </svg>
    </div>
  );
};

export default AnimatedHashtag;
