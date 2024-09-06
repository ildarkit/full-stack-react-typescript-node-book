import {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import {useDispatch} from 'react-redux';
import Home from './components/routes/Home';
import Thread from './components/routes/thread/Thread';
import './App.css';
import UserProfile from './components/routes/userProfile/UserProfile';
import {ThreadCategoriesType} from './store/categories/Reducer';
import useRefreshReduxMe from './hooks/useRefreshReduxMe';

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      name
    }
  }
`;

function App() {
  const {data: categoriesData} = useQuery(GetAllCategories);
  const {execMe, updateMe} = useRefreshReduxMe();
  const dispatch = useDispatch();

  useEffect(() => {
    execMe();
  }, [execMe]);

  useEffect(() => {
    updateMe();
  }, [updateMe]);

  useEffect(() => { 
    if (categoriesData && categoriesData.getAllCategories) {
      dispatch({
        type: ThreadCategoriesType,
        payload: categoriesData.getAllCategories,
      });
    }
  }, [dispatch, categoriesData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/categorythreads/:categoryId" element={<Home/>}/>
        <Route path="/thread/:id?" element={<Thread/>}/>
        <Route path="/userprofile/:id" element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
