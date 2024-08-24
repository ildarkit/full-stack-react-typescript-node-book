import {useWindowDimentions} from "../hooks/useWindowDimensions";

const LeftMenu = () => {
  const {width} = useWindowDimentions();
  if (width <= 768) return null;
  return <div className="leftmenu">Left Menu</div>;
};

export default LeftMenu;
