import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Apply saved theme
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const dark = saved === 'dark' || (!saved && prefersDark);
if (dark) document.documentElement.classList.add('dark');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);