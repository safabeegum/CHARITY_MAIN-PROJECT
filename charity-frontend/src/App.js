import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Nav from './components/Nav';

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
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
