import { clsx } from 'clsx';
import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

interface TableRowProps extends WithChildren {
  isData?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  isData = false,
}) => (
  <tr className={clsx(isData && 'border-b even:bg-black/10')}>{children}</tr>
);
