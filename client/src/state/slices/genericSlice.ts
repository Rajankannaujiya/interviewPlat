import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface GenericType{
    isSideBarOpen: boolean,
    isNotificationPanelOpen: boolean,
    isSearchOpen:boolean
}


const initialState: GenericType ={
    isSideBarOpen: false,
    isNotificationPanelOpen:false,
    isSearchOpen:false
}
 
const GenericSlice = createSlice({
    name:"Generic",
    initialState,
    reducers: {
        setSideBarOpen: (state, action: PayloadAction<boolean>)=>{
            state.isSideBarOpen = action.payload;
        },
        setIsNotificationPanel: (state, action: PayloadAction<boolean>)=>{
            state.isNotificationPanelOpen = action.payload
        },
        setIsSearchOpen: (state, action: PayloadAction<boolean>)=>{
            state.isSearchOpen = action.payload
        }
    }
})

export const {setSideBarOpen, setIsNotificationPanel, setIsSearchOpen}  = GenericSlice.actions;

export default GenericSlice.reducer;
