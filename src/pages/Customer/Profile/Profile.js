import { memo, useState, useEffect } from 'react'
import styles from './Profile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import {updateInfo} from '../../../redux/slices/authSlice'
import { userSelector } from '../../../redux/selector'
import { useNavigate } from 'react-router-dom'
import Input from '../../../components/Shared/Input'
import Button from '../../../components/Shared/Button'
import Yup, { yupValidator } from '../../../services/validatorServices'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFormState } from 'react-hook-form'
import { getImageURL } from '../../../services/uploadImageService'
import axios from 'axios'
import { toast } from 'react-toastify'

// image assets
import placeholderImage from '../../../assets/shared/placeholder/placeholder.png'
import editIcon from '../../../assets/customer/edit.png'
import cancelIcon from '../../../assets/customer/cancel.png'

const updateSchema = Yup.object().shape({
    email: yupValidator.email,
    name: yupValidator.name
})

const changePasswordSchema = Yup.object().shape({
    currentPassword: yupValidator.required,
    password: yupValidator.password,
    confirmPassword: yupValidator.confirmPassword
})

function Profile() {
    const tab = ['Account setting', 'Change password']
    const [currentTab, setCurrentTab] = useState(0)
    const user = useSelector(userSelector)
    const nav = useNavigate()

    useEffect(() => {
        if(!user) {
            nav('../')
        }
    }, [user])

    return (
        <div className={styles.profileContainer} >

            {/* profle side bar */}
            <div className={styles.profileSideBar} >
                <span className={styles.profileSideBarTitle} >Profile</span>
                <div className={styles.tabContainer} >
                    {
                        tab.map((e, i) => 
                            <div 
                                key={i} 
                                className={`
                                    ${styles.tabItem} 
                                    ${styles.typhography} 
                                    ${styles.pointer} 
                                    ${i === currentTab ? styles.focus:''}
                                `} 
                                onClick={() => setCurrentTab(i)}
                            >
                                {e}
                            </div>
                        )
                    }
                    
                </div>
            </div>

            {/* tab content contaniner */}
            <div className={styles.tabContentContainer} >
                {
                    currentTab === 0 ?
                    user && <AccountSettingTab user={user} /> :  user &&<ChangePasswordTab user={user} onChangeTab={setCurrentTab} />
                }
            </div>

        </div>
    )
}

function AccountSettingTab({user}) {
    const [editMode, setEditMode] = useState(false)

    return (
        <>
            {/* task bar */}
            <div className={styles.taskBar} >
                <span className={`${styles.typography} ${styles.bold}`}>Infomation</span>
                <span 
                    className={`${styles.typography} ${styles.pointer}`}
                    onClick={() => setEditMode(!editMode)}
                >
                    edit
                </span>
            </div>
            {
                !editMode ?
                <ViewMode user={user} /> : 
                <EditMode user={user} changeMode={setEditMode} />
            }
        </>
    )
}

function ViewMode({user}) {
    return (
        <form className={styles.viewForm} >

            {/* avatar field */}
            <div className= {styles.contentContainer} >
                <div className={styles.fieldsContainer}>

                    {/* name label */}
                    <label className={styles.label} >Name</label>
                    {/* name field */}
                    <span className={`${styles.typography} ${styles.fieldMargin}`}>{user?.userName}</span>

                    {/* email label */}
                    <label className={styles.label} >Email</label>
                    {/* email filed */}
                    <span className={`${styles.typography} ${styles.fieldMargin}`}>{user?.email}</span>

                </div>

                {/* avatar */}
                <div className={styles.avatarContainer} >
                    <img className={styles.avatar} src={user?.avatar ? user.avatar : placeholderImage} />
                </div>
            </div>

        </form>
    )
}

