import { memo, useContext, useState, useEffect } from 'react'
import styles from './ResendVerifyEmail.module.css'
import { requiredAuthContext } from '../../../routes/Customer'
import Input from '../../Shared/Input'
import Button from '../../Shared/Button'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import { userSelector } from '../../../redux/selector'
import { useSelector, useDispatch } from 'react-redux'
import { logoutService } from '../../../services/authServices'

// image assets
import crossIcon from '../../../assets/shared/icon/cross.png'

function ResendVerifyEmail() {
    const [preventButtonEvent, setPreventButtonEvent] = useState(false)
    const {setCurrenShowBox} = useContext(requiredAuthContext)
    const user = useSelector(userSelector)
    const dispatch = useDispatch()

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            email: ''
        },
    })

    const handleLogout = async () => {
        try {
            await logoutService(dispatch, user.jwt)
            setCurrenShowBox(0)
        }
        catch{}
    }

    const onSubmit = async (data) => {
        const loadingId = toast.loading('loading')
        setPreventButtonEvent(true)
        try {
            const res = await axios.post(process.env.REACT_APP_RESEND_VERIFY_EMAIL, {email: data.email}, {
                headers: {
                    authorization: user.jwt
                }
            })
            if(res.data.status === 200) {
                toast.dismiss(loadingId)
                toast.success('Successfully sending verify mail to your email')
                setTimeout(() => {
                    handleLogout()
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

    useEffect(() => {
        setValue('email', user.email)
    }, [])
    
    return (
        <div className={styles.forgotPasswordContainer} >

            <div className={styles.overlay} />

            <form className={styles.ForgotPasswordForm} onSubmit={handleSubmit(onSubmit)} >

                <img onClick={() => setCurrenShowBox(0)} src={crossIcon} alt="exit" className={styles.crossIcon}/>

                <span className={styles.forgotPasswordBoxTitle}>
                    Verify email
                    <span className={styles.noteMessage}>
                        We’ll get you back on track when submit to send verify mail
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
                        readOnly={true}
                    />

                </div>

                {/* Forgot password button */}
                <Button 
                    type="submit" 
                    preventDefault={preventButtonEvent}
                    isActive={true}
                >
                    Submit
                </Button>

            </form>

        </div>
    )
}

export default memo(ResendVerifyEmail)