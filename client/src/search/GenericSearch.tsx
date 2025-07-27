import { useDebounce } from 'use-debounce';
import Popup from '../components/Popup';
import { useGetAllUsersSearchQuery } from '../state/api/generic';
import { useAppDispatch, useAppSelector } from '../state/hook';
import { SearchComp } from './Search';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { setIsSearchOpen } from '../state/slices/genericSlice';

const GenericSearch = () => {
  const user = useAppSelector(state => state.auth.user);
  const isSearchOpen = useAppSelector(state => state.generic.isSearchOpen);
  const dispatch = useAppDispatch();

  const [searchString, setSearchString] = useState('');
  const [debouncedSearch] = useDebounce(searchString, 500);
  const [userClosedPopup, setUserClosedPopup] = useState(false); // 🟡 new state

  const shouldFetch = debouncedSearch.trim().length >= 3;

  const { data, isLoading, isError } = useGetAllUsersSearchQuery(
    { query: debouncedSearch, userId: user?.id ?? '' },
    { skip: !shouldFetch || !user?.id }
  );

  const searchData = data?.results || [];

  // 🛠️ Open popup when user types new search and hasn't closed it manually
  useEffect(() => {
    if (shouldFetch && !isSearchOpen && !userClosedPopup) {
      dispatch(setIsSearchOpen(true));
    }
  }, [shouldFetch, isSearchOpen, userClosedPopup, dispatch]);

  // 🟢 Reset "userClosedPopup" flag if query changes
  useEffect(() => {
    setUserClosedPopup(false);
  }, [debouncedSearch]);

  const handleClose = () => {
    setUserClosedPopup(true);
    dispatch(setIsSearchOpen(false));
  };

  return (
    <div>
      <Search className='absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white' />
      <input
        className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-bahia-50"
        type="search"
        placeholder="Search..."
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />

      {isSearchOpen && (
        <Popup>
          <div className='m-1 p-1'>
            <div className="flex justify-end m-2">
              <button
                className='text-blue-700 text-lg px-6 py-2 hover:bg-gray-100 rounded dark:text-blue-500 dark:hover:bg-gray-700'
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <SearchComp
              searchData={searchData}
              searchString={searchString}
              isLoading={isLoading}
              user={user}
              shouldFetch={shouldFetch}
            />
          </div>
        </Popup>
      )}
    </div>
  );
};

export default GenericSearch;
