import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

export const Header: React.FC<WithChildren> = ({ children }) => (
  <div className="flex h-16 w-full items-center justify-between border-b-1 border-slate-500/50 p-4">
    <div className="select-none font-bold">Design System Scanner</div>

    <div className="flex gap-2">{children}</div>
  </div>
);
