import {FC} from 'react';
import Nav from '../areas/Nav';
import Sidebar from '../areas/sidebar/Sidebar';
import LeftMenu from '../areas/LeftMenu';
import RightMenu from '../areas/RightMenu';
import Main from '../areas/main/Main';
import './Home.css';

const Home: FC = () => {
  return (
    <div className="screen-root-container home-container">
      <div className="navigation">
        <Nav/>
      </div>
      <Sidebar/>
      <LeftMenu/>
      <Main/>
      <RightMenu/>
    </div>
  );
};

export default Home;
