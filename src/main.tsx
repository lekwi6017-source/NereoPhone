import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { StoreContext, defaultState } from './store/state';

function Root() {
  const [state, setState] = useState(defaultState);

  return (
    <React.StrictMode>
      <StoreContext.Provider value={{ state, setState }}>
        <RouterProvider router={router} />
      </StoreContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
