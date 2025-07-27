import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface DarkMode{
    isDarkMode: boolean
}


const initialState: DarkMode ={
    isDarkMode: false
}
 
const darkModeSlice = createSlice({
    name:"DarkMode",
    initialState,
    reducers: {
        toggleDarkMode: (state)=>{
            state.isDarkMode = ! state.isDarkMode;
        },
        setIsDarkMode: (state, action: PayloadAction<boolean>)=>{
            state.isDarkMode = action.payload;
        }
    }
})

export const {toggleDarkMode,setIsDarkMode}  = darkModeSlice.actions;

export default darkModeSlice.reducer;

