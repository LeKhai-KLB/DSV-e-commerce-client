import { memo, useState, useEffect } from 'react'
import styles from './SideBar.module.css'
import { useNavigate, useLocation } from 'react-router-dom'

// image assets
import logo from '../../../assets/custommer/logo@2x.png'
import overviewIcon from '../../../assets/admin/overview.png'
import ordersIcon from '../../../assets/admin/orders.png'
import productsIcon from '../../../assets/admin/products.png'
import paymentIcon from '../../../assets/admin/payment.png'
import promotionIcon from '../../../assets/admin/promotion.png'
import settingIcon from '../../../assets/admin/setting.png'

import orangeOrdersIcon from '../../../assets/admin/orders-orange.png'
import orangeProductsIcon from '../../../assets/admin/products-orange.png'

function SideBar() {
    const navigationList = [
        {
            icon: overviewIcon,
            title: 'Overview',
            url: '',
            orangeIcon: ''
        }, 
        {
            slug: '',
            icon: ordersIcon,
            title: 'Orders',
            url: './',
            orangeIcon: orangeOrdersIcon
        }, 
        {
            slug: 'products',
            url:'products',
            icon: productsIcon,
            title: 'Products',
            url: './products',
            orangeIcon: orangeProductsIcon
        }, 
        {
            icon: paymentIcon,
            title: 'Payment',
            url: '',
            orangeIcon: ''

        }, 
        {
            icon: promotionIcon,
            title: 'Promotion',
            url: '',
            orangeIcon: ''

        }, 
        {
            icon: settingIcon,
            title: 'Setting',
            url: '',
            orangeIcon: ''
        }
    ]
    const [currentTab, setCurrentTab] = useState(navigationList[1])
    const location = useLocation()
    const nav = useNavigate()

    useEffect(() => {
        const pathName = location.pathname.split('/')
        const tabIndex = navigationList.findIndex(t => {
            return t.slug === pathName[2]
        })
        setCurrentTab(navigationList[tabIndex].title)
    }, [location])

    return (
        <div className={styles.sideBarContainer} >

            {/* logo container */}
            <div className={styles.logoContainer} >
                <img 
                    className={styles.logo} 
                    src={logo} 
                    alt="Aware shop" 
                    onClick={() => nav('./')}
                />
            </div>

            {/* navigation container */}
            <div className={styles.navigationContainer} >
                {
                    navigationList.map((d, i) => (
                        <div 
                            key={i} 
                            className={`${styles.navigationItem} ${d.url === '' ? styles.inactive:''}`} 
                            onClick={() => {
                                nav(d.url)
                                setCurrentTab(d.title)
                            }}
                        >
                            {
                                currentTab === d.title &&
                                <div className={styles.sliderBar} />
                            }
                            <img 
                                className={`${styles.icon}`} 
                                src={currentTab === d.title ? d.orangeIcon:d.icon} 
                                alt={d.title} 
                            />
                            <span className={`${styles.title}  ${currentTab === d.title ? styles.focus:''}`}>{d.title}</span>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default memo(SideBar)