import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Notification } from "../../types/notification";
import { User } from "../../types/user";

export const genericApi = createApi({
  reducerPath: 'genericApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' , prepareHeaders:(header)=>{
    const user = localStorage.getItem('persist:auth');
    const parsedToken = JSON.parse(user!).token;

    console.log(parsedToken)

    if(parsedToken){
      header.set('authorization', `Bearer ${parsedToken}`)
    }
    return header;
    }}),
    endpoints: (build) => ({
    
    getAllUsersSearch: build.query<any, { query: string; userId: string }>({
      query:({query, userId})=>({
        url: `/users/search?query=${query}&userId=${userId}`,
        method: 'GET'
      })
    }),

    getMyNotifications: build.query<Notification[], {candidateId:string}>({
      query:({candidateId})=>({
        url:`/notification/${candidateId}`,
        method: 'GET',
      })
    }),

    getChattedUsersWithLastMessage: build.query<User[], {userId:string}>({
        query:({userId})=>({
          url:`/users/chatsWith/${userId}`
        })
    }),

    getAllUsers: build.query<User[],void>({
      query:()=>({
        url:`/users/allUsers`
      })
    }),
    getUserById: build.query<User, {userId:string}>({
      query:({userId})=>({
        url:`/users/${userId}`
      })
    })

    })
})

export const { useGetAllUsersSearchQuery, useGetMyNotificationsQuery, useGetChattedUsersWithLastMessageQuery, useGetAllUsersQuery , useGetUserByIdQuery} = genericApi;