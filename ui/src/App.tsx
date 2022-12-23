import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/scan-data.json')
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          type="button"
          onClick={() => setCount((currentCount) => currentCount + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
