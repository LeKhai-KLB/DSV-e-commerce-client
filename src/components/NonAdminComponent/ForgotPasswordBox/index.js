import { memo, useContext, useState, useEffect } from 'react'
import styles from './forgotPasswordBox.module.css'
import { requiredAuthContext } from '../../../routes/NonAdminRoute'

// image assets
import crossIcon from '../../../assets/general/icon/cross.png'

function ForgotPasswordBox() {
    const [emailFieldValue, setEmailFieldValue] = useState('')
    const {toggleShowLoginBox, toggleShowForgotPasswordBox} = useContext(requiredAuthContext)

    useEffect(() => {
        if(emailFieldValue !== ''){
            const form = document.querySelector(`.${styles.ForgotPasswordForm}`)
            if(!form.SubmitButton.classList.contains(styles.activeButton))
                form.SubmitButton.classList.add(styles.activeButton)
        }
        else{
            const form = document.querySelector(`.${styles.ForgotPasswordForm}`)
            if(form.SubmitButton.classList.contains(styles.activeButton))
                form.SubmitButton.classList.remove(styles.activeButton)
        }
    }, [emailFieldValue])

    const handleSubmit = (e) => {   
        e.preventDefault();
    }
    
    return (
        <div className={styles.forgotPasswordContainer} >

            <div className={styles.overlay} />

            <form className={styles.ForgotPasswordForm} onSubmit={e => handleSubmit(e)} >

                <img onClick={toggleShowForgotPasswordBox} src={crossIcon} alt="exit" className={styles.crossIcon}/>

                <span className={styles.forgotPasswordBoxTitle}>
                    Forgot password
                    <span className={styles.noteMessage}>
                        Enter your e-mail address below and we’ll get you back on track.
                    </span>
                </span>


                {/* Forgot password content*/}
                <div className={styles.forgotPasswordBoxContent}>

                    {/* Email */}
                    <label className={styles.forgotPasswordBoxLabel} htmlFor="emailInput" >
                        email
                    </label>
                    <input 
                        value={emailFieldValue} 
                        onChange={e => setEmailFieldValue(e.target.value)}
                        name="Email" id="emailInput" 
                        className={styles.forgotPasswordBoxInput} 
                        placeholder="Enter your email..."
                    />

                </div>

                {/* Forgot password button */}
                <button name="SubmitButton" type="submit" className={styles.forgotPasswordBoxButton}>Submit</button>
                
                {/* navigate login button */}
                <span className={styles.spanBox}>
                    Do you have an account? 
                    <span 
                        className={styles.highlight} 
                        style={{'cursor': 'pointer', 'marginLeft': '4px'}}
                        onClick={toggleShowLoginBox}
                    >
                        Login 
                    </span>
                </span>

            </form>

        </div>
    )
}

export default memo(ForgotPasswordBox)