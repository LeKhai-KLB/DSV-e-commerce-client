import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    admin: null,
    pendingState: false,
    errorMessage: ''
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        ...initialState
    },
    reducers: {
        loginStart: (state) => {
            if(state.errorMessage !== ''){
                state.errorMessage = ''
            }
            state.pendingState = true
        },
        loginSuccessful: (state, action) => {
            state.pendingState = false
            state.admin = {...action.payload, jwt: 'bearer ' + action.payload.jwt}
        },
        loginFailure: (state, action) => {
            state.pendingState = false
            state.errorMessage = action.payload
        },
        logOut: (state) => {
            return initialState
        }
    }
})

export const { loginStart, loginSuccessful, loginFailure, logOut } = authSlice.actions
export default authSlice.reducer