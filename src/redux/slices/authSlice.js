import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    admin: null,
    pendingState: false
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        ...initialState
    },
    reducers: {
        start: (state) => {
            state.pendingState = true
        },
        successful: (state, action) => {
            state.pendingState = false
            if(action.payload?.isAdmin)
                state.admin = {...action.payload, jwt: 'bearer ' + action.payload.jwt}
            else
                state.user = {...action.payload, jwt: 'bearer ' + action.payload.jwt}
        },
        logout: (state) => {
            return initialState
        }
    }
})

export const { start, successful, logout } = authSlice.actions
export default authSlice.reducer