import { memo, useContext } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { cartInFoSelector, userSelector } from "../../../redux/selector"
import { removeProduct, increaseQuantity, decreaseQuantity, clearCart } from '../../../redux/slices/cartSlice'
import { requiredAuthContext } from '../../../routes/Customer'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import styles from './cart.module.css'
import 'react-toastify/dist/ReactToastify.css'

// image asset
import placeholderImage from '../../../assets/shared/placeholder/placeholder.png'
import minusIcon from '../../../assets/shared/icon/minus.png'
import plusIcon from '../../../assets/shared/icon/plus.png'

function Cart() {
    const cartInfo = useSelector(cartInFoSelector)
    const user = useSelector(userSelector)
    const { toggleShowLoginBox } = useContext(requiredAuthContext)
    const dispatch = useDispatch()

    const handleCheckout = async () => {
        if(cartInfo.length !== 0) {
            if(!user) {
                toggleShowLoginBox()
            }
            else {
                try {
                    const cart = cartInfo.map(c => {
                        return {
                            product: c.productId,
                            options: {
                                color: c.color._id,
                                quantity: c.quantity,
                                size: c.size
                            },
                            amount: c.amount
                        }
                    })
                    const { data } = await axios.post(process.env.REACT_APP_ADD_ORDER_API, {
                        customer: user.id,
                        cart: [...cart]
                    }, {
                        headers: {
                            authorization: user.jwt
                        }
                    })
                    if(data.status === 200) {
                        toast.success('Order success')
                        dispatch(clearCart())
                    }
                    else {
                        throw new Error(data.errorMessage)
                    }
                }
                catch (err){
                    console.log(err)
                    toast.error(err.message)
                }
            }
        }
    }

    return (
        <div className={styles.cartPageContainer} >
            
            <ToastContainer />

            {/* My bag */}
            <span className={styles.myBag} >
                My Bag
            </span>

            {/* content container */}
            <div className={styles.contentContainer} >

                {/* table */}
                <div className={styles.cartTable} >

                    {/* table heading */}
                    <div className={styles.tableHeading} >
                        <span style={{paddingRight: '229px'}} >Product</span>
                        <span style={{paddingRight: '83px'}} >Color</span>
                        <span style={{paddingRight: '105px'}} >Size</span>
                        <span style={{paddingRight: '104px'}}>Quantity</span>
                        <span >Amount</span>
                    </div>

                    
                    {/* entries */}
                    <div className={styles.entriesContainer} >

                        {
                            cartInfo.length !== 0 ?
                            cartInfo.map((e, i) => (
                                
                                <div key={i} className={styles.entry} >
                                    {/* product field */}
                                    <div className={styles.productField} >
                                        <img 
                                            className={styles.productImage} 
                                            src={e.productImage === ''? placeholderImage:e.productImage} 
                                            alt=' ' 
                                        />
                                        <div className={styles.productTextBox} >
                                            <div className={styles.productTitle} >
                                                {e.productName}
                                            </div>
                                            <div className={styles.buttonsContainer} >
                                                <span>Change</span>
                                                <span 
                                                    onClick={() => {
                                                        dispatch(removeProduct(i))
                                                    }}
                                                >
                                                    Remove
                                                </span>
                                            </div>
                                        </div>
                                    </div>
        
                                    {/* color field */}
                                    <div className={styles.colorField} style={{backgroundColor: e.color.value}}  />
        
                                    {/* size filed */}
                                    <span className={styles.sizeField}>{e.size}</span>
        
                                    {/* quantity field */}
                                    <div className={styles.quantityField} >
                                        <img 
                                            className= {`${styles.largeIcon}`}
                                            src={minusIcon} 
                                            alt=' ' 
                                            style={{paddingLeft: '8px'}}
                                            onClick={() => { 
                                                const input = document.getElementById('input' + i)
                                                if(input.value > 1)
                                                    dispatch(decreaseQuantity(i))
                                            }}
                                        />
                                        <input 
                                            id={"input" + i}
                                            className={styles.quantityInput} 
                                            type="number" 
                                            readOnly={true}
                                            value={e.quantity}
                                        />
                                        <img 
                                            className= {`${styles.largeIcon}`} 
                                            src={plusIcon} 
                                            alt=' ' 
                                            style={{paddingRight: '8px'}}
                                            onClick={() => { 
                                                const input = document.getElementById('input' + i)
                                                if(Number(input.value) < e.totalInStock)
                                                    dispatch(increaseQuantity(i))
                                            }}
                                        />
                                    </div>
        
                                    {/* amount field */}
                                    <span className={styles.amountField}>
                                        ${e.amount}.00
                                    </span>
                                </div>

                            )):
                            <div className={styles.emptyEntry}> Empty </div>
                        }

      
                    </div>  

                </div>

                {/* total price container */}
                <div className={styles.totalPriceContainer} >

                    {/* total price title */}
                    <span className={styles.totalPriceTitle}>Total</span>

                    {/* total price info */}
                    <div className={styles.totalPriceInfo} >
                        <div className={styles.totalEntry}>
                            <span >Shipping & Handling:</span>
                            <span >Free</span>
                        </div>

                        <div className={styles.totalEntry}>
                            <span >Total product:</span>
                            <span >
                                ${
                                    cartInfo.reduce((total, current) => {return total + current.amount}, 0)
                                }.00
                            </span>
                        </div>

                        <div className={styles.subTotal}>
                            <span >Subtotal</span>
                            <span >
                                ${
                                    cartInfo.reduce((total, current) => {return total + current.amount}, 0)
                                }.00
                            </span>
                        </div>
                    </div>

                    {/* checkout button */}
                    <div className={styles.checkoutButton} onClick={() => handleCheckout()} >
                        Check out
                    </div>
                </div>

                

            </div>
        </div>
    )
}

export default memo(Cart)