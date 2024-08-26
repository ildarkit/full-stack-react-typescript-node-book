import React from 'react';
import Main from './components/areas/main/Main';
import Nav from './components/areas/Nav';
import Sidebar from './components/areas/sidebar/Sidebar';
import LeftMenu from './components/areas/LeftMenu';
import RightMenu from './components/areas/RightMenu';
import './App.css';

function App() {
  return (
    <div className="App">
      <Nav/>
      <Sidebar/>
      <LeftMenu/>
      <Main/>
      <RightMenu/>
    </div>
  );
}

export default App;
