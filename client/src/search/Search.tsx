import { useEffect, useState } from 'react';
import { CustomCenter } from '../components/CustomComp';
import { SearchIcon } from 'lucide-react';
import { useGetAllUsersSearchQuery } from '../state/api/generic';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { useAppSelector } from '../state/hook';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/user';



const Search = () => {
  const user = useAppSelector(state => state.auth.user);
  const [searchString, setSearchString] = useState("");
  const [debouncedSearch] = useDebounce(searchString, 500);

  const shouldFetch = debouncedSearch.trim().length >= 3;

  const { data, isLoading, isError } = useGetAllUsersSearchQuery(
    { query: debouncedSearch, userId: user?.id ?? "" },
    { skip: !shouldFetch || !user?.id }
  );

  const searchData = data?.results || [];

  useEffect(() => {
    if (isError) {
      toast.error("An error occurred while searching");
    }
  }, [isError]);

  // ✅ Cleanup search input on unmount
  useEffect(() => {
    return () => setSearchString(""); // Clear input when component unmounts
  }, []);


  return (
    <CustomCenter className='h-[calc(100vh-12px)] block md:flex p-4 dark:text-gray-50 text-gray-900 dark:bg-dark-background bg-light-background'>
      <div className='w-full max-w-3xl'>
        <div className='flex items-center gap-2 p-2 border rounded-lg bg-white dark:bg-gray-800 shadow-md'>
          <SearchIcon className="text-gray-500" />
          <input
            type='search'
            placeholder='Search messages, users, comments...'
            className='w-full outline-none bg-transparent'
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>

        <div className='mt-4'>
          <SearchComp searchData={searchData} shouldFetch={shouldFetch} isLoading={isLoading} searchString={searchString} user={user} />
        </div>
      </div>
    </CustomCenter>
  )
}

export default Search;

type SearchCompProps ={
  isLoading:boolean; 
  searchData: any;
  searchString: string;
  shouldFetch:boolean;
  user:User | null
}

export const SearchComp = ({isLoading, searchData, searchString, shouldFetch, user}:SearchCompProps)=>{
  const navigate = useNavigate();

   const handleClick = (item: any) => {
    if (item.type === "user") {
      navigate(`/user/profile/${item.data.id}`);
    } else if (item.type === "message") {
      const otherUser = item.data.sender.id === user?.id ? item.data.recipient : item.data.sender;
      navigate(`/chat/${otherUser.id}?highlight=${item.data.id}`);
    } else if (item.type === "comment") {
      navigate(`/interview/${item.data.interviewId}?highlightComment=${item.data.id}`);
    }
  }
  return (
          (isLoading ? (
            <Loading />
          ) : (
            <div className='space-y-3'>
              {/* ✅ Initially show "User" if search is empty */}
              {!searchString.trim() && (
                <p className='text-center text-gray-400 text-sm'>Search for Users, Messages, or Comments</p>
              )}

              {searchData.length === 0 && shouldFetch && (
                <p className='text-center text-gray-500'>No results found.</p>
              )}

              {searchData.map((item: any) => (
                <div
                  key={item.data.id}
                  onClick={() => handleClick(item)}
                  className='cursor-pointer p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700'
                >
                  {item.type === "user" && (
                    <div>
                      <p className='font-semibold'>{item.data.username}</p>
                      <p className='text-sm text-gray-500'>User</p>
                    </div>
                  )}
                  {item.type === "message" && (
                    <div>
                      <p className='font-medium truncate'>{item.data.content}</p>
                      <p className='text-sm text-gray-500'>Message between {item.data.sender.username} & {item.data.recipient.username}</p>
                    </div>
                  )}
                  {item.type === "comment" && (
                    <div>
                      <p className='font-medium truncate'>{item.data.content}</p>
                      <p className='text-sm text-gray-500'>Comment by {item.data.author.username}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))

  )
}
