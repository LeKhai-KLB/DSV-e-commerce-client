import { memo } from 'react'
import styles from './Input.module.css'

function Input({required, name, register, readOnly, ...props}) {
    return (
        <input
            name = {name}
            type = {props.type}
            className = {`${styles.input} ${props.invalid ? styles.errorStateStyle:''}`}
            placeholder = {props.placeholder}
            style={props.style}
            {...register(name, {required: required})}
            spellCheck={false}
            readOnly={readOnly ? true:false}
        />
    )
}

export default memo(Input)