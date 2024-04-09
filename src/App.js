import React from 'react';
import './App.scss';
import UserInput from './components/UserInput/UserInput';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <main>
          <UserInput />
        </main>
      </Router>
    </>
  )
}

export default App;
