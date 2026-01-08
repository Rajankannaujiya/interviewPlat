import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAppSelector } from "./state/hook";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GlobalChatWrapper from "./GlobalChatWrapper";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/user/auth/Login";
import SignUp from "./pages/user/auth/SignUp";
import About from "./about/About";
import Message from "./pages/message";
import Search from "./search/Search";
import Settings from "./settings/Settings";
import ProfileView from "./components/ProfileView";

import Interviewer from "./pages/Interviewer/Interviewer";
import InterviewerDashboard from "./pages/Interviewer/InterviewerDashboard";
import MyInterViews from "./pages/Interviewer/MyInterViews";
import InterViewConsole from "./pages/Interviewer/InterViewConsole";
import InterviewConstruct from "./pages/Interviewer/InterviewConstruct";
import UpdateInterview from "./components/UpdateInterview";

import ProtectedRoute from "./ProtectedRoutes";
import { PublicRoute } from "./ProtectedRoutes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen w-full bg-grid bg-light-background dark:bg-dark-background text-sm">
      <BrowserRouter>
        <Navbar />
        <Sidebar />

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/profile/:id"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/message"
            element={
              <ProtectedRoute>
                <Message />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <Message />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<About />} />

          <Route path="/interviewer" element={<Interviewer />}>
            <Route path="login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<InterviewerDashboard />} />
              <Route path="interviews" element={<MyInterViews />} />
              <Route path="schedule" element={<InterviewConstruct />} />
              <Route path="interview/update" element={<UpdateInterview />} />
              <Route path=":id" element={<InterViewConsole />} />
            </Route>
          </Route>
        </Routes>

        <GlobalChatWrapper />
      </BrowserRouter>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
