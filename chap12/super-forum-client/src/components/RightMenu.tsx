import {useWindowDimentions} from "../hooks/useWindowDimensions";

const RightMenu = () => {
  const {width} = useWindowDimentions();
  if (width <= 768) return null;
  return <div className="rightmenu">Right Menu</div>;
};

export default RightMenu;
