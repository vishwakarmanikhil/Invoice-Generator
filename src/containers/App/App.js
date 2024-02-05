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

      <div className='credit__wrapper'>Developed by <a href='https://github.com/vishwakarmanikhil' target='_blank'>Nikhil Vishwakarma</a></div>
    </div>
  );
}

export default App;
