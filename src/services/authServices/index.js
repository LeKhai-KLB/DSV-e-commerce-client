import { loginStart, loginSuccessful, loginFailure, logOut } from '../../redux/slices/authSlice'
import axios from 'axios'

export const loginService = async (dispatch, info) => {
    dispatch(loginStart())
    try{
        const { data } = await axios.post('/api/user/login', {...info})
        if(data.status === 200) {
            dispatch(loginSuccessful(data.resultData))
        }
        else{
            throw new Error(data.errorMessage)
        }
    }
    catch (err){
        dispatch(loginFailure(err.message))
    }
}

export const logOutService = async (dispatch) => {
    dispatch(logOut())
}

export const getUserInfoService = () => {
    const authStore = JSON.parse(localStorage.getItem('persist:root'))?.auth
    return authStore && JSON.parse(authStore).user;
}

export const getAdminInfoService = () => {
    const authStore = JSON.parse(localStorage.getItem('persist:root'))?.auth
    return authStore && JSON.parse(authStore).admin;
}
