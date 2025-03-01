import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Nav from './components/Nav';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminNavbar from './components/AdminNavbar';
import ManageUsers from './components/ManageUsers';
import ManageSocialWorkers from './components/ManageSocialWorkers';
import SocialWorkersLogin from './components/SocialWorkersLogin';
import SocialWorkersDashboard from './components/SocialWorkersDashboard';
import SocialWorkersNavbar from './components/SocialWorkersNavbar';
import UserDashboard from './components/UserDashboard';
import UserNavbar from './components/UserNavbar';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/navbar' element={<Navbar/>}/>
        <Route path='/nav' element={<Nav/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/adminlogin' element={<AdminLogin/>}/>
        <Route path='/adminnavbar' element={<AdminNavbar/>}/>
        <Route path='/admindashboard' element={<AdminDashboard/>}/>
        <Route path='/manageusers' element={<ManageUsers/>}/>
        <Route path='/managesocialworkers' element={<ManageSocialWorkers/>}/>
        <Route path='/socialworkerslogin' element={<SocialWorkersLogin/>}/>
        <Route path='/socialworkersnavbar' element={<SocialWorkersNavbar/>}/>
        <Route path='/socialworkersdashboard' element={<SocialWorkersDashboard/>}/>
        <Route path='/usernavbar' element={<UserNavbar/>}/>
        <Route path='/userdashboard' element={<UserDashboard/>}/>
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
