import { ReactNode } from 'react';

export type Children = ReactNode;

export type WithChildren<T = any> = T & { children?: Children };
