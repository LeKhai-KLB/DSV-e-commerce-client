import { memo, useContext, useState, useEffect, useRef } from 'react'
import styles from './ForgotPasswordBox.module.css'
import { requiredAuthContext } from '../../../routes/Customer'
import Input from '../../Shared/Input'
import Button from '../../Shared/Button'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';

// image assets
import crossIcon from '../../../assets/shared/icon/cross.png'

function ForgotPasswordBox() {
    const [preventButtonEvent, setPreventButtonEvent] = useState(false)
    const {setCurrenShowBox, setInitEmail} = useContext(requiredAuthContext)

    const { register, handleSubmit, formState: { isDirty } } = useForm({
        defaultValues: {
            email: ''
        },
    })

    const onSubmit = async (data) => {
        const loadingId = toast.loading('loading')
        setPreventButtonEvent(true)
        try {
            const res = await axios.post(process.env.REACT_APP_RESET_PASSWORD, {email: data.email})
            if(res.data.status === 200) {
                toast.dismiss(loadingId)
                toast.success('Successfully sending password to your email')
                setTimeout(() => {
                    setInitEmail(res.data.resultData)
                    setCurrenShowBox(2)
                }, 1500)
            }
            else {
                throw new Error(res.data.errorMessage)
            }
        }
        catch(err) {
            setPreventButtonEvent(false)
            toast.dismiss(loadingId)
            toast.error(err.message)
            console.log(err)
        }
    }
    
    return (
        <div className={styles.forgotPasswordContainer} >

            <div className={styles.overlay} />

            <form className={styles.ForgotPasswordForm} onSubmit={handleSubmit(onSubmit)} >

                <img onClick={() => setCurrenShowBox(0)} src={crossIcon} alt="exit" className={styles.crossIcon}/>

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
                    <Input 
                        name="email" 
                        type="text"
                        placeholder="Enter your email..."
                        style={{marginTop: '8px'}}
                        register={register}
                        required={true}
                    />

                </div>

                {/* Forgot password button */}
                <Button 
                    type="submit" 
                    preventDefault={preventButtonEvent}
                    isActive={isDirty}
                >
                    Submit
                </Button>
                
                {/* navigate login button */}
                <span className={styles.spanBox}>
                    Do you have an account? 
                    <span 
                        className={styles.highlight} 
                        style={{'cursor': 'pointer', 'marginLeft': '4px'}}
                        onClick={() => setCurrenShowBox(2)}
                    >
                        Login 
                    </span>
                </span>

            </form>

        </div>
    )
}

export default memo(ForgotPasswordBox)