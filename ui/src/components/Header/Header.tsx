import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

export const Header: React.FC<WithChildren> = ({ children }) => (
  <div className="w-full h-16 bg-black flex items-center justify-between p-4">
    <div className="font-bold">DS Scanner</div>

    <div className="flex gap-2">{children}</div>
  </div>
);
