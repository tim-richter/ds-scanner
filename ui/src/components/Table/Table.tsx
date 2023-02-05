import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

export const Table: React.FC<WithChildren> = ({ children }) => (
  <div className="relative my-12 overflow-x-auto rounded-t-md">
    <table className="w-full text-left text-sm text-white">{children}</table>
  </div>
);
