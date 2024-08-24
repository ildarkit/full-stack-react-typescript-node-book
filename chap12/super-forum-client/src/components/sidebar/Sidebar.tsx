import {useWindowDimentions} from "../../hooks/useWindowDimensions";
import SideBarMenus from './SideBarMenus';

const Sidebar = () => {
  const {width} = useWindowDimentions();
  if (width <= 768) return null;
  return <div className="sidebar"><SideBarMenus /></div>;
};

export default Sidebar;
