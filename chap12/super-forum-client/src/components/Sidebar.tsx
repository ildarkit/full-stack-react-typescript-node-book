import {useWindowDimentions} from "../hooks/useWindowDimensions";

const Sidebar = () => {
  const {width} = useWindowDimentions();
  if (width <= 768) return null;
  return <div className="sidebar">Sidebar</div>;
};

export default Sidebar;
