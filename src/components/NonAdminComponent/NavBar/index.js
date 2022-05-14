import styles from './navbar.module.css'
import { useNavigate } from 'react-router-dom'
import { memo, useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutService } from '../../../services/authServices'
import { requiredAuthContext } from '../../../routes/NonAdminRoute'
import axios from 'axios'

// image assets
import logo from '../../../assets/nonAdmin/logo.png'
import logo_2x from '../../../assets/nonAdmin/logo@2x.png'
import logo_3x from '../../../assets/nonAdmin/logo@3x.png'
import placeholder from '../../../assets/general/placeholder/placeholder.png'
import searchIcon from '../../../assets/general/icon/search.png'
import cartIcon from '../../../assets/general/icon/cart.png'
import arrowIcon from '../../../assets/general/icon/arrow.png'

// selector
import { userSelector } from '../../../redux/selector'

// API
import { getCategoriesByTreeLengthAPI } from '../../../APIs'

function NavBar(){
    const nav = useNavigate()
    const user = useSelector(userSelector)
    const [categoriesStore, setCategoiesStore] = useState([])
    const [rootCategories, setRootCategories] = useState([])
    const [childCategories, setChildCategories] = useState([])

    const handleShowChildNode = (r) => {
        const childNodes = categoriesStore.filter(c => c.parent === r)
        if(childNodes.length > 0) {
            setChildCategories(childNodes)
            document.querySelector(`.${styles.childNodeContainer}`)?.classList?.toggle(styles.hidden)
        }
    }

    const handleOnclickChildCategories = (c) => {
        document.querySelector(`.${styles.childNodeContainer}`)?.classList?.toggle(styles.hidden)
        nav(`./products/${c.parent}/${c.name}/All`)
    }

    const handleFetchCategoryData = async () => {
        try{
            const { data } = await axios.get(getCategoriesByTreeLengthAPI + '?length=2')
            
            if(data.status === 200) {
                setCategoiesStore(data.resultData)
                const categoryParent = data.resultData.map(c => c.parent)
                const rootSet = new Set(categoryParent)
                setRootCategories(Array.from(rootSet))
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err){

        }
    } 

    useEffect(() => {
        handleFetchCategoryData()
    }, [])

    return (
        <div className={styles.navBarContainer}>
            {/* Controll container */}
            <div className={styles.controllContainer}>
                {/* left container */}
                <div className={styles.leftContainer}>
                    <div className={styles.searchbar}>
                        <input className={styles.searchInput + ' ' + styles.font} placeholder="Search" spellCheck={false} />
                        <img src={searchIcon} className={styles.searchIcon} alt="search" />
                    </div>
                </div>
                {/* center container */}
                <img
                    src={logo}
                    srcSet={`${logo_2x}, ${logo_3x}`}
                    className={styles.logo + ' ' + styles.activeStyle}
                    alt="aware shop logo"
                    onClick={() => nav('./')}
                />
                {/* right container */}
                <div className={styles.rightContainer}>
                    {user ? <LoggedInBox user={user} />: <UnloggedInBox />}
                    
                    <div className={styles.cartButton + ' ' + styles.activeStyle} onClick={() => nav('./cart')} >
                        <img src={cartIcon} className={styles.cartIcon} alt="search" />
                        <div className={styles.cartNotification + ' ' + styles.font} >0</div> 
                    </div>
                </div>
            </div>

            {/* Category container */}
            <div className={styles.categoryContainer + ' '  + styles.font} >
                {
                    rootCategories && rootCategories.map((r, index) => (
                        <div key={index} className={styles.rootNode + ' ' + styles.activeStyle} onClick={() => handleShowChildNode(r)}>
                            <span>{r}</span>
                            <img src={arrowIcon} className={styles.arrowIcon} alt='arrow' />
                        </div>
                    ))
                }
                    <div 
                        className={styles.childNodeContainer + ' ' + styles.activeStyle + ' ' + styles.hidden} 
                    >
                    {
                        childCategories && childCategories.map((c, index) => (
                            <p 
                                key={index} 
                                className={styles.childNode + ' ' + styles.font} 
                                onClick={() => handleOnclickChildCategories(c)}
                            >
                                {c.name}
                            </p>  
                        ))
                    }
                    </div>
                
            </div>
        </div>
    )
}

// UnloggedInBox component
function UnloggedInBox() {

    const {toggleShowRegisterBox, toggleShowLoginBox} = useContext(requiredAuthContext)

    return (
        <div className={styles.UnloggedInBox + ' ' + styles.font}>
            <button onClick={toggleShowRegisterBox} className={styles.registerButton + ' ' + styles.activeStyle} >Register</button>
            <button onClick={toggleShowLoginBox} className={styles.loginButton + ' ' + styles.activeStyle} >Log In</button>
        </div>
    )
}

// LoggedInBox component
function LoggedInBox({user}) {
    const dispatch = useDispatch()

    const handleShowBox = e => {
        e.target?.nextSibling?.classList.toggle(styles.hidden)
    }

    const handleLogout = () => {
        logoutService(dispatch)
    }

    return (
        <div className={styles.loggedInBox}>
            <img 
                src={user?.avatar ? user?.avatar:placeholder} className={styles.avatar + ' ' + styles.activeStyle} 
                alt="avatar"  
                onClick={e => handleShowBox(e)}
            />

            <div className={styles.settingBox + ' ' + styles.font + ' ' + styles.hidden}>
                <div className={styles.settingButton + ' ' + styles.activeStyle} >
                    Account settings
                </div>
                <div className={styles.line} />
                <div onClick = {handleLogout} className={styles.settingButton + ' ' + styles.activeStyle} >
                    Logout
                </div>
            </div>
        </div>
    )
}

export default memo(NavBar)