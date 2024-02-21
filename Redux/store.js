import { configureStore } from '@reduxjs/toolkit'
import  userReducer , { loadUserData } from './userSlice';
import cartReducer, { loadCartData } from './cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer
  },
})


store.dispatch(loadUserData());
store.dispatch(loadCartData());