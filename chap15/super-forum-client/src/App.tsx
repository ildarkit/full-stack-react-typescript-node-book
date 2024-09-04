import {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import {useDispatch} from 'react-redux';
import Home from './components/routes/Home';
import Thread from './components/routes/thread/Thread';
import './App.css';
import UserProfile from './components/routes/userProfile/UserProfile';
import {UserProfileSetType} from './store/user/Reducer';
import {ThreadCategoriesType} from './store/categories/Reducer';

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      name
    }
  }
`;

function App() {
  const {data} = useQuery(GetAllCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: UserProfileSetType,
      payload: {
        id: 1,
        userName: "testUser",
      },
    });
    if (data && data.getAllCategories) {
      dispatch({
        type: ThreadCategoriesType,
        payload: data.getAllCategories,
      });
    }
  }, [dispatch, data]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/categorythreads/:categoryId" element={<Home/>}/>
        <Route path="/thread/:id" element={<Thread/>}/>
        <Route path="/userprofile/:id" element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
