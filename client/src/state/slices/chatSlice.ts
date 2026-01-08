import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";

interface ChatType{
    selectedUser: User | null,
    selectedInterviewId: string | null
}

const initialState:ChatType={
    selectedUser:null,
    selectedInterviewId: null
};


const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers: {
        setSelectedUser: (state, action)=>{
            state.selectedUser = action.payload
        },

        setSelectedInterviewId:(state, action)=>{
            state.selectedInterviewId = action.payload
        }
    }
})

export const { setSelectedUser, setSelectedInterviewId } = chatSlice.actions;
export default chatSlice.reducer;
