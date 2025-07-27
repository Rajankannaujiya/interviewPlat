import { combineReducers, configureStore } from '@reduxjs/toolkit';
import darkModeReducer from "./slices/themeSlice";
import genericReducer from "./slices/genericSlice";
import authReducer from "./slices/auth/authSlice"
import verifyReducer from "./slices/auth/verifyOtpSlice"
import chatReducer from "./slices/chatSlice"
import {authApi} from "./api/auth"
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage' // defaults to localStorage for web
import { interviewApi } from './api/interview';
import { genericApi } from './api/generic';



const memoryStorage: Record<string, string | null> = {};

const customStore = ()=>{
  return({
    getItem(key: string){
      return Promise.resolve(memoryStorage[key] ?? null);
    },
    setItem(key: string, value: string){
      memoryStorage[key] = value;
      return Promise.resolve();
    },
    removeItem(key:string){
      delete memoryStorage[key];
      return Promise.resolve();
    }
  })
}

const storage = typeof window === "undefined" ? customStore() : createWebStorage("local");

const darkModePersist = {
  key: "darkMode",
  storage,
}

const genericPerist = {
  key: "generic",
  storage
}

const chatPersit = {
  key: "chat",
  storage
}
const authPersit = {
  key: "auth",
  storage
}


const rootReducer = combineReducers({
  otpVerify: verifyReducer,
  generic: persistReducer(genericPerist, genericReducer),
  darkMode:persistReducer(darkModePersist, darkModeReducer),
  chat:persistReducer(chatPersit, chatReducer),
  auth: persistReducer(authPersit, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  [interviewApi.reducerPath]: interviewApi.reducer,
  [genericApi.reducerPath]: genericApi.reducer
})


export const store = configureStore({
  reducer: rootReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:{
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    }).concat(authApi.middleware).concat(interviewApi.middleware).concat(genericApi.middleware),

})

export const persistor = persistStore(store);
setupListeners(store.dispatch);
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store