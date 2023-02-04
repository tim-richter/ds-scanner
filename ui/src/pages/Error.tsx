import React from 'react';
import { useRouteError } from 'react-router-dom';

export const Error = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="flex h-screen flex-col items-center justify-center"
    >
      <h1 className="mb-8 text-5xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="m-4 rounded-lg border-2 border-red-500/70 bg-red-500/10 px-8 py-3 font-bold text-red-500">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default Error;
