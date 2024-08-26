import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/routes/Home';
import Thread from './components/routes/thread/Thread';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/categorythreads/:categoryId" element={<Home/>}/>
        <Route path="/thread/:id" element={<Thread/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
