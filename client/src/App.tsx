import { useEffect } from "react";
import { useAppSelector } from "./state/hook";
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar";
import SignUp from "./pages/user/auth/SignUp";
import Message from "./pages/message"
import { BrowserRouter, Routes , Route} from "react-router-dom";
import About from "./about/About";
import Login from "./pages/user/auth/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";
import Search from "./search/Search";
import Interviewer from "./pages/Interviewer/Interviewer"
import Settings from "./settings/Settings";
import InterviewerDashboard from "./pages/Interviewer/InterviewerDashboard";
import MyInterViews from "./pages/Interviewer/MyInterViews";
import InterViewConsole from "./pages/Interviewer/InterViewConsole";

function App() {

  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
    else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode])

  return (
<div className="min-h-screen w-full bg-grid bg-light-background dark:bg-dark-background text-sm">
  {/* content */}
         <BrowserRouter>
    <Navbar />
    <Sidebar />
    <Routes>
      <Route path='/' element={< Dashboard />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path="/login" element= {<Login />} />
      <Route path='/about' element={<About/>} />
      <Route path='/message' element={<Message/>} />
      <Route path='/search' element={<Search/>} />
      <Route path='/settings' element={<Settings/>} />
      <Route path='/user/profile/:id' element={<Profile/>} />
      <Route path='/chat/:chatId' element={<Message/>} />

        <Route path="/interviewer" element={<Interviewer />}>
          <Route path="dashboard" element={<InterviewerDashboard />} />
          <Route path="interviews" element={<MyInterViews />} />
          <Route path=":id" element={<InterViewConsole />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
    </Routes>
    </BrowserRouter>
    <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
};


export default App
