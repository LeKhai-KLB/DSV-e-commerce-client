import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { 
persistStore, 
persistReducer,
FLUSH,
REHYDRATE,
PAUSE,
PERSIST,
PURGE,
REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'

const persistConfig = {
    key: 'root',
    storage
}

const reducer = combineReducers({
    auth: authReducer,
    cart: cartReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
})

export const persistor = persistStore(store)
export default store