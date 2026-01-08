import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createInterviewProps, GetAllMyInterviewsResponse, rescheduleInterviewProps, TypeInterviewStatus } from '../../types/interview';
import { User } from '../../types/user';
import { Feedback } from '../../types/notification';

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

    submitFeedBack: build.mutation<any, {data:Feedback}>({
      query:({data})=>({
        url: `/feedback/${data.interviewId}`,
        method: 'PUT',
        body:data
      })
    }),

    getInterviewFeebBack: build.query<Feedback, {interviewId: string}>({
      query:({interviewId})=>({
        url: `/feedback/${interviewId}`,
        method: 'GET'
      })
    }),

    addComment: build.mutation<any, { interviewId: string; authorId: string; content: string }>({
      query: ({ interviewId, authorId, content }) => ({
        url: `/comment/`,
        method: "POST",
        body: { interviewId, authorId, content }
      })
    }),

    updateComment: build.mutation< void, {commentId:string, content:string}>({
      query: ({ commentId, content }) => ({
        url: `/comment/update`,
        method: "PUT",
        body: {commentId, content },
      })
    }),

    deleteComment: build.mutation< void, {commentId:string}>({
      query: ({ commentId }) => ({
        url: `/comment/${commentId}`,
        method: "DELETE",
      })
    }),

    updateInterviewStatus: build.mutation<void, {interviewId:string | null, status:TypeInterviewStatus, updateAll: boolean}>({
      query: ({ interviewId, status, updateAll }) => ({
        url: updateAll
          ? `/interview/update-all`
          : `/interview/update/${interviewId}`,
        method: "PATCH",
        body: { status, updateAll },
      }),
    }),

    createInterview: build.mutation<void,{data: createInterviewProps}>({
      query: ({data}) => ({
        url: "/interview/create",
        method: "POST",
        body: data,
      }),
    }),

    rescheduleInterview: build.mutation<any, {data: rescheduleInterviewProps}>({
      query: ({ data }) => ({
      url: `/interview/reschedule`,
      method: "PUT",
      body: data,
      }),
    }),
    })
})

export const {useGetAllMyInterviewsQuery, useGetAllCandidateQuery, useGetAllInterviewerQuery, useSubmitFeedBackMutation, useGetInterviewFeebBackQuery, useAddCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation, useUpdateInterviewStatusMutation, useCreateInterviewMutation, useRescheduleInterviewMutation} = interviewApi

