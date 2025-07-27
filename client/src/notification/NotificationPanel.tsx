
import { twMerge } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '../state/hook';
import { setIsNotificationPanel } from '../state/slices/genericSlice';
import { useGetMyNotificationsQuery } from '../state/api/generic';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import PopUp from '../components/Popup';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export default function NotificationPanel() {


  const isNotificationPannelOpen = useAppSelector(state => state.generic.isNotificationPanelOpen);
  const user = useAppSelector(state => state.auth.user)

  const { data:notifications, error, isLoading } = useGetMyNotificationsQuery({ candidateId: user?.id! })

  console.log("isnotificationPannelOpen from the notification", notifications)
  const dispatch = useAppDispatch();

  if (error) {
    return toast.error("An erro occured while getting notifications")
  }

  return (

    isNotificationPannelOpen && (
      isLoading? <Loading /> : (<PopUp>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={() => dispatch(setIsNotificationPanel(!isNotificationPannelOpen))} className=" text-lg text-blue-700 dark:text-blue-500 cursor-pointer px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            Close
          </button>
        </div>

        {!notifications || notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >              
            <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>            
            </div>
          ))
        )}
      </PopUp>)
    )

  );
}
