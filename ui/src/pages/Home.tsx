import React from 'react';
import { trpc } from '../util/trpc.js';

export const Home = () => {
  const components = trpc.uniqueComponents.useQuery();

  if (components.isLoading || !components.data) return <div>Loading...</div>;

  return (
    <div>
      <div className="hero place-items-start p-10">
        <div className="hero-content flex-col items-start">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hey.</h1>
            <p className="py-6 text-2xl">
              We found {components.data.length} unique components.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {components.data.map((component) => (
              <tr key={component.name}>
                <td>{component.name}</td>
                <td>{component.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
