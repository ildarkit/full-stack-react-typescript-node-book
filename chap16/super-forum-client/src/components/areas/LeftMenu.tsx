import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import {useWindowDimensions} from "../../hooks/useWindowDimensions";

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      name
    }
  }
`;

const LeftMenu = () => {
  const {loading, error, data} = useQuery(GetAllCategories);
  const {width} = useWindowDimensions();
  const [categories, setCategories] = useState<JSX.Element>(
    <div>Left Menu</div>
  );

  useEffect(() => {
    if (loading)
      setCategories(<span>Loading...</span>);
    else if (error) 
      setCategories(<span>Error: {error.message}</span>);
    else {
      if (data && data.getAllCategories) {
        const cats = data.getAllCategories.map((cat: any) => (
          <li key={cat.id}>
            <Link to={`/categorythreads/${cat.id}`}>{cat.name}</Link>
          </li>
        ));
        setCategories(<ul className="category">{cats}</ul>);
      }
    }
  }, [data]);

  if (width <= 768) return null;
  return <div className="leftmenu">{categories}</div>;
};

export default LeftMenu;
