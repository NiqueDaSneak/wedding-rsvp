import React, { useEffect, useRef } from 'react';
import './ColorPaletteGlissando.scss';

interface ColorPaletteGlissandoProps {
  colors: string[];
}

const ColorPaletteGlissando: React.FC<ColorPaletteGlissandoProps> = ({ colors }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const swatches = Array.from(container.querySelectorAll('.color-swatch'));
    
    // Initial setup - all swatches are small
    swatches.forEach((swatch) => {
      const el = swatch as HTMLElement;
      el.style.transform = 'scale(0.7)';
      el.style.opacity = '0.7';
    });

    // Create back-and-forth glissando effect
    const animateGlissando = () => {
      let index = 0;
      let direction = 1; // 1 = forward, -1 = backward
      
      const animateNext = () => {
        // Reset all swatches to base state
        swatches.forEach((swatch) => {
          const el = swatch as HTMLElement;
          el.style.transform = 'scale(0.7)';
          el.style.opacity = '0.7';
        });
        
        // Highlight current swatch
        const currentSwatch = swatches[index] as HTMLElement;
        currentSwatch.style.transform = 'scale(1)';
        currentSwatch.style.opacity = '1';
        
        // Highlight adjacent swatches with decreasing intensity
        for (let i = 1; i <= 2; i++) {
          const prevIndex = index - i;
          const nextIndex = index + i;
          
          if (prevIndex >= 0) {
            const prevSwatch = swatches[prevIndex] as HTMLElement;
            prevSwatch.style.transform = `scale(${0.9 - (i - 1) * 0.1})`;
            prevSwatch.style.opacity = `${0.9 - (i - 1) * 0.1}`;
          }
          
          if (nextIndex < swatches.length) {
            const nextSwatch = swatches[nextIndex] as HTMLElement;
            nextSwatch.style.transform = `scale(${0.9 - (i - 1) * 0.1})`;
            nextSwatch.style.opacity = `${0.9 - (i - 1) * 0.1}`;
          }
        }
        
        // Move index based on current direction
        index += direction;
        
        // If we hit an end, reverse direction
        if (index >= swatches.length - 1 || index <= 0) {
          direction *= -1;
        }
        
        // Continue animation
        setTimeout(animateNext, 100); // Speed of glissando
      };
      
      // Start the animation
      animateNext();
    };
    
    // Start the animation with a slight delay
    const timeoutId = setTimeout(animateGlissando, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [colors]);

  return (
    <aside className="color-palette" ref={containerRef}>
      {colors.map((color) => (
        <div
          className="color-swatch"
          style={{ backgroundColor: color }}
          key={color}
        />
      ))}
    </aside>
  );
};

export default ColorPaletteGlissando;
