import { memo, useState, useEffect } from 'react'
import styles from './profile.module.css'
import { useSelector } from 'react-redux'
import { userSelector } from '../../../redux/selector'
import { useNavigate } from 'react-router-dom'

// image assets
import placeholderImage from '../../../assets/shared/placeholder/placeholder.png'

function Profile() {
    const tab = ['Account setting', 'Change password']
    const [currentTab, setCurrentTab] = useState(0)
    const user = useSelector(userSelector)
    const nav = useNavigate()

    useEffect(() => {
        if(!user) {
            nav('../')
        }
    }, [user])

    return (
        <div className={styles.profileContainer} >

            {/* profle side bar */}
            <div className={styles.profileSideBar} >
                <span className={styles.profileSideBarTitle} >Profile</span>
                <div className={styles.tabContainer} >
                    {
                        tab.map((e, i) => 
                            <div 
                                key={i} 
                                className={`
                                    ${styles.tabItem} 
                                    ${styles.typhography} 
                                    ${styles.pointer} 
                                    ${i === currentTab ? styles.focus:''}
                                `} 
                                onClick={() => setCurrentTab(i)}
                            >
                                {e}
                            </div>
                        )
                    }
                    
                </div>
            </div>

            {/* tab content contaniner */}
            <div className={styles.tabContentContainer} >
                {
                    currentTab === 0 ?
                    <AccountSettingTab user={user} /> : <ChangePasswordTab user={user} />
                }
            </div>

        </div>
    )
}

function AccountSettingTab({user}) {
    const [editMode, setEditMode] = useState(false)

    return (
        <>
            {/* task bar */}
            <div className={styles.taskBar} >
                    <span className={`${styles.typography} ${styles.bold}`}>Infomation</span>
                    <span className={`${styles.typography} ${styles.pointer}`}>edit</span>
                </div>

            {/* form */}
            <form className={styles.form} >

                {/* avatar field */}
                <div className= {styles.contentContainer} >
                    <div className={styles.fieldsContainer}>

                        {/* name label */}
                        <label className={styles.label} >Name</label>
                        {/* name field */}
                        <span className={`${styles.typography} ${styles.fieldMargin}`}>{user?.userName}</span>

                        {/* email label */}
                        <label className={styles.label} >Email</label>
                        {/* email filed */}
                        <span className={`${styles.typography} ${styles.fieldMargin}`}>{user?.email}</span>

                    </div>

                    {/* avatar */}
                    <div className={styles.avatarContainer} >
                        <img className={styles.avatar} src={user?.avatar ? user.avatar : placeholderImage} />
                    </div>
                </div>

                

            </form>
        </>
    )
}

function ChangePasswordTab() {
    return (
        <>
            oke
        </>
    )
}

export default memo(Profile)