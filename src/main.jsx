import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles
const style = document.createElement('style');
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #FAFBFC; -webkit-font-smoothing: antialiased; }
  @keyframes cfall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
  button:hover { filter: brightness(1.05); }
  button:active { transform: scale(0.97) !important; }
  textarea:focus, input:focus { border-color: #2B6CB0 !important; }
  *::-webkit-scrollbar { display: none; }
  input, textarea, button { font-family: 'Avenir Next', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