function EditMode({user, changeMode}) {
    const { register, resetField, handleSubmit, control, formState: { errors, isDirty }, setValue } = useForm({
        resolver: yupResolver(updateSchema),
        defaultValues: {
            email: user.email,
            name: user.userName,
            avatar: '',
        },
    })
    const [preventButtonEvent, setPreventButtonEvent] = useState(false)
    const [photo, setPhoto] = useState(user?.avatar ? user.avatar : null)
    const dispatch = useDispatch()

    const inputStyle = {
        backgroundColor: 'white',
        width: '220px',
        marginTop: '8px',
        marginBottom: '24px'
    }

    const cancelImage = () => {
        URL.revokeObjectURL(photo)
        setPhoto(user?.avatar ? user.avatar : null)
        resetField('avatar')
    }

    useEffect(() => {
        setValue('email', user.email)
        setValue('name', user.userName)
    }, [])

    useEffect(() => {
        if(control._formValues.avatar.length !== 0) {
            const previewImage = URL.createObjectURL(control._formValues.avatar[0])
            setPhoto(previewImage)
        }
    }, [control._formValues.avatar])

    const onSubmit = async (data) => {
        let loadingId = toast.loading('loading...')
        try {
            let imageUrl
            if(control._formValues.avatar.length !== 0) {
                imageUrl = await getImageURL(control._formValues.avatar[0])
            }
            else {
                imageUrl = null
            }
            const res = await axios.post(process.env.REACT_APP_UPDATE_USER_INFO, {
                _id: user.id,
                userName: data.name,
                email: data.email,
                avatar: imageUrl
            }, {
                headers: {
                    authorization: user.jwt
                }
            })
            if(res.data.status === 200) {
                toast.dismiss(loadingId)
                toast.success('Successfully updated')
                dispatch(updateInfo(res.data.resultData))
                changeMode(false)
            }
            else {
                throw new Error(res.data.errorMessage)
            }
        }
        catch(err) {
            toast.dismiss(loadingId)
            toast.error(err.message)
        }
    }

    return (
        <form className={styles.editForm} onSubmit={handleSubmit(onSubmit)} >

            {/* avatar field */}
            <div className= {styles.contentContainer} >
                <div className={styles.fieldsContainer}>

                    {/* name label */}
                    <label className={styles.label} >Name</label>
                    {/* name field */}
                    <Input
                        name="name" 
                        type="text"
                        placeholder="Enter your name..."
                        style={inputStyle}
                        register={register}
                        invalid={errors?.name ? true:false}
                        required={true}
                    />

                    {/* email label */}
                    <label className={styles.label} >Email</label>
                    {/* email filed */}
                    <Input 
                        name="email" 
                        type="text"
                        placeholder="Enter your email..."
                        style={inputStyle}
                        invalid={errors?.email ? true:false}
                        register={register}
                        required={true}
                    />

                </div>

                {/* avatar */}
                <div className={styles.avatarContainer} >
                    {
                        control._formValues.avatar.length !== 0 &&
                        <img className={styles.nonGravity} src={cancelIcon} alt=" " onClick={() => cancelImage()} />
                    }
                    <img className={styles.avatar} src={photo ? photo : placeholderImage} />
                    <label htmlFor= "imageInput" >
                        <img className={styles.icon} src={editIcon} alt=" " />
                    </label>
                    <input id="imageInput" {...register('avatar')} type="file" className={styles.imageInput} />
                </div>
            </div>

            <Button style={{marginTop: '24px'}} type="submit" preventDefault={preventButtonEvent} isActive={isDirty}>Save</Button>

        </form>
    )
}

function ChangePasswordTab({user, onChangeTab}) {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            password: '',
            confirmPassword: ''
        },
    })
    const { dirtyFields } = useFormState({control})
    const [preventButtonEvent, setPreventButtonEvent] = useState(false)

    const inputStyle = {
        backgroundColor: 'white',
        marginTop: '8px',
        marginBottom: '24px'
    }

    const onSubmit = async (data) => {
        let loadingId = toast.loading('Loading...')
        setPreventButtonEvent(true)
        try {
            const res = await axios.post(process.env.REACT_APP_CHANGE_PASSWORD, {
                _id: user.id,
                password: data.currentPassword,
                newPassword: data.password
            }, {
                headers: {
                    authorization: user.jwt
                }
            })
            if(res.data.status === 200) {
                setPreventButtonEvent(false)
                toast.dismiss(loadingId)
                toast.success('Successfully changed password')
                onChangeTab(1)
            }
            else {
                throw new Error(res.data.errorMessage)
            }
        }
        catch(err) {
            setPreventButtonEvent(false)
            toast.dismiss(loadingId)
            toast.error(err.message)
        }
    }

    return (
        <form className={styles.changePasswordForm} onSubmit={handleSubmit(onSubmit)} >

            <div className= {styles.contentContainer} >
                <div className={styles.fieldsContainer}>

                    {/* current password label */}
                    <label className={styles.label} >Current password</label>
                    {/* name field */}
                    <Input
                        name="currentPassword" 
                        type="password"
                        placeholder="Enter your password..."
                        style={inputStyle}
                        register={register}
                        invalid={errors?.currentPassword ? true:false}
                        required={true}
                    />

                    {/* new password label */}
                    <label className={styles.label} >New password</label>
                    {/* new password filed */}
                    <Input 
                        name="password" 
                        type="password"
                        placeholder="Enter your new password..."
                        style={inputStyle}
                        invalid={errors?.newPassword ? true:false}
                        register={register}
                        required={true}
                    />

                    {/* confirm password label */}
                    <label className={styles.label} >Confirm password</label>
                    {/* confirm password filed */}
                    <Input 
                        name="confirmPassword" 
                        type="password"
                        placeholder="Confirm password..."
                        style={inputStyle}
                        invalid={errors?.confirmPassword ? true:false}
                        register={register}
                        required={true}
                    />

                </div>

            </div>

            <Button 
                style={{marginTop: '24px'}} 
                type="submit" 
                preventDefault={preventButtonEvent} 
                isActive={Object.keys(dirtyFields).length === 3}
            >
                Save
            </Button>

        </form>
    )
}

export default memo(Profile)