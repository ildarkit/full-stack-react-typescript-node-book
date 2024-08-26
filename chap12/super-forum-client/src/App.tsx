import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/routes/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/categorythreads/:categoryId" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
