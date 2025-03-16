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
import AddPost from './components/AddPost';
import PendingPosts from './components/PendingPosts';
import LeadershipIndex from './components/LeadershipIndex';
import GuessTheNumberLeader from './components/GuessTheNumberLeader';
import QuizLeader from './components/QuizLeader';
import TicTacToeLeader from './components/TicTacToeLeader';
import SnakeGameLeader from './components/SnakeGameLeader';
import HangmanLeader from './components/HangmanLeader';
import ApprovedPost from './components/ApprovedPost';
import RejectedPost from './components/RejectedPost';
import GamePayments from './components/GamePayments';
import Donations from './components/Donations';
import CompletedPosts from './components/CompletedPosts';
import  Wallet  from './components/Wallet';
import RewardsList from './components/RewardsList';
import AdminReport from './components/AdminReport';
import ManagePosts from './components/ManagePosts';
import ViewReports from './components/ViewReports';
import Announcements from './components/Announcements';
import UserAnnouncements from './components/UserAnnouncements';


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
        <Route path='/pendingposts' element={<PendingPosts/>}/>
        <Route path='/manageusers' element={<ManageUsers/>}/>
        <Route path='/managesocialworkers' element={<ManageSocialWorkers/>}/>
        <Route path='/socialworkerslogin' element={<SocialWorkersLogin/>}/>
        <Route path='/socialworkersnavbar' element={<SocialWorkersNavbar/>}/>
        <Route path='/socialworkersdashboard' element={<SocialWorkersDashboard/>}/>
        <Route path='/addpost' element={<AddPost/>}/>
        <Route path='/usernavbar' element={<UserNavbar/>}/>
        <Route path='/userdashboard' element={<UserDashboard/>}/>
        <Route path="/gameindex" element={<GameIndex />} />
        <Route path='/makepayment/:postId' element={<MakePayment/>}/>
        <Route path='/paymentdetails/:method/:amount/:postId' element={<PaymentDetails/>}/>
        <Route path='/paymenthistory' element={<PaymentHistory/>}/>
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
        <Route path='/leadership' element={<LeadershipIndex/>}/>
        <Route path='/guessthenumberleader' element={<GuessTheNumberLeader/>}/>
        <Route path='/quizleader' element={<QuizLeader/>}/>
        <Route path='/tictactoeleader' element={<TicTacToeLeader/>}/>
        <Route path='/snakegameleader' element={<SnakeGameLeader/>}/> 
        <Route path='/hangmanleader' element={<HangmanLeader/>}/> 
        <Route path='/approvedposts' element={<ApprovedPost/>}/>
        <Route path='/rejectedposts' element={<RejectedPost/>}/> 
        <Route path='/gamepayments' element={<GamePayments/>}/> 
        <Route path='/donations' element={<Donations/>}/> 
        <Route path='/completedposts' element={<CompletedPosts/>}/> 
        <Route path='/wallet' element={<Wallet/>}/> 
        <Route path='/rewardslist' element={<RewardsList/>}/> 
        <Route path='/adminreport' element={<AdminReport/>}/> 
        <Route path='/manageposts' element={<ManagePosts/>}/> 
        <Route path='/viewreports' element={<ViewReports/>}/> 
        <Route path='/announcements' element={<Announcements/>}/> 
        <Route path='/userannouncements' element={<UserAnnouncements/>}/> 
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
