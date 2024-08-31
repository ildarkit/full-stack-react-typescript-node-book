import {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/routes/Home';
import Thread from './components/routes/thread/Thread';
import './App.css';
import UserProfile from './components/routes/userProfile/UserProfile';
import {useDispatch} from 'react-redux';
import {UserProfileSetType} from './store/user/Reducer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: UserProfileSetType,
      payload: {
        id: 1,
        userName: "testUser",
      },
    });
  }, [dispatch]);

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
