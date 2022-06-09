import { memo, useEffect, useState, useContext } from 'react'
import styles from './RegisterBox.module.css'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { registerService } from '../../../services/authServices'
import { requiredAuthContext } from '../../../routes/Customer'
import Input from '../../Shared/Input'
import Button from '../../Shared/Button'
import Yup, { yupValidator } from '../../../services/validatorServices'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFormState } from 'react-hook-form'

// image assets
import crossIcon from '../../../assets/shared/icon/cross.png'

const schema = Yup.object().shape({
    email: yupValidator.email,
    name: yupValidator.name,
    password: yupValidator.password
})

function RegisterBox() {
    const {setCurrenShowBox} = useContext(requiredAuthContext)
    const [preventButtonEvent, setPreventButtonEvent] = useState(false)
    const dispatch = useDispatch()
    let loadingId

    const { register, handleSubmit, control, formState: { errors, isValid }, clearErrors } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            name: ''
        },
    })

    const { dirtyFields } = useFormState({ control })

    useEffect(() =>{
        if(!isValid) {
            if(Object.keys(dirtyFields).length < 3)
                clearErrors(Object.keys(errors));
        }
    }, [Object.keys(dirtyFields).length])

    const onSubmit = async (data) => {
        try {
            setPreventButtonEvent(true)
            loadingId = toast.loading('Loading')
            const res = await registerService(dispatch, {
                userName: data.name,
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
                toast.info('successfully register, we have sent you a verify email, please check !')
                setTimeout(() =>{
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

    return (
        <div className={styles.registerContainer}>

            <div className={styles.overlay} />
            <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)} autoComplete="off" >

                <img onClick={() => setCurrenShowBox(0)} src={crossIcon} alt="exit" className={styles.crossIcon}/>

                <span className={styles.registerBoxTitle}>
                    Register
                </span>

                {/* register content*/}
                <div className={styles.registerBoxContent}>
                    {/* Name */}
                    <label className={styles.registerBoxLabel} htmlFor="nameInput" >
                        name
                    </label>
                    <Input
                        name="name" 
                        type="text"
                        placeholder="Enter your name..."
                        style={{marginTop: '8px'}}
                        register={register}
                        invalid={errors?.name ? true:false}
                        required={true}
                    />
                    <span 
                        className={`${styles.errorBlogger} ${errors?.name ? '':styles.hiddenValidate}`}
                    >
                        {errors?.name?.message ? errors?.name?.message:'none'}
                    </span>

                    {/* Email */}
                    <label className={styles.registerBoxLabel} htmlFor="emailInput" >
                        email
                    </label>
                    <Input 
                        name="email" 
                        type="text"
                        placeholder="Enter your email..."
                        style={{marginTop: '8px'}}
                        invalid={errors?.email ? true:false}
                        register={register}
                        required={true}
                    />
                    <span 
                        className={`${styles.errorBlogger} ${errors?.email ? '':styles.hiddenValidate}`}
                    >
                        {errors?.email?.message ? errors?.email?.message:'none'}
                    </span>

                    {/* Email */}
                    <label className={styles.registerBoxLabel} htmlFor="passwordInput" >
                        password
                    </label>
                    <Input 
                        name="password" 
                        type="password"
                        placeholder="Enter your password..."
                        style={{marginTop: '8px'}}
                        register={register}
                        invalid={errors?.password ? true:false}
                        required={true}
                    />
                    <span
                        className={`${styles.errorBlogger} ${errors?.password ? '':styles.hiddenValidate}`}
                    >
                        {errors?.password?.message ? errors?.password?.message:'none'}
                    </span>
                </div>

                {/* register privacy */}
                <span className={styles.privacyBox}>
                    By creating an account you agree to the<span className={styles.hightlight}> Terms of Service </span>and<span className={styles.hightlight}> Privacy Policy</span>
                </span>
                
                <Button type="submit" preventDefault={preventButtonEvent} isActive={Object.keys(dirtyFields).length === 3 ? true:false}>Register</Button>

                {/* login navigate */}
                <span className={styles.privacyBox + ' ' + styles.spanBox}>
                    Do you have an account? 
                    <span 
                        className={styles.highlight} 
                        style={{'cursor': 'pointer', 'marginLeft': '4px'}}
                        onClick={() => setCurrenShowBox(2)}
                    >
                        Log In 
                    </span>
                </span>

            </form>

        </div>
    )
}

export default memo(RegisterBox)