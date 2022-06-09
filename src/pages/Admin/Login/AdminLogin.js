import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginService } from '../../../services/authServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// image
import rectangle_5 from '../../../assets/admin/rectangle-5.png'
import rectangle_5_2x from '../../../assets/admin/rectangle-5@2x.png'
import logo from '../../../assets/admin/logo.png'
import logo_2x from '../../../assets/admin/logo@2x.png'
import logo_3x from '../../../assets/admin/logo@3x.png'

// css styles
import styles from './AdminLogin.module.css'

let loadingId;

function AdminLogin() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const [showOverLay, setShowOverlay] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        loadingId = toast.loading('Loading')
        setShowOverlay(true)
        try {
            const res = await loginService(dispatch, {
                email: e.target.Email.value,
                password: e.target.Password.value
            })
            if(res?.errorMessage) {
                throw new Error(res?.errorMessage)
            }
            else {
                toast.dismiss(loadingId)
                if(res.isAdmin) {
                    toast.success('Successfully login')
                    setTimeout(() => {
                        nav('../admin/')   
                    }, 2000)
                }
                else {
                    throw new Error('you do not have permission to login as admin')
                }
            }
        }
        catch (err) {
            setShowOverlay(false)
            toast.dismiss(loadingId)
            toast.error(err.message)
        }
    }

    return (
        <div className={styles.background}>

            <ToastContainer theme="dark"/> 
            {
                showOverLay &&
                <div className={styles.overlay} />
            }

            <img 
                src={rectangle_5}
                srcSet={rectangle_5_2x}
                className={styles.Rectangle_5}
                alt="aware shop background"
            />

            <img
                src={logo}
                srcSet={`${logo_2x}, ${logo_3x}`}
                className={styles.logo}
                alt="aware shop logo"
            />

            <form className={styles.loginBox} onSubmit={(e) => handleSubmit(e)}>

                <span className={styles.loginBoxTitle}>
                    Log in
                </span>

                <div className={styles.loginBoxContent}>
                    <label className={styles.loginBoxLabel} htmlFor="emailInput" >
                        email
                    </label>
                    <input name="Email" id="emailInput" type="email" className={styles.loginBoxInput} placeholder="email@example.com" required />
                    <label className={styles.loginBoxLabel} htmlFor="passwordInput" >
                        password
                    </label>
                    <input name="Password" id="passwordInput" type="password" className={styles.loginBoxInput} placeholder="Enter password" required />
                    <button className={styles.loginBoxButton} type="submit">
                        Login
                    </button>
                </div>

                <span className={styles.loginBoxForgotButton}>
                    Forgot Password
                </span>

            </form>
        </div>
    )
}

export default memo(AdminLogin)