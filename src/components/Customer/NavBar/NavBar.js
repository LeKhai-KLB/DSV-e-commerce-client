import styles from './Navbar.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { memo, useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutService } from '../../../services/authServices'
import { requiredAuthContext } from '../../../routes/Customer'
import CartNotifyBox from '../CartNotifyBox'
import axios from 'axios'

// image assets
import logo from '../../../assets/customer/logo.png'
import logo_2x from '../../../assets/customer/logo@2x.png'
import logo_3x from '../../../assets/customer/logo@3x.png'
import placeholder from '../../../assets/shared/placeholder/placeholder.png'
import searchIcon from '../../../assets/shared/icon/search.png'
import arrowIcon from '../../../assets/shared/icon/arrow.png'
import questionIcon from '../../../assets//customer/question.png'

// selector
import { userSelector } from '../../../redux/selector'

function NavBar(){
    const nav = useNavigate()
    const user = useSelector(userSelector)
    const [categoriesStore, setCategoiesStore] = useState([])
    const [rootCategories, setRootCategories] = useState([])
    const [parent, setParent] = useState('')
    const [childCategories, setChildCategories] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [searchProducts, setSearchProducts] = useState([])
    const params = useParams()

    const handleShowChildNode = (r) => {
        if(r !== parent) {
            const currentChildCategoryList = categoriesStore.filter(c => c.parent === r)
            setChildCategories(currentChildCategoryList)
            setParent(r)
        }
        else {
            setParent('')
            setChildCategories([])
        }
    }

    const handleOnclickChildCategories = (c) => {
        console.log(params.seRankCategory)
        if(!params.seRankCategory || params?.seRankCategory.split('_')[0] !== c.name.toLowerCase()){
            const firstRank = rootCategories.find(r => r._id === c.parent).name
            const secondRank = c.name
            nav(`./products/${firstRank.toLowerCase()}/${secondRank.toLowerCase()}_${c._id}`.replace(' ', '+'))
        }
        setParent('')
        setChildCategories([])
    }

    const handleFetchCategoryData = async () => {
        try{
            const { data } = await axios.get(process.env.REACT_APP_GET_CATEGORY_BY_TREE_LENGTH_API + '?length=1')
            if(data.status === 200) {
                setRootCategories(data.resultData)
                Promise.all(data.resultData.map(c => 
                    axios.get(process.env.REACT_APP_GET_CATEGORY_PASS_BY_PARENT_VALUE_API + '?parent=' + c._id)))
                    .then((values) => {
                        const newChildCategories = values.map(c => c.data.resultData).flat()
                        setCategoiesStore(newChildCategories)
                    })
                    .catch((err) => {
                        throw new Error(err.message)
                    })
            }
            else {
                throw new Error(data.errorMessage)
            }
        }
        catch(err){

        }
    } 

    const handleSearch = async () => {
        if(searchValue === '') {
            setTimeout(() =>
                setSearchProducts([])
            , 500)
        }
        else {
            try {
                const queryObject = {
                    searchValue: searchValue,
                    sortValue: '{"key":"totalInStock", "option":"asc"}',
                    slice: '0-10'
                }
                const queryString = Object.keys(queryObject).map(key => 
                    `${key}=${queryObject[key]}`
                ).join('&')
                const {data} = await axios.get(process.env.REACT_APP_GET_PRODUCT_BY_FILTER_AND_SORT_VALUE_API + '?' + queryString)
                if(data.status === 200) {
                    setSearchProducts(data.resultData.products)
                }
                else {
                    throw new Error(data.errorMessage)
                }
            }
            catch(err) {
                console.log(err.message)
            }
        }
    }

    useEffect(() => {
        handleSearch()
    }, [searchValue])

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
                        <input 
                            id="search input"
                            className={styles.searchInput + ' ' + styles.font} 
                            placeholder="Search" spellCheck={false} 
                            onChange={(e) => setSearchValue(e.target.value)}
                            value={searchValue}
                        />
                        <img src={searchIcon} className={styles.searchIcon} alt="search" />

                        {/* search products container */}
                        {
                            searchProducts.length !== 0 &&
                            <div className={styles.searchproductsContainer} >

                                {/* search entry */}
                                {
                                    searchProducts.length !== 0 && 
                                    searchProducts.map((p, i) => (

                                        <div 
                                            key={i}
                                            className={styles.searchProductEntry} 
                                            onClick={() => {
                                                nav('../product/' + p._id)
                                                setSearchValue('')
                                            }}
                                        >
                                            <img className={styles.searchProductImage} src={p.images[0]} alt = ' ' />
                                            <div title={p.name} className={styles.searchProductName} >
                                                {p.name} 
                                            </div>
                                        </div>

                                    ))
                                }

                            </div>
                        }

                    </div>
                </div>
                {/* center container */}
                <img
                    src={logo}
                    srcSet={`${logo_2x}, ${logo_3x}`}
                    className={styles.logo + ' ' + styles.activeStyle}
                    alt="aware shop logo"
                    onClick={() => {
                        setParent('')
                        setChildCategories([])
                        nav('./')
                    }}
                />
                {/* right container */}
                <div className={styles.rightContainer}>
                    {user ? <LoggedInBox user={user} />: <UnloggedInBox />}
                    
                    <div className={styles.cartButton} onClick={() => {
                            setParent('')
                            setChildCategories([])
                            nav('./cart')
                    }} >
                        <CartNotifyBox />
                    </div>

                </div>

            </div>

            {/* Category container */}
            <div className={styles.categoryContainer + ' '  + styles.font} >
                {
                    rootCategories && rootCategories.map((r, index) => (
                        <div 
                            key={index} 
                            className={styles.rootNode + ' ' + `${parent === r._id ? styles.highlight:''}`} 
                            onClick={() => handleShowChildNode(r._id)}
                        >
                            <span>{r.name}</span>
                            <img src={arrowIcon} className={styles.arrowIcon} alt="arrow" />
                        </div>
                    ))
                }
                    {childCategories.length !== 0 &&   
                        <div 
                            className={`${styles.childNodeContainer} ${styles.activeStyle}`} 
                        >
                            {
                                childCategories.length !== 0 && childCategories.map((c, index) => (
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
                    }
                
            </div>
        </div>
    )
}

// UnloggedInBox component
function UnloggedInBox() {

    const {setCurrenShowBox} = useContext(requiredAuthContext)

    return (
        <div className={styles.UnloggedInBox + ' ' + styles.font}>
            <button onClick={() => setCurrenShowBox(1)} className={styles.registerButton + ' ' + styles.activeStyle} >Register</button>
            <button onClick={() => setCurrenShowBox(2)} className={styles.loginButton + ' ' + styles.activeStyle} >Log In</button>
        </div>
    )
}

// LoggedInBox component
function LoggedInBox({user}) {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const { setCurrenShowBox } = useContext(requiredAuthContext)
    const [showSettingBox, setShowSettingBox] = useState(false)

    const handleLogout = () => {
        logoutService(dispatch, user.jwt)
    }

    return (
        <div className={styles.loggedInBox}>
            {
                !user.isVerified &&
                <img 
                    className={styles.questionIcon} 
                    src={questionIcon} 
                    alt=" " 
                    onClick={() => setCurrenShowBox(4)}
                />
            }
            <img 
                src={user?.avatar ? user?.avatar:placeholder} className={styles.avatar + ' ' + styles.activeStyle} 
                alt="avatar"  
                onClick={() => setShowSettingBox(!showSettingBox)}
            />

            {
                showSettingBox &&
                <div className={styles.settingBox + ' ' + styles.font}>
                    <div 
                        className={styles.settingButton + ' ' + styles.activeStyle} 
                        onClick={() => {
                            nav('./profile')
                            setShowSettingBox(false)
                        }}
                    >
                        Account settings
                    </div>
                    <div className={styles.line} />
                    <div 
                        onClick = {() => {
                            handleLogout()
                            setShowSettingBox(false)
                        }} 
                        className={styles.settingButton + ' ' + styles.activeStyle} 
                    >
                        Logout
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(NavBar)