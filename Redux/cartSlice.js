import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';



import { useSelector, useDispatch } from 'react-redux';

const initialState = {
    cart: [],
}

export const cartSlice = createSlice({
    name: 'cartSlice',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
        },

    },
});

export const { setCart } = cartSlice.actions;

export const addToCart = (cartData) => async (dispatch) => {
    try {
        await AsyncStorage.setItem('cartData', JSON.stringify(cartData));

        dispatch(setCart(cartData));
    } catch (error) {
        console.error('Error saving cart data:', error);
    }
};

export const loadCartData = () => async (dispatch) => {
    try {
        const cartDataString = await AsyncStorage.getItem('cartData');
        if (cartDataString) {
            const cartData = JSON.parse(cartDataString);
            dispatch(setCart(cartData));
        }
    } catch (error) {
        console.error('Error loading cart data:', error);
    }
};


export default cartSlice.reducer