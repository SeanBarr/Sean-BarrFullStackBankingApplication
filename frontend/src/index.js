import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ContextProvider } from "./context/Context";
import './App.css'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('app')
);

reportWebVitals();