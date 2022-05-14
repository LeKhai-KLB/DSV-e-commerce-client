import { start, successful, logout } from '../../redux/slices/authSlice'
import axios from 'axios'

// API 
import { loginAPI, registerAPI } from '../../APIs'

export const loginService = async (dispatch, info) => {
    await dispatch(start())
    try{
        const { data } = await axios.post(loginAPI, {...info})
        if(data.status === 200) {
            dispatch(successful(data.resultData))
            return {}
        }
        else{
            throw new Error(data.errorMessage)
        }
    }
    catch (err){
        // console.log(err.message)
        return {errorMessage: err.message}
    }
}

export const registerService = async (dispatch, info) => {
    await dispatch(start())
    try{
        const { data } = await axios.post(registerAPI, {...info})
        if(data.status === 200) {
            dispatch(successful(data.resultData))
            return {}
        }
        else{
            throw new Error(data.errorMessage)
        }
    }
    catch (err){
        // console.log(err.message)
        return {errorMessage: err.message}
    }
}

export const logoutService = async (dispatch) => {
    dispatch(logout())
}

export const getUserInfoService = () => {
    const authStore = JSON.parse(localStorage.getItem('persist:root'))?.auth
    return authStore && JSON.parse(authStore).user;
}

export const getAdminInfoService = () => {
    const authStore = JSON.parse(localStorage.getItem('persist:root'))?.auth
    return authStore && JSON.parse(authStore).admin;
}
