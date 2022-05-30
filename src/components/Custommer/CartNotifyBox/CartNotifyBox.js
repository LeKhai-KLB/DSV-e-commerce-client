import { memo } from 'react'
import styles from './CartNotifyBox.module.css'
import { cartInFoSelector } from '../../../redux/selector'
import { useSelector } from 'react-redux' 

function CartNotifyBox() {
    return (
        <div className={styles.CartNotifyContainer} >
            
        </div>
    )
}

export default memo(CartNotifyBox)