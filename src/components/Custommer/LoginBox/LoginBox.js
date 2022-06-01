import { memo, useContext, useEffect, useState } from 'react'
import styles from './Login.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { requiredAuthContext } from '../../../routes/Custommer'
import { loginService } from '../../../services/authServices'
import { useDispatch } from 'react-redux'

import crossIcon from '../../../assets/shared/icon/cross.png'
import checkBoxIcon from '../../../assets/shared/icon/check-box.png'

function LoginBox() {
    const {toggleShowLoginBox, toggleShowRegisterBox, toggleShowForgotPasswordBox} = useContext(requiredAuthContext)
    const [emailFieldValue, setEmailFieldValue] = useState('')
    const [passwordFieldValue, setPasswordFieldValue] = useState('')
    const [rememberOption, setRememberOption] = useState(true)
    const dispatch = useDispatch()
    let loadingId

    useEffect(() => {
        if(emailFieldValue !== '' && passwordFieldValue !== ''){
            const form = document.querySelector(`.${styles.loginForm}`)
            if(!form.SubmitButton.classList.contains(styles.activeButton))
                form.SubmitButton.classList.add(styles.activeButton)
        }
        else{
            const form = document.querySelector(`.${styles.loginForm}`)
            if(form.SubmitButton.classList.contains(styles.activeButton))
                form.SubmitButton.classList.remove(styles.activeButton)
        }
    }, [emailFieldValue, passwordFieldValue])

    const handleValidate = (e) => {
        const emailRegex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', 'g')
        let error = false
        if(!emailRegex.test(emailFieldValue || passwordFieldValue.length <= 5)){
            e.target.children[1].children[0].classList.add(styles.showValidate)
            e.target.Email.classList.add(styles.errorStateStyle)
            e.target.Password.classList.add(styles.errorStateStyle)
            error = true
        }
        else{
            e.target.children[1].children[0].classList.remove(styles.showValidate)
            e.target.Email.classList.remove(styles.errorStateStyle)
            e.target.Password.classList.remove(styles.errorStateStyle)
        }
        return error
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(!handleValidate(e)) {
            try {
                e.target.style.setProperty('pointer-events', 'none', 'important')
                e.target.SubmitButton.style.setProperty('pointer-events', 'none')
                loadingId = toast.loading('Loading')
                const res = await loginService(dispatch, {
                    email: emailFieldValue,
                    password: passwordFieldValue
                })
                if(res?.errorMessage) {
                    toast.dismiss(loadingId)
                    toast.error(res?.errorMessage)
                }
                else {
                    toast.dismiss(loadingId)
                    toast.success('successfully login')
                    setTimeout(() => {
                        toggleShowLoginBox()
                    }, 1500)
                }
                e.target.style.setProperty('pointer-events', 'all', 'important')
            }
            catch (err) {
                e.target.style.setProperty('pointer-events', 'all', 'important')
                toast.dismiss(loadingId)
                toast.error(err.message)
            }
        }
    }
    
    return (
        <div className={styles.loginContainer} >

            <ToastContainer />

            <div className={styles.overlay} />
            <form className={styles.loginForm} onSubmit={e => handleSubmit(e)} >

                <img onClick={toggleShowLoginBox} src={crossIcon} alt="exit" className={styles.crossIcon}/>

                <span className={styles.loginBoxTitle}>
                    Login
                    <span className={styles.validateMessage}>Your e-mail/password is invalid!</span>
                </span>


                {/* register content*/}
                <div className={styles.loginBoxContent}>

                    {/* Email */}
                    <label className={styles.loginBoxLabel} htmlFor="emailInput" >
                        email
                    </label>
                    <input 
                        value={emailFieldValue} 
                        onChange={e => setEmailFieldValue(e.target.value)}
                        name="Email" id="emailInput" 
                        className={styles.loginBoxInput} 
                        placeholder="Enter your email..."
                    />

                    {/* Password */}
                    <label className={styles.loginBoxLabel} htmlFor="passwordInput" >
                        password
                    </label>
                    <input 
                        value={passwordFieldValue}
                        onChange={e => setPasswordFieldValue(e.target.value)}
                        name="Password" 
                        id="passwordInput" 
                        type="password" 
                        className={styles.loginBoxInput} placeholder="Enter your password..."
                    />

                    {/* selection box */}
                    <div className={styles.selectionBox}>
                        <div className={styles.rememberBox} onClick={() => setRememberOption(!rememberOption)} >
                            {rememberOption ? 
                                <img 
                                    src={checkBoxIcon} 
                                    alt="check box" 
                                    className={styles.checkBoxIcon}
                                />:
                                <div className={styles.blankBox} />
                            }
                            <span className={styles.rememberTitle}>Remember password</span>
                        </div>
                        <div className={styles.fogotPasswordBox}>
                            <span 
                                className={styles.fogotPasswordButton} 
                                onClick={toggleShowForgotPasswordBox}
                            >
                                Forgot your password?
                            </span>
                        </div>
                    </div>

                </div>

                {/* login button */}
                <button name="SubmitButton" type="submit" className={styles.loginBoxButton}>Login</button>
                
                {/* navigate register button */}
                <span className={styles.spanBox}>
                    Do you have an account? 
                    <span 
                        className={styles.highlight} 
                        style={{'cursor': 'pointer', 'marginLeft': '4px'}}
                        onClick={toggleShowRegisterBox}
                    >
                        Register 
                    </span>
                </span>

            </form>
        </div>
    )
}

export default memo(LoginBox)