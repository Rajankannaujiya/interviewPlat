import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface VerifyOtp{
    isotpSent: boolean;
    isVerified:boolean;
    mobileNumber: string;
    email: string;
    otpEntered:string;
}


const initialState: VerifyOtp ={
    isotpSent:false,
    isVerified:false,
    mobileNumber: "",
    email: "",
    otpEntered:"",

}
 
const verifyOtpSlice = createSlice({
    name:"verifyOtp",
    initialState,
    reducers: {

        setIsOtpSent: (state, action:PayloadAction<boolean>)=>{
            state.isotpSent = action.payload;
        },

        setIsVerrified: (state, action:PayloadAction<boolean>)=>{
            state.isVerified = action.payload;
        },

        setMobileNumber: (state, action:PayloadAction<string>)=>{
            state.mobileNumber = action.payload;
        },

        setEmail: (state, action:PayloadAction<string>)=>{
            state.email = action.payload
        },

        setOtpEntered: (state, action:PayloadAction<string>) =>{
            state.otpEntered = action.payload
        }
        
    }
})

export const {setIsOtpSent, setMobileNumber, setEmail, setOtpEntered,setIsVerrified}  = verifyOtpSlice.actions;

export default verifyOtpSlice.reducer;
