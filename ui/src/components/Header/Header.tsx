import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

export const Header: React.FC<WithChildren> = ({ children }) => (
  <div className="flex h-16 w-full items-center justify-between bg-black p-4">
    <div className="font-bold">DS Scanner</div>

    <div className="flex gap-2">{children}</div>
  </div>
);
