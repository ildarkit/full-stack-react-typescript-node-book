import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import ThreadCard from './ThreadCard';
import MainHeader from './MainHeader';
import Category from '../../../models/Category';
import {getThreadsByCategory} from '../../../services/DataService';

const Main = () => {
  const {categoryId} = useParams();
  const [category, setCategory] = useState<Category | undefined>();
  const [threadCards, setThreadCards] = useState<Array<JSX.Element | null>>();
  
  useEffect(() => {
    console.log("main categoryId", categoryId);

    if (categoryId && Number(categoryId) > 0) {
      getThreadsByCategory(categoryId).then((threads) => {
        const cards = threads.map((thread) => {
          return <ThreadCard key={`thread-${thread.id}`} thread={thread}/>;
        });
        if (!category) setCategory(threads[0].category);
        setThreadCards(cards);
      });
    }
  }, [categoryId]);

  return (
    <main className="content">
      <MainHeader category={category}/>
      <div>{threadCards}</div>
    </main>
  );
};

export default Main;
