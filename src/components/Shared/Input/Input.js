import { memo } from 'react'
import styles from './Input.module.css'

function Input(props) {
    return (
        <input
            value = {props.value}
            onChange = {props.onChange}
            name = {props.name}
            id = {props.id}
            type = {props.type}
            className = {styles.input}
            placeholder = {props.placeholder}
            style={props.style}
        />
    )
}

export default memo(Input)