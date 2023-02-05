import { clsx } from 'clsx';
import React from 'react';
import { WithChildren } from 'ui/src/types/index.js';

interface TableCellProps extends WithChildren {
  isData?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  isData = false,
}) => (
  <th
    scope={isData ? 'row' : 'col'}
    className={clsx(
      'px-6 py-3',
      isData && 'whitespace-nowrap font-normal text-white'
    )}
  >
    {children}
  </th>
);
