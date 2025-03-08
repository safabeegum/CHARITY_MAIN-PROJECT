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
import GameIndex from './components/GameIndex';
import Quiz from './components/Quiz';
import GuessTheNumber from './components/GuessTheNumber';
import TicTacToe from './components/TicTacToe';
import SnakeGame from './components/SnakeGame';
import Hangman from './components/Hangman';
import Review from './components/Review';
import ManageReview from './components/ManageReview';
import MyProfile from './components/MyProfile';
import EditProfileModal from './components/EditProfileModal';
import MakePayment from './components/MakePayment';
import PaymentDetails from './components/PaymentDetails';
import PaymentHistory from './components/PaymentHistory';

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
        <Route path='/gameindex' element={<GameIndex/>}/>
        <Route path='/makepayment' element={<MakePayment/>}/>
        <Route path='/paymentdetails' element={<PaymentDetails/>}/>
        <Route path='/paymenthistory' element={<PaymentHistory/>}/>
        <Route path="/paymentdetails/:method/:amount" element={<PaymentDetails />} />
        <Route path="/success" element={<h2>Payment Successful!</h2>} />
        <Route path='/review' element={<Review/>}/>
        <Route path='/managereview' element={<ManageReview/>}/>
        <Route path='/myprofile' element={<MyProfile/>}/>
        <Route path='/editprofilemodal' element={<EditProfileModal/>}/>
        <Route path='/quiz' element={<Quiz/>}/>
        <Route path='/guessthenumber' element={<GuessTheNumber/>}/>
        <Route path='/tictactoe' element={<TicTacToe/>}/>
        <Route path='/snakegame' element={<SnakeGame/>}/>
        <Route path='/hangman' element={<Hangman/>}/>
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
