import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * main entry point for the react application
 * renders the app component into the root dom element
 */

// create root element for react 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// if you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. learn more: https://bit.ly/cra-vitals