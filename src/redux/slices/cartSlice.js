import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        state: [''], 
        cart: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId, quantity, totalInStock, size, color } = action.payload
            const res = state.cart.find(p => (p.productId === productId && p.size === size))
            if(res) {
                if(res.quantity + quantity > totalInStock) {
                    state.state = ['Out of stock']
                }
                else {
                    const newRes = state.cart.find(p => (p.productId === productId && p.size === size && p.color._id === color._id))
                    if(newRes) {
                        newRes.quantity += quantity
                        newRes.amount += quantity * newRes.unitPrice
                    }
                    else {
                        state.cart.push(action.payload)
                    }
                    state.state = ['Succeccfully added']
                }
            }
            else {
                state.cart.push(action.payload)
                state.state = ['Succeccfully added']
            }
        }, 
        removeProduct: (state, action) => {
            state.cart.splice(action.payload, 1)
        },
        increaseQuantity: (state, action) => {
            state.cart[action.payload].quantity++
            state.cart[action.payload].amount = state.cart[action.payload].unitPrice * state.cart[action.payload].quantity
        },
        decreaseQuantity: (state, action) => {
            state.cart[action.payload].quantity--
            state.cart[action.payload].amount = state.cart[action.payload].unitPrice * state.cart[action.payload].quantity
        },
        clearState: (state, action) => {
            state.state = ['']
        },
        clearCart: (state, action) => {
            return {state: [], cart: []}
        }
    }
})

export const { addToCart, removeProduct, increaseQuantity, decreaseQuantity, clearState, clearCart } = cartSlice.actions
export default cartSlice.reducer