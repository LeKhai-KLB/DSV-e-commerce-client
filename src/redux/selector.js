import { createSelector } from "@reduxjs/toolkit";

const authSelectorSelf = state => state.auth

// auth selector
export const userSelector = createSelector(authSelectorSelf, auth => auth.user ? auth.user:null)
export const adminSelector = createSelector(authSelectorSelf, auth => auth.admin ? auth.admin:null)