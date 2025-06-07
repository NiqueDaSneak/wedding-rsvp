import React from 'react';
import './GrayscalePalette.scss';

const grayscaleColors = [
  '#111111', '#333333', '#555555', '#777777', '#999999', '#bbbbbb', '#dddddd', '#f5f5f5', '#ffffff'
];

const GrayscalePalette: React.FC = () => (
  <div className="grayscale-palette">
    {grayscaleColors.map((color, idx) => (
      <div
        key={color}
        className="grayscale-swatch"
        style={{ background: color }}
        aria-label={`Grayscale color ${idx + 1}`}
      />
    ))}
  </div>
);

export default GrayscalePalette;
