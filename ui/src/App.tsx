import React from 'react';
import './App.css';
import { trpc } from './util/trpc.js';

function App() {
  const file = trpc.allFiles.useQuery();

  if (!file.data) return <div>Loading...</div>;

  return (
    <div className="bg-red-500">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p>Click on the Vite and React logos to learn more</p>
      <button className="btn" type="button">
        Button
      </button>
    </div>
  );
}

export default App;
