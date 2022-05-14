import { Outlet } from "react-router-dom"
import { memo, createContext, useState } from 'react'
import styles from './nonAdminRoute.module.css'

// component
import NavBar from '../../components/NonAdminComponent/NavBar'
import Footer from '../../components/NonAdminComponent/Footer'
import RegisterBox from '../../components/NonAdminComponent/RegisterBox'
import LoginBox from '../../components/NonAdminComponent/LoginBox'
import ForgotPasswordBox from '../../components/NonAdminComponent/ForgotPasswordBox'

export const requiredAuthContext = createContext(null)

function NonAdminRoute() {
    const [showRegisterBox, setShowRegisterBox] = useState(false) 
    const [showLoginBox, setShowLoginBox] = useState(false) 
    const [showForgotPasswordBox, setShowForgotPasswordBox] = useState(false)

    const toggleShowRegisterBox = () => {
        if(showLoginBox) {
            setShowLoginBox(false)
        }
        if(showForgotPasswordBox) {
            setShowForgotPasswordBox(false)
        }
        setShowRegisterBox(!showRegisterBox)
    }

    const toggleShowLoginBox = () => {
        if(showRegisterBox) {
            setShowRegisterBox(false)
        }
        if(showForgotPasswordBox) {
            setShowForgotPasswordBox(false)
        }
        setShowLoginBox(!showLoginBox)
    }

    const toggleShowForgotPasswordBox = () => {
        if(showRegisterBox) {
            setShowRegisterBox(false)
        }
        if(showLoginBox) {
            setShowLoginBox(false)
        }
        setShowForgotPasswordBox(!showForgotPasswordBox)
    }

    return (
        <div className="nonAdminContainer">
            <requiredAuthContext.Provider value={{toggleShowRegisterBox, toggleShowLoginBox, toggleShowForgotPasswordBox}}>
                <NavBar />
                {showRegisterBox && <RegisterBox />}
                {showLoginBox && <LoginBox />}
                {showForgotPasswordBox && <ForgotPasswordBox />}
                <div className={styles.contentContainer}>
                    <Outlet />
                </div>
                <Footer />
            </requiredAuthContext.Provider>
            
        </div>
    )
}

export default memo(NonAdminRoute)