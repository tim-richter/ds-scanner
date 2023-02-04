import React from 'react';
import { useRouteError } from 'react-router-dom';

export const Error = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="h-screen flex justify-center items-center flex-col"
    >
      <h1 className="font-bold text-5xl mb-8">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="m-4 px-8 py-3 border-red-500/70 bg-red-500/10 text-red-500 font-bold border-2 rounded-lg">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default Error;
