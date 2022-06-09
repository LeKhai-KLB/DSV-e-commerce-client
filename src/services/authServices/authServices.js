import { start, successful, logout } from '../../redux/slices/authSlice'
import axios from 'axios'

export const loginService = async (dispatch, info) => {
    await dispatch(start())
    try{
        const { data } = await axios.post(process.env.REACT_APP_LOGIN_API, {...info})
        if(data.status === 200) {
            dispatch(successful(data.resultData))
            return data.resultData
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
        const { data } = await axios.post(process.env.REACT_APP_REGISTER_API, {...info})
        if(data.status === 200) {
            dispatch(successful(null))
            return {}
        }
        else{
            throw new Error(data.errorMessage)
        }
    }
    catch (err){
        console.log(err.message)
    }
}

export const logoutService = async (dispatch, jwt) => {
    try {
        await axios.post(process.env.REACT_APP_LOGOUT_API, {}, {
            headers: {
                authorization: jwt
            }
        })
        dispatch(logout())
    }
    catch(err) {
        console.log(err.message)
    }
}

export const clearAuthInfoService = (dispatch) => {
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
