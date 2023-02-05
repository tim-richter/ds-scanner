import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

export const TableHead: React.FC<WithChildren> = ({ children }) => (
  <thead className="bg-black/20 text-xs uppercase text-white">{children}</thead>
);
