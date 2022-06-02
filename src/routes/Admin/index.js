import { memo, useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { logoutService, getAdminInfoService } from '../../services/authServices'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './adminRoute.module.css'
import SideBar from '../../components/Admin/SideBar'

// image assets
import bellIcon from '../../assets/admin/bell.png'
import mailIcon from '../../assets/admin/mail.png'
import dropdownIcon from '../../assets/admin/dropdown.png'
import logoutIcon from '../../assets/admin/logout.png'
import placeholderImage from '../../assets/shared/placeholder/placeholder.png'

function AdminRoute() {
    const tab = [
        {
            slug: '',
            name: 'Orders',
            subTitle: ''
        },
        {
            slug: 'products',
            name: 'Products',
            subTitle: ''
        },
        {
            slug: 'add_product',
            name: 'Products',
            path: 'Products / Add product'
        },
        {
            slug: 'edit_product',
            name: 'Products',
            path: 'Products / Edit product'
        },
    ]
    const dispatch = useDispatch()
    const nav = useNavigate()
    const adminInfo = getAdminInfoService()
    const [currentTab, setCurrentTab] = useState(tab[0])
    const [showSettingBox, setShowSettingBox] = useState(false)
    const location = useLocation()

    const handleLogOut = async () => {
        await logoutService(dispatch, adminInfo.jwt)
        nav('../admin/login')
    }

    useEffect(() =>{
        const pathName = location.pathname.split('/')
        const tabIndex = tab.findIndex(t => {
            if(pathName[3])
                return t.slug === pathName[3]
            else if(pathName[2])
                return t.slug === pathName[2]
            else
                return t.slug === ''
        })
        setCurrentTab(tab[tabIndex])
    },[location])

    if(adminInfo !== null) {
        return (
            <div className={styles.adminRouteContainer}>
                <SideBar />
                <div className={styles.pageContainer}>

                    {/* header container */}
                    <div className={styles.HeaderContainer}>

                        {/* left container */}
                        <div className={styles.leftContainer}>
                            <span className={styles.pageTitle}>{currentTab?.name}</span>
                            <span className={styles.pathTitle}>{currentTab?.path}</span>
                        </div>

                        {/* right container */}
                        <div className={styles.rightContainer} >
                            
                            {/* settingBox */}
                            <div 
                                className={styles.settingContainer} 
                                onClick={() => setShowSettingBox(!showSettingBox)}
                            >
                                <img className={styles.avatar} src={adminInfo?.avatar ? adminInfo.avatar:placeholderImage} alt=" " />
                                <span className={styles.userName} >{adminInfo.userName}</span>
                                <img className={styles.smallIcon} src={dropdownIcon} alt=" " />
                                {
                                    showSettingBox &&
                                    <div 
                                        className={styles.settingBox} 
                                        onClick={() => handleLogOut()}
                                    >
                                        <img className={styles.logoutIcon} src={logoutIcon} alt="" />
                                        <span className={styles.logoutTitle} >log out</span>
                                    </div>
                                }
                            </div>

                            {/* mail icon */}
                            <div className={styles.iconPadding} >
                                <div className={styles.notifyBox} >9+</div>
                                <img className={styles.smallIcon} src={mailIcon} alt=" " />
                            </div>

                            {/* bell icon */}
                            <div className={styles.iconPadding}>
                                <div className={styles.notifyBox} >9+</div>
                                <img className={styles.smallIcon} src={bellIcon} alt=" " />
                            </div>

                        </div>

                    </div>

                    {/* content */}
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