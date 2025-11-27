import { useState } from "react";
import {
  Home,
  Search,
  Settings,
  SidebarCloseIcon,
  BookText,
  LucideIcon,
  UserCheck,
  LogOut,
  LogIn,
  MessageSquareText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../state/hook";
import { setSideBarOpen } from "../../state/slices/genericSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../../state/slices/auth/authSlice";
import { toast } from "react-toastify";

type Props = {};

const Sidebar = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isSideBarOpen = useAppSelector(
    (state) => state.generic.isSideBarOpen
  );

  const checkAuth = useAppSelector(state => state.auth);
  const [isInterviewerOpen, setIsInterviewerOpen] = useState(false); // Track submenu open

  function handleLogout() {
    // Remove all keys starting with "persist:"
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("persist:")) {
        localStorage.removeItem(key);
      }
    });

    setLogout();
    toast.success("Logout successful");
    navigate("/login");
  }

  return (
    <div
      className={`absolute z-40 top-0 left-0 w-[200px] min-h-screen bg-light-navbar-background dark:bg-dark-navbar-background border-r border-bahia-400 shadow-md transform transition-transform duration-300 ease-in-out ${
        isSideBarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {isSideBarOpen && (
        <div className="border-b border-bahia-500 dark:border-bahia-600">
          <div className="flex items-center justify-between h-11 px-3 bg-bahia-500 dark:bg-bahia-600">
            <div className="text-md font-bold text-gray-800 dark:text-white tracking-wider">
              InterviewPlat
            </div>
            <button
              className="cursor-pointer bg-light-navbar-background dark:bg-gray-800 py-1 px-4 m-0 rounded-sm"
              onClick={() => dispatch(setSideBarOpen(!isSideBarOpen))}
            >
              <SidebarCloseIcon className="w-6 h-6 dark:text-white" />
            </button>
          </div>
        </div>
      )}

      <nav className="z-10 w-full">
        <SidebarLink href="/" icon={Home} label="Home" />
        <SidebarLink href="/about" icon={BookText} label="About" />
        <SidebarLink href="/search" icon={Search} label="Search" />

        {/* Interviewer with submenu */}
        <div
          onClick={() => setIsInterviewerOpen(!isInterviewerOpen)}
          className="flex items-center cursor-pointer gap-3 px-8 py-3 border-b border-bahia-500 hover:bg-gray-100 dark:hover:bg-gray-700 justify-start relative"
        >
          <UserCheck className="h-6 w-6 text-gray-800 dark:text-gray-100" />
          <span className="font-medium text-gray-800 dark:text-gray-100">
            Interviewer
          </span>
          <span className="ml-auto">{isInterviewerOpen ? "▲" : "▼"}</span>
        </div>

        {/* Submenu options */}
        {isInterviewerOpen && (
          <div className="flex flex-col ml-8 border-l border-gray-300 dark:border-gray-600">
            {!checkAuth.isAuthenticated || !checkAuth.user?.role?.includes("INTERVIEWER") ? (<SidebarLink href="/interviewer/login" icon={LogIn} label="Login" />) :
            (
                <> <SidebarLink href="/interviewer/dashboard" icon={Home} label="Dashboard" />
                <SidebarLink href="/interviewer/interviews" icon={BookText} label="My Interviews" />
                <SidebarLink href="/interviewer/profile" icon={Settings} label="Profile" />
                </>
  
            )}
          </div>
        )}

        <SidebarLink href="/message" icon={MessageSquareText} label="Message" />
        <SidebarLink href="/settings" icon={Settings} label="Settings" />
      </nav>

      <div className="flex items-center space-x-2 fixed w-full p-0 bottom-0 cursor-pointer border border-bahia-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-100 text-gray-800 dark:text-white dark:bg-gray-900 px-8 py-2">
        <LogOut />
        <button onClick={handleLogout} className="text-lg font-serif cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = useLocation().pathname;
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link to={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 border-b border-bahia-500 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-bahia-500 dark:bg-bahia-400" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
