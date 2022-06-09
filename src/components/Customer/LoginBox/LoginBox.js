import { memo, useContext, useEffect, useState } from 'react'
import styles from './Login.module.css'
import { toast } from 'react-toastify'
import { requiredAuthContext } from '../../../routes/Customer'
import { loginService } from '../../../services/authServices'
import { useDispatch } from 'react-redux'
import Input from '../../Shared/Input'
import Button from '../../Shared/Button'
import Yup, { yupValidator } from '../../../services/validatorServices'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFormState } from 'react-hook-form'

// image assets
import crossIcon from '../../../assets/shared/icon/cross.png'
import checkBoxIcon from '../../../assets/shared/icon/check-box.png'

const schema = Yup.object().shape({
    email: yupValidator.email,
    password: yupValidator.password
})

function LoginBox({initEmail}) {
    const {setCurrenShowBox, setInitEmail} = useContext(requiredAuthContext)
    const [rememberOption, setRememberOption] = useState(true)
    const [showError, setShowError] = useState(false)
    const [preventButtonEvent, setPreventButtonEvent] = useState(false)
    const dispatch = useDispatch()
    let loadingId

    const { register, handleSubmit, control, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: ''
        },
    })


    const { dirtyFields } = useFormState({ control })

    const onSubmit = async (data) => {
        try {
            loadingId = toast.loading('Loading')
            setPreventButtonEvent(true)
            const res = await loginService(dispatch, {
                email: data.email,
                password: data.password
            })
            if(res?.errorMessage) {
                setPreventButtonEvent(false)
                toast.dismiss(loadingId)
                toast.error(res?.errorMessage)
            }
            else {
                toast.dismiss(loadingId)
                toast.success('successfully login')
                setTimeout(() => {
                    setCurrenShowBox(0)
                }, 1500)
            }
        }
        catch (err) {
            setPreventButtonEvent(false)
            toast.dismiss(loadingId)
            toast.error(err.message)
        }
    }

    const onError = () => {
        setShowError(true)
    }

    useEffect(() => {
        if(showError) {
            if(Object.keys(dirtyFields).length < 2)
                setShowError(false)
        }
    }, [Object.keys(dirtyFields).length])

    useEffect(() => {
        if(initEmail) 
            setValue('email', initEmail, {shouldDirty: true})
    }, [initEmail])

    useEffect(() => {
        return () => {
            setInitEmail(null)
        }
    },[])
    
    return (
        <div className={styles.loginContainer} >

            <div className={styles.overlay} />
            <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit, onError)} >

                <img onClick={() => setCurrenShowBox(0)} src={crossIcon} alt="exit" className={styles.crossIcon}/>

                <span className={styles.loginBoxTitle}>
                    Login
                    <span className={`${styles.validateMessage} ${showError ? styles.showValidate:''}`}>Your e-mail/password is invalid!</span>
                </span>


                {/* register content*/}
                <div className={styles.loginBoxContent}>

                    {/* Email */}
                    <label className={styles.loginBoxLabel} htmlFor="emailInput" >
                        email
                    </label>
                    <Input 
                        name="email" 
                        type="text"
                        placeholder="Enter your email..."
                        style={{margin: '8px 0px 24px'}}
                        register={register}
                        invalid={showError}
                        required={true}
                    />

                    {/* Password */}
                    <label className={styles.loginBoxLabel} htmlFor="passwordInput" >
                        password
                    </label>
                    <Input 
                        name="password" 
                        type="password" 
                        placeholder="Enter your password..."
                        style={{margin: '8px 0px 24px'}}
                        register={register}
                        invalid={showError}
                        required={true}
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
                                onClick={() => setCurrenShowBox(3)}
                            >
                                Forgot your password?
                            </span>
                        </div>
                    </div>

                </div>

                {/* login button */}
                <Button type="submit" preventDefault={preventButtonEvent} isActive={Object.keys(dirtyFields).length === 2 ? true:false}>Login</Button>
                
                {/* navigate register button */}
                <span className={styles.spanBox}>
                    Do you have an account? 
                    <span 
                        className={styles.highlight} 
                        style={{'cursor': 'pointer', 'marginLeft': '4px'}}
                        onClick={() => setCurrenShowBox(1)}
                    >
                        Register 
                    </span>
                </span>

            </form>
        </div>
    )
}

export default memo(LoginBox)