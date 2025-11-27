
import React, { useEffect } from 'react'
import Navbar from "./components/Navbar"
import { useAppSelector } from './state/hook';
import { Provider } from 'react-redux';
import { store } from './state/store';

const DashboarLayout = ({children}:{children:React.ReactNode}) => {
  const isDarkMode = useAppSelector((state)=>state.darkMode.isDarkMode);

  useEffect(()=>{
    if(isDarkMode){
      document.documentElement.classList.add("dark");
    }
    else{
      document.documentElement.classList.remove("dark");
    }
  },[isDarkMode])

  return (
    <div className='flex min-h-screen w-full bg-gray-50 text-gray-900'>

        {/* sidebar */}
        {/* <Sidebar /> */}
        <main className={`flex w-full flex-co`}>

            <Navbar/>
            {children}  
        </main>
    </div>
  )
};


const DashboardWrapper = ({children}:{children:React.ReactNode}) => {
  return (
    <Provider store={store}>
      <DashboarLayout>
        {children}
      </DashboarLayout>
    </Provider>
  )
}
export default DashboardWrapper