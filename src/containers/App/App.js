import React from 'react';
import './common.css';
import './global.css';
import './App.css';
import AppRouter from './AppRouter';

const toolbarHeight = window.outerHeight - window.innerHeight;

function App() {
  return (
    <div 
      className="App"
      style={{ height: `calc(100% - ${toolbarHeight}px)` }}
    >
      <AppRouter />
    </div>
  );
}

export default App;
