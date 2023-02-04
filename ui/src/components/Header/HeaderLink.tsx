import React from 'react';
import { clsx } from 'clsx';
import { WithChildren } from 'ui/src/types/index.js';
import { NavLink } from 'react-router-dom';

interface HeaderLinkProps extends WithChildren {
  to: string;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        'py-1 px-3',
        isActive &&
          'underline underline-offset-2 decoration-green-300 decoration-2 font-bold'
      )
    }
  >
    {children}
  </NavLink>
);
