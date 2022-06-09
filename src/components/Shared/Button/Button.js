import { memo } from 'react'
import styles from './Button.module.css'

function Button(props) {
    return (
        <button 
            className={`
                ${styles.button} 
                ${props?.isActive ? styles.activeButton:''} 
                ${props?.preventDefault ? styles.preventDefault:''}`
            }
            type={props.type}
            style={props.style}
        >   
            {props.children}
        </button>
    )
}

export default memo(Button) 