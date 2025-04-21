import React from 'react';
import './WebGPUHashtag.scss';

interface WebGPUHashtagProps {
  hashtag?: string;
}

const WebGPUHashtag: React.FC<WebGPUHashtagProps> = ({ hashtag = "#itsclemmertime" }) => {
  // We'll go straight to the fallback version since that will definitely display
  return (
    <div className="webgpu-hashtag-container">
      <div className="webgpu-fallback">
        <span className="hashtag-text">{hashtag}</span>
      </div>
    </div>
  );
};

export default WebGPUHashtag;
