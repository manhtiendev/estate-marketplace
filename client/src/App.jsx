import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import { Header } from './components/header';
import PrivateRoute from './components/common/PrivateRoute';
import AuthorizationRoute from './components/common/AuthorizationRoute';
import CreateListing from './pages/CreateListing';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route element={<AuthorizationRoute />}>
          <Route path='/sign-in' element={<SignIn />}></Route>
          <Route path='/sign-up' element={<SignUp />}></Route>
        </Route>
        <Route path='/about' element={<About />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/create-listing' element={<CreateListing />}></Route>
        </Route>
      </Routes>
    </>
  );
}
