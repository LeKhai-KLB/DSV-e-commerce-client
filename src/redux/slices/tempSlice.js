import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'temp',
    initialState: '',
    reducers: {
        set_temp: (state, action) => {
            state = action.payload
        }
    }
})