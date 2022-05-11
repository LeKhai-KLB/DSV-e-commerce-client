import styles from './footer.module.css'
import { memo } from 'react'

function Footer() {
    return (
        <div className = {styles.footerContainer}></div>
    )
}

export default memo(Footer)