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
        updateInfo: (state, action) => {
            if(action.payload) {
                const jwt = state.user.jwt
                state.user = {...action.payload, jwt: jwt}
            }
        },
        successful: (state, action) => {
            state.pendingState = false
            if(action.payload) {
                if(action.payload?.isAdmin)
                    state.admin = {...action.payload, jwt: 'bearer ' + action.payload.jwt}
                else
                    state.user = {...action.payload, jwt: 'bearer ' + action.payload.jwt}
            }
        },
        logout: (state) => {
            return initialState
        }
    }
})

export const { start, successful, logout, updateInfo } = authSlice.actions
export default authSlice.reducer