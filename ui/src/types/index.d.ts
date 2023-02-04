import { ReactNode } from 'react';

export type Children = ReactNode;

export type WithChildren<T = any> = T & { children?: Children };

export type RpcResponse<Data> = RpcSuccessResponse<Data> | RpcErrorResponse;

export type RpcSuccessResponse<Data> = {
  id: null;
  result: { type: 'data'; data: Data };
};

export type RpcErrorResponse = {
  id: null;
  error: {
    message: string;
    code: number;
    data: {
      code: string;
      httpStatus: number;
      stack: string;
      path: string; // TQuery
    };
  };
};
