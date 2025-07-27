import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";

interface ChatType{
    selectedUser: User | null
}

const initialState:ChatType={
    selectedUser:null
};


const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers: {
        setSelectedUser: (state, action)=>{
            state.selectedUser = action.payload
        }
    }
})

export const { setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
