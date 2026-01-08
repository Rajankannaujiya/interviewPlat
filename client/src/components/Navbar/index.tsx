
import { Bell, Menu, MessageSquareText, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../state/hook';
import { toggleDarkMode } from '../../state/slices/themeSlice';
import { setIsNotificationPanel, setSideBarOpen } from '../../state/slices/genericSlice';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from '../../notification/NotificationPanel';
import GenericSearch from '../../search/GenericSearch';


const Navbar = () => {

    const navigate = useNavigate();

    const userState = useAppSelector(state => state.auth);

    const isDarkMode = useAppSelector(state => state.darkMode.isDarkMode);

    const isSideBarOpen = useAppSelector(state => state.generic.isSideBarOpen);
    const isNotificationPanelOpen = useAppSelector(state => state.generic.isNotificationPanelOpen);

    const dispatch = useAppDispatch();


    return (
        <div className={`flex justify-between items-center w-screen p-1 shadow-sm border-b gap-8 border-bahia-300 bg-light-navbar-background dark:bg-dark-navbar-background dark:border-bahia-700 dark:border-b dark:shadow-sm`}>
            <div className='flex'>
                {!isSideBarOpen && <button className='p-0.5 px-2' onClick={() => dispatch(setSideBarOpen(!isSideBarOpen))}>
                    <Menu className='h-8 w-8 dark:text-white' />
                </button>}
            </div>
            <div className={`flex justify-center items-center`}>

                {!userState.isAuthenticated && (<div className='flex items-center mx-4 p-1 px-3 bg-bahia-400 rounded-md hover:bg-bahia-500 cursor-pointer dark:bg-bahia-600'>
                    <button className='cursor-pointer p-1 px-2 dark:text-white tracking-widest' onClick={() => navigate("/signup")}>Signup</button>
                </div>)}
                {!userState.isAuthenticated && (<div className='flex items-center mx-4 p-1 px-3 bg-bahia-400 rounded-md hover:bg-bahia-500 cursor-pointer dark:bg-bahia-600'>
                    <button className='cursor-pointer p-1 px-2 dark:text-white tracking-widest' onClick={() => navigate("/login")}>login</button>
                </div>)}
                {userState.isAuthenticated && <div className='md:flex hidden mx-2 px-3 py-0.5 mt-0 dark:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 rounded'>
                    <button className='cursor-pointer rounded p-1' onClick={() => navigate("/message")}>
                        <MessageSquareText className='w-6 h-6 dark:text-white' />
                    </button>
                </div>}

                {userState.isAuthenticated && <div className="relative mx-2 px-3 py-0.5 mt-0 hover:bg-gray-200 dark:hover:bg-gray-500 rounded">
                    <button
                        className="cursor-pointer rounded p-1"
                        onClick={() => dispatch(setIsNotificationPanel(!isNotificationPanelOpen))}
                        aria-label="Toggle notifications"
                    >
                        <Bell className="w-6 h-6 dark:text-white text-gray-800" />
                        <span className="absolute top-0 left-5 bg-red-400 border-2 w-5 h-5 border-white dark:border-gray-800 text-xs text-center text-white font-semibold rounded-full">
                            1
                        </span>
                    </button>

                    {/* Mount NotificationPanel outside normal flow */}
                    {isNotificationPanelOpen && (
                        <div className="md:block absolute right-0 top-full z-50">
                            <NotificationPanel />
                        </div>
                    )}
                </div>}


                {userState.isAuthenticated && <div className='relative sm:flex h-min hidden'>
                    <GenericSearch />
                </div>
}
                <div className='flex items-center sm:mx-2 sm:px-3  px-1 py-0.5'>
                    <button className={`rounded px-3 py-1.5 mx-4 cursor-pointer ${isDarkMode ? "hover:bg-gray-500 hover:text-white" : "hover:bg-gray-200"}`}
                        onClick={() => dispatch(toggleDarkMode())}>
                        {isDarkMode ? <Sun className='h-6 w-6 text-white' /> : <Moon className='h-6 w-6' />}
                    </button>
                </div>

                {userState.isAuthenticated && <div className='hidden sm:flex' onClick={()=>{navigate(`/user/profile/${userState.user?.id}`)}}>
                    {userState.user && userState.user.profileUrl ? <ProfileAvatar isnavbar={true} className='rounded-full' imgUrl={ userState.user?.profileUrl } />
                        :
                        <NormalAvatar isnavbar={true} className='' />
                    }
                </div>}

            </div>
        </div>
    )
}

export default Navbar


type ProfileAvatarProps = {
    imgUrl: string;
    isnavbar: boolean;
    className: string
}

export const ProfileAvatar = ({ imgUrl, isnavbar, className }: ProfileAvatarProps) => {
    return (
        <div className="relative mx-2 p-0.5 px-2 cursor-pointer mr-4">
            <button className='cursor-pointer rounded-full border-2 border-bahia-600'>
                <img className={isnavbar ? "w-6 h-6 rounded-full" : className} src={imgUrl} alt="" />
                {/* Status dot */}
                <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </button>
        </div>
    )
}


type NormalAvatarProps = {
    isnavbar: boolean;
    className: string;
};
export const NormalAvatar = ({ isnavbar, className }: NormalAvatarProps) => {

    return (
        <div className={`relative ${isnavbar ? "w-10 h-10" : className} mr-4 bg-gray-100 rounded-full dark:bg-gray-600 mx-2 p-0.5 px-2 cursor-pointer border-2 border-bahia-800`}>
            {/* Status dot */}
            <span className={`absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full z-10`}></span>

            {/* SVG Avatar Icon */}
            <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                <svg className={`{isnavbar ? 'w-6 h-6' : ''} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
};