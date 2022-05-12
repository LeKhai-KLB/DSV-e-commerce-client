import { memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginService } from '../../services/authServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// image
import rectangle_5 from '../../assets/admin/rectangle-5.png'
import rectangle_5_2x from '../../assets/admin/rectangle-5@2x.png'
import logo from '../../assets/general/logo.png'
import logo_2x from '../../assets/general/logo@2x.png'
import logo_3x from '../../assets/general/logo@3x.png'

// selector
import { adminSelector, errorMessageSelector } from '../../redux/selector'

// css styles
import styles from './adminLogin.module.css'

let loadingId;

function AdminLogin() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const overlay = useRef()
    const errorMessage = useSelector(errorMessageSelector)
    const admin = useSelector(adminSelector)

    const handleSubmit = async (e) => {
        e.preventDefault()
        loadingId = toast.loading('Loading')
        overlay.current.classList.toggle(styles.show)

        try {
            await loginService(dispatch, {
                email: e.target.Email.value,
                password: e.target.Password.value
            })
            if(errorMessage !== '') {
                overlay.current.classList.toggle(styles.show)
                toast.dismiss(loadingId)
                toast.error(errorMessage)
            }
            else {
                toast.dismiss(loadingId)
                if(admin) {
                    toast.success('Successfully login')
                    setTimeout(() => {
                        nav(-1, {replace: true})   
                    }, 2000)
                }
                else {
                    overlay.current.classList.toggle(styles.show)
                    toast.error('you do not have permission to login as admin')
                }
            }
        }
        catch (err) {
            overlay.current.classList.toggle(styles.show)
            toast.dismiss(loadingId)
            toast.error(err.message)
        }
    }

    return (
        <div className={styles.background}>

            <ToastContainer theme="dark"/> 
            <div className={styles.overlay} ref={overlay} />

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