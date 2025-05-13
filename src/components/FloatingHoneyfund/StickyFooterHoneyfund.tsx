import React, { useEffect, useState } from 'react';
import './StickyFooterHoneyfund.scss';
import Button from '../Button';

const StickyFooterHoneyfund: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000); // Show after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`sticky-footer ${isVisible ? 'visible' : ''}`}>
      <button className="close-button" onClick={() => setIsVisible(false)} aria-label="Close">
        ×
      </button>
      <div className="footer-content">
        <p>Your love and support mean the world to us. If you'd like to contribute to our journey, visit our Honeyfund page.</p>
        <Button
          href="https://www.honeyfund.com/site/ItsClemmerTime"
          target="_blank"
          className="sticky-honeyfund-button"
        >
          Visit Honeyfund
        </Button>
      </div>
    </div>
  );
};

export default StickyFooterHoneyfund;
