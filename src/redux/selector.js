import { createSelector } from "@reduxjs/toolkit";

const authSelectorSelf = state => state.auth
const cartSelectorSelf = state => state.cart

// auth selector
export const userSelector = createSelector(authSelectorSelf, auth => auth?.user ? auth.user:null)
export const adminSelector = createSelector(authSelectorSelf, auth => auth?.admin ? auth.admin:null)

// cart selector
export const cartQuantitySelector = createSelector(cartSelectorSelf, cart => cart.cart ? cart.cart.reduce((total, current) => 
    total + current.quantity
, 0): 0)
export const cartInFoSelector = createSelector(cartSelectorSelf, cart => cart?.cart ? (cart.cart.length !== 0 ? cart.cart: []):[])
export const cartStateSelector = createSelector(cartSelectorSelf, cart => cart?.state ? cart.state:null)