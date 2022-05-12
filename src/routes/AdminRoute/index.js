import { memo } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { logOutService, getAdminInfoService } from '../../services/authServices'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AdminRoute() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const adminInfo = getAdminInfoService()

    const handleLogOut = () => {
        logOutService(dispatch)
        nav('../admin/login')
    }

    if(adminInfo) {
        return (
            <>
                <button onClick={handleLogOut} >Log out</button>
                <Outlet />
            </>
        )
    }
    else{
        return <Navigate to="../admin/login" />  
    }
}

export default memo(AdminRoute)