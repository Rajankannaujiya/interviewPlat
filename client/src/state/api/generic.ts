import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Notification } from "../../types/notification";
import { ExistingChat, Message, User } from "../../types/user";

export const genericApi = createApi({
  reducerPath: 'genericApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' , prepareHeaders:(header)=>{
    const user = localStorage.getItem('persist:auth');
    const parsedToken = JSON.parse(user!).token;


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

    getChattedUsersWithLastMessage: build.query<any, {userId:string}>({
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
    }),

    createChat: build.mutation<ExistingChat, {senderId:string, receiverId:string}>({
      query:(body)=>({
        url:`/messages/createChat`,
        method: 'POST',
        body,
      })
    }),

    findChatByChatId:build.query<Message[], {chatId:string}>({
      query: ({chatId})=>({
        url:`/messages/findChat/${chatId}`,
        method: 'GET'
      })
    }),

    geminiAiResponse: build.mutation<string, {contents:string}>({
      query:({contents})=>({
        url:`/messages/geminiAiResponse`,
        method: 'POST',
        body:{contents}
      })
    })

    })
})

export const { useGetAllUsersSearchQuery, useGetMyNotificationsQuery, useGetChattedUsersWithLastMessageQuery, useGetAllUsersQuery , useGetUserByIdQuery, useCreateChatMutation, useFindChatByChatIdQuery, useGeminiAiResponseMutation} = genericApi;