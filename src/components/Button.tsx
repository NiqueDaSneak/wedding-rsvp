import React from 'react';
import './Button.scss';

type ButtonProps = {
  onClick?: () => void;
  href?: string;
  target?: '_self' | '_blank';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  href,
  target = '_self',
  children,
  className = '',
  disabled = false,
}) => {
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={`button ${className}`}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`button ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
