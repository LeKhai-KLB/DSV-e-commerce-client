import styles from './Footer.module.css'
import { memo } from 'react'

// image assets
import logo from '../../../assets/customer/logo.png'
import logo_2x from '../../../assets/customer/logo@2x.png'
import logo_3x from '../../../assets/customer/logo@3x.png'

function Footer() {
    return (
        <div className = {styles.footerContainer}>
            <div className={styles.contentContainer} >
                <div className={styles.topContainer} >
                    <img
                        src={logo}
                        srcSet={`${logo_2x}, ${logo_3x}`}
                        className={styles.logo}
                        alt="aware shop logo"
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(Footer)