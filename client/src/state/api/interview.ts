import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { GetAllMyInterviewsResponse } from '../../types/interview';
import { User } from '../../types/user';

export const interviewApi = createApi({
  reducerPath: 'interview',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' , prepareHeaders:(header)=>{
    const user = localStorage.getItem('persist:auth');
    const parsedToken = JSON.parse(user!).token;

    if(parsedToken){
      header.set('authorization', `Bearer ${parsedToken}`)
    }
    return header;
    }}),
    endpoints: (build) => ({
    getAllMyInterviews: build.query<GetAllMyInterviewsResponse, {userId:string}>({
      query:({userId})=>({
        url: `/interview/${userId}`,
        method: "GET"
      })
    }),
    getAllCandidate: build.query<User[], void>({
      query:()=>({
        url: `/users/candidates`,
        method: 'GET'
      })
    }),

    getAllInterviewer: build.query<User[], void>({
      query:()=>({
        url: `/users/interviewers`,
        method: 'GET'
      })
    }),

    })
})

export const {useGetAllMyInterviewsQuery, useGetAllCandidateQuery, useGetAllInterviewerQuery} = interviewApi

