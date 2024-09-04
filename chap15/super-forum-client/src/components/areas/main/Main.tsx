import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {gql, useLazyQuery} from '@apollo/client';
import ThreadCard from './ThreadCard';
import MainHeader from './MainHeader';
import Category from '../../../models/Category';

const GetThreadsByCategoryId = gql`
  query getThreadsByCategoryId($categoryId: ID!) {
    getThreadsByCategoryId(categoryId: $categoryId) {
      ... on EntityResult {
        messages
      }

      ... on ThreadArray {
        threads {
          id
          title
          body
          views
          points
          user {
            userName
          }
          threadItems {
            id
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const GetThreadsLatest = gql`
  query getThreadsLatest {
    getThreadsLatest {
      ... on EntityResult {
        messages
      }

      ... on ThreadArray {
        threads {
          id
          title
          body
          views
          points
          user {
            userName
          }
          threadItems {
            id
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const Main = () => {
  const [
    execGetThreadsByCat,
    {
      data: threadsByCatData,
    },
  ] = useLazyQuery(GetThreadsByCategoryId);
  const [
    execGetThreadsLatest,
    {
      data: threadsLatestData,
    },
  ] = useLazyQuery(GetThreadsLatest);
  const {categoryId} = useParams();
  const [category, setCategory] = useState<Category | undefined>();
  const [threadCards, setThreadCards] = useState<Array<JSX.Element | null>>();
  
  useEffect(() => {
    console.log("main categoryId", categoryId);

    if (categoryId && Number(categoryId) > 0) {
      execGetThreadsByCat({
        variables: {
          categoryId,
        },
      });
    } else execGetThreadsLatest();
  }, [categoryId]);

  useEffect(() => {
    console.log("main threadsByCatData", threadsByCatData);
    if (
      threadsByCatData &&
      threadsByCatData.getThreadsByCategoryId &&
      threadsByCatData.getThreadsByCategoryId.threads
    ) {
      const threads = threadsByCatData.getThreadsByCategoryId.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th}/>
      });
      setCategory(threads[0].category);
      setThreadCards(cards);
    }
  }, [threadsByCatData])

  useEffect(() => {
    if (
      threadsLatestData &&
      threadsLatestData.getThreadsLatest &&
      threadsLatestData.getThreadsLatest.threads
    ) {
      const threads = threadsLatestData.getThreadsLatest.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th}/>
      });
      setCategory(new Category("0", "Latest"));
      setThreadCards(cards);
    }
  }, [threadsLatestData]);

  return (
    <main className="content">
      <MainHeader category={category}/>
      <div>{threadCards}</div>
    </main>
  );
};

export default Main;
