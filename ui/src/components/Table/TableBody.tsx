import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

export const TableBody: React.FC<WithChildren> = ({ children }) => (
  <tbody>{children}</tbody>
);
