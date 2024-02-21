import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useSelector, useDispatch } from 'react-redux';


const initialState = {
    uid: -1,
    uname: '',
    name: '',
    email: '',
    phone: '',
    isLogged: false,
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUid: (state, action) => {
            state.uid = action.payload
        },
        setUname: (state, action) => {
            state.uname = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPhone: (state, action) => {
            state.phone = action.payload
        },
        setIsLogged: (state, action) => {
            state.isLogged = action.payload
        },

        logout: () => initialState
    },
});

export const { setUid, setUname, setName, setEmail, setPhone, setIsLogged, logout } = userSlice.actions;





// const dispatch = useDispatch()

export const saveUserData = (userData) => async (dispatch) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        dispatch(setUid(userData.uid));
        dispatch(setUname(userData.uname));
        dispatch(setName(userData.name));
        dispatch(setEmail(userData.email));
        dispatch(setPhone(userData.phone));
        dispatch(setIsLogged(userData.logged));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

export const logUserOut = () => async (dispatch) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(initialState));
        dispatch(logout());
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

export const loadUserData = () => async (dispatch) => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            dispatch(setUid(userData.uid));
            dispatch(setUname(userData.uname));
            dispatch(setName(userData.name));
            dispatch(setEmail(userData.email));
            dispatch(setPhone(userData.phone));
            dispatch(setIsLogged(userData.logged));
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
};







export default userSlice.reducer