import { memo, useEffect, useState, useContext } from 'react'
import styles from './RegisterBox.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { registerService } from '../../../services/authServices'
import { requiredAuthContext } from '../../../routes/Customer'

// image assets
import crossIcon from '../../../assets/shared/icon/cross.png'

function RegisterBox() {
    const [nameFieldValue, setNameFieldValue] = useState('')
    const [emailFieldValue, setEmailFieldValue] = useState('')
    const [passwordFieldValue, setPasswordFieldValue] = useState('')
    const dispatch = useDispatch()
    const {toggleShowRegisterBox, toggleShowLoginBox} = useContext(requiredAuthContext)
    let loadingId

    useEffect(() => {
        if(nameFieldValue !== '' && emailFieldValue !== '' && passwordFieldValue !== ''){
            const form = document.querySelector(`.${styles.registerForm}`)
            if(!form.SubmitButton.classList.contains(styles.activeButton))
                form.SubmitButton.classList.add(styles.activeButton)
        }
        else{
            const form = document.querySelector(`.${styles.registerForm}`)
            if(form.SubmitButton.classList.contains(styles.activeButton))
                form.SubmitButton.classList.remove(styles.activeButton)
        }
    }, [nameFieldValue, emailFieldValue, passwordFieldValue])

    const handleValidate = (e) => {
        const emailRegex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', 'g')
        const nameRegex = new RegExp('^[A-Za-z0-9 ]+$', 'g')
        let error = false
        if(!nameRegex.test(nameFieldValue)){
            e.target.children[2].children[2].classList.remove(styles.hiddenValidate)
            e.target.Name.classList.add(styles.errorStateStyle)
            error = true
        }
        else{
            e.target.children[2].children[2].classList.add(styles.hiddenValidate)
            e.target.Name.classList.remove(styles.errorStateStyle)
        }
        if(!emailRegex.test(emailFieldValue)){
            e.target.children[2].children[5].classList.remove(styles.hiddenValidate)
            e.target.Email.classList.add(styles.errorStateStyle)
            error = true
        }
        else{
            e.target.children[2].children[5].classList.add(styles.hiddenValidate)
            e.target.Email.classList.remove(styles.errorStateStyle)
        }
        if(passwordFieldValue.length <= 5){
            e.target.children[2].children[8].classList.remove(styles.hiddenValidate)
            e.target.Password.classList.add(styles.errorStateStyle)
            error = true
        }
        else{
            e.target.children[2].children[8].classList.add(styles.hiddenValidate)
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
                const res = await registerService(dispatch, {
                    userName: nameFieldValue,
                    email: emailFieldValue,
                    password: passwordFieldValue
                })
                if(res?.errorMessage) {
                    toast.dismiss(loadingId)
                    toast.error(res?.errorMessage)
                }
                else {
                    toast.dismiss(loadingId)
                    toast.success('successfully register')
                    setTimeout(() => {
                        toggleShowRegisterBox()
                    }, 2000)
                }
                e.target.style.pointerEvents = 'all'
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
        <div className={styles.registerContainer}>

            <ToastContainer />

            <div className={styles.overlay} />
            <form className={styles.registerForm} onSubmit={e => handleSubmit(e)} >

                <img onClick={toggleShowRegisterBox} src={crossIcon} alt="exit" className={styles.crossIcon}/>

                <span className={styles.registerBoxTitle}>
                    Register
                </span>

                {/* register content*/}
                <div className={styles.registerBoxContent}>
                    {/* Name */}
                    <label className={styles.registerBoxLabel} htmlFor="nameInput" >
                        name
                    </label>
                    <input
                        value={nameFieldValue}
                        onChange={e => setNameFieldValue(e.target.value)} 
                        name="Name" 
                        id="nameInput" 
                        className={styles.registerBoxInput} 
                        placeholder="Enter your name..."
                    />
                    <span name="NameValidate" className={styles.errorBlogger + ' ' + styles.hiddenValidate}>
                        Please enter a valid name!
                    </span>

                    {/* Email */}
                    <label className={styles.registerBoxLabel} htmlFor="emailInput" >
                        email
                    </label>
                    <input 
                        value={emailFieldValue} 
                        onChange={e => setEmailFieldValue(e.target.value)}
                        name="Email" id="emailInput" 
                        className={styles.registerBoxInput} 
                        placeholder="Enter your email..."
                    />
                    <span name="EmailValidate" className={styles.errorBlogger + ' ' + styles.hiddenValidate}>
                        Please enter a valid email!
                    </span>

                    {/* Email */}
                    <label className={styles.registerBoxLabel} htmlFor="passwordInput" >
                        password
                    </label>
                    <input 
                        value={passwordFieldValue}
                        onChange={e => setPasswordFieldValue(e.target.value)}
                        name="Password" 
                        id="passwordInput" 
                        type="password" 
                        className={styles.registerBoxInput} placeholder="Enter your password..."
                    />
                    <span name="PasswordValidate"  className={styles.errorBlogger + ' ' + styles.hiddenValidate}>
                        Your passwords must be more than 6 characters!
                    </span>
                </div>

                {/* register privacy */}
                <span className={styles.privacyBox}>
                    By creating an account you agree to the<span className={styles.hightlight}> Terms of Service </span>and<span className={styles.hightlight}> Privacy Policy</span>
                </span>
                
                <button name="SubmitButton" type="submit" className={styles.registerBoxButton}>Register</button>

                {/* login navigate */}
                <span className={styles.privacyBox + ' ' + styles.spanBox}>
                    Do you have an account? 
                    <span 
                        className={styles.highlight} 
                        style={{'cursor': 'pointer', 'marginLeft': '4px'}}
                        onClick={toggleShowLoginBox}
                    >
                        Log In 
                    </span>
                </span>

            </form>

        </div>
    )
}

export default memo(RegisterBox)