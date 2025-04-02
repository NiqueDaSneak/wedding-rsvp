import React, { useEffect } from 'react';
import TypeIt from 'typeit';

const IntroText: React.FC = () => {
  useEffect(() => {
    new TypeIt('#intro-text', {
      speed: 100,
      waitUntilVisible: true,
    })
      .type('Dominique')
      .break()
      .type(' &')
      .break()
      .type('Sabigaynn,')
      .pause(1000) // Pause for 1000ms (1 second)
      .break()
      .type(' want to')
      .break()
      .type(' invite you...')
      .go();
  }, []);

  return (
    <div
      id="intro-text"
      style={{
        fontFamily: "'Playwrite TZ', cursive",
        fontSize: '14pt',
        lineHeight: '1.5em',
        textAlign: 'center',
        minHeight: '150px',
        color: 'white',
      }}
    ></div>
  );
};

export default IntroText;
