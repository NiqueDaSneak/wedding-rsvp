import React, { useState, useEffect } from 'react';
import './FloatingHoneyfund.scss';

const FloatingHoneyfund: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000); // Show after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`floating-honeyfund ${isVisible ? 'visible' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={handleToggle}
    >
      <div className="fab-card">
        {isExpanded && (
          <>
            <p>Support our journey on <strong>Honeyfund</strong>!</p>
            <a
              href="https://www.honeyfund.com/site/ItsClemmerTime"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              Visit Honeyfund
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingHoneyfund;