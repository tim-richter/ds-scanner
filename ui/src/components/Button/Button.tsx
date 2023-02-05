import { clsx } from 'clsx';
import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

interface ButtonProps extends WithChildren {
  color?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, color }) => (
  <button
    type="button"
    className={clsx(
      color === 'secondary' &&
        'rounded-lg border-1 border-secondary bg-secondary/10 py-1 px-3 text-sm text-secondary transition-colors duration-300 hover:bg-secondary hover:text-white'
    )}
  >
    {children}
  </button>
);
