import { memo } from 'react'
import styles from './CartNotifyBox.module.css'
import { cartInFoSelector } from '../../../redux/selector'
import { useSelector } from 'react-redux' 
import { useNavigate } from 'react-router-dom'

import cartIcon from '../../../assets/shared/icon/cart.png'

function CartNotifyBox() {
    const cart = useSelector(cartInFoSelector)
    const nav = useNavigate()

    return (
        <div className={styles.CartNotifyContainer} >

            <img 
                src={cartIcon} 
                className={styles.cartIcon + ' ' + styles.activeStyle} 
                alt="cart"
            />
            <div className={styles.cartNotification + ' ' + styles.font} >{cart.length}</div> 

            <div className={styles.CartNotifyBox} >
                {/* top container */}
                <div className={styles.topContainer} >
                    {
                        cart.map((e,i) => (
                            <div key={i} className={styles.cartNotitfyItemContainer} >
                                <img className={styles.cartImage} src={e.productImage} alt=" " />
                                <div className={styles.cartInfoContainer} >
                                    <div className={styles.cartName}> 
                                        {e.productName}
                                    </div>
                                    <div className={styles.cartInfo} >
                                        <span className={styles.priceInfo}>${e.amount}</span>
                                        <span className={styles.generalInfo}>
                                            {e.size.toUpperCase()} • <span className={styles.capitalize}>{e.color.title}</span> • {e.quantity} pcs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                
                {/* bottom container */}
                <div className={styles.bottomContainer + ' ' + styles.activeStyle} onClick={() => nav('../cart')} > 
                    View cart
                </div>
            </div>
        </div>
    )
}

export default memo(CartNotifyBox)