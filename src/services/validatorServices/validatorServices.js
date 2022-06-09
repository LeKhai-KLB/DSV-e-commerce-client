import * as yup from 'yup'

const YupErrorMessage ={
    REQUIRED_ERROR_MESSAGE: 'Do not leave blank field',
    EMAIL_ERROR_MESSAGE: 'Please enter a valid e-mail!',
    NAME_ERROR_MESSAGE: 'Please enter a valid name!',
    PASSWORD_ERROR_MESSAGE: 'Your passwords must be more than 6 characters!',
    CONFIRM_PASSWORD_ERROR_MESSAGE: 'Password does not match'
}

const Yup = yup

const nameRegex = new RegExp('^[A-Za-z0-9 ]+$', 'g')

export default Yup
export const yupValidator = {
    email: Yup.string().required(YupErrorMessage.REQUIRED_ERROR_MESSAGE).email(YupErrorMessage.EMAIL_ERROR_MESSAGE),
    name: Yup.string().required(YupErrorMessage.REQUIRED_ERROR_MESSAGE).matches(nameRegex, YupErrorMessage.NAME_ERROR_MESSAGE),
    password: Yup.string().required(YupErrorMessage.REQUIRED_ERROR_MESSAGE).min(7, YupErrorMessage.PASSWORD_ERROR_MESSAGE),
    confirmPassword: Yup.string().required(YupErrorMessage.REQUIRED_ERROR_MESSAGE).oneOf([Yup.ref('password')], YupErrorMessage.CONFIRM_PASSWORD_ERROR_MESSAGE),
    require: Yup.string().required(YupErrorMessage.REQUIRED_ERROR_MESSAGE)
}
