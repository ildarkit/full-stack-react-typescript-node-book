import {useState, useEffect} from 'react';
import {useWindowDimentions} from "../hooks/useWindowDimensions";
import {getCategories} from '../services/DataService';
import Category from '../models/Category';

const LeftMenu = () => {
  const {width} = useWindowDimentions();
  const [categories, setCategories] = useState<JSX.Element>(
    <div>Left Menu</div>
  );

  useEffect(() => {
    getCategories()
      .then((categories: Array<Category>) => {
        const cats = categories.map(cat => { 
          return <li key={cat.id}>{cat.name}</li>;
        });
        setCategories(<ul className="category">{cats}</ul>);
      })
      .catch(err => console.log(err));
  }, []);

  if (width <= 768) return null;
  return <div className="leftmenu">{categories}</div>;
};

export default LeftMenu;
