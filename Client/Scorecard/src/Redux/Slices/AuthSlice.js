import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user : null,
    error : null,
    loading : false,
    accessToken: null,
    isLoggedIn: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        loginStart: (state)=>{
            state.error = null;
            state.loading = true;
        },
        loginSuccess: (state, action)=>{
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isLoggedIn = true;
            state.error=null;
            state.loading=false;
        },
        loginFailure: (state, action) => {
            state.error=action.payload;
            state.loading=false;
        },
        logout: (state) => {
            state.user=null;
            state.error=null;
            state.loading=false;
            state.accessToken= null;
            state.isLoggedIn= false;
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        }
    }
})

export const { loginStart, loginFailure, loginSuccess, logout, updateAccessToken } = userSlice.actions;
export default userSlice.reducer;