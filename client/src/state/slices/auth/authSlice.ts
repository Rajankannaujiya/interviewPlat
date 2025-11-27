import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types/user';


interface AuthState{
    user:User | null;
    isAuthenticated: boolean;
    token:string;
}


const initialState: AuthState ={
    user:null,
    isAuthenticated:false,
    token:"",
}
 
const authSlice = createSlice({
    name:"authentication",
    initialState,
    reducers: {
        
        setAuthenticatedState: (state, action: PayloadAction<AuthState | null>)=>{
           if(action.payload){
             state.user = action.payload?.user as any;
            state.isAuthenticated=action.payload?.isAuthenticated
            state.token = action.payload?.token
           }
        },

        setLogout: (state)=>{
            state.user = null;
            state.token = "";
            state.isAuthenticated= false
        }
    }
})

export const {setAuthenticatedState,setLogout}  = authSlice.actions;

export default authSlice.reducer;

