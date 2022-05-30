import { memo } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { logoutService, getAdminInfoService } from '../../services/authServices'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './adminRoute.module.css'
import SideBar from '../../components/Admin/SideBar'

function AdminRoute() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const adminInfo = getAdminInfoService()

    const handleLogOut = () => {
        logoutService(dispatch)
        nav('../admin/login')
    }

    if(adminInfo !== null) {
        return (
            <div className={styles.adminRouteContainer}>
                <SideBar />
                <div className={styles.pageContainer}>
                    <div className={styles.HeaderContainer}></div>
                    <Outlet />
                </div>
            </div>
        )
    }
    else{
        return <Navigate to="../admin/login" />  
    }
}

export default memo(AdminRoute)