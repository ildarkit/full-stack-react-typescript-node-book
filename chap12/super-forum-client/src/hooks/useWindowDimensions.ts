import {useState, useEffect} from "react";

export interface WindowDimention {
  height: number;
  width: number;
}

export const useWindowDimentions = (): WindowDimention => {
  const [dimension, setDimension] = useState<WindowDimention>({
    height: 0,
    width: 0,
  });

  const handleResize = () => {
    setDimension({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return dimension;
};
