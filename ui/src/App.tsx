import React from 'react';
import './App.css';
import { trpc } from './util/trpc.js';

function App() {
  const file = trpc.allFiles.useQuery();

  if (!file.data) return <div>Loading...</div>;

  return (
    <div>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
          <div className="hero min-h-screen bg-base-200 place-items-start p-10">
            <div className="hero-content justify-start">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Hey.</h1>
                <p className="text-2xl py-6">We found 10 unique components.</p>
                <button className="btn btn-primary" type="button">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay" />
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li>
              <a>Overview</a>
            </li>
            <li>
              <a>Components</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
