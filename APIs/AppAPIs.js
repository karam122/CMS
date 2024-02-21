
import { base_url } from "./constants";
import axios from 'axios';



//  AUTHENTICATION

export const UserLogin = async(username, password) =>{
    return await axios.post(`${base_url}/app/login-user/`, {
        email: username,
        password: password
    });
};

export const UserSignup = async(data) =>{
    return await axios.post(`${base_url}/app/register-user/`, data);
};

export const UserSendResetPassword = async(data) =>{
    return await axios.post(`${base_url}/app/send-reset-password/`, data);
};

export const UserVerifyResetPassword = async(data) =>{
    return await axios.post(`${base_url}/app/verify-otp/`, data);
};

export const UserResetPassword = async(data) =>{
    return await axios.post(`${base_url}/app/reset-password/`, data);
};




//   FEATURED


export const GetFeaturedTours = async() =>{
    return await axios.get(`${base_url}/app/featured-tours/`);
};

export const GetFeaturedHotels = async() =>{
    return await axios.get(`${base_url}/app/featured-hotels/`);
};

export const GetFeaturedTransports = async() =>{
    return await axios.get(`${base_url}/app/featured-transports/`);
};

export const GetFeaturedProducts = async() =>{
    return await axios.get(`${base_url}/app/featured-products/`);
};


//    SELECTORS


export const GetDistHotelLocs = async() =>{
    return await axios.get(`${base_url}/app/distinct-hotel-locations/`);
};

export const GetDistTransportLocs = async() =>{
    return await axios.get(`${base_url}/app/distinct-transport-locations/`);
};

export const GetRoomTypes = async() =>{
    return await axios.get(`${base_url}/app/room-types/`);
};

export const GetTransportTypes = async() =>{
    return await axios.get(`${base_url}/app/transport-types/`);
};


//   ROOMS

export const GetRoomsToBook = async(data) =>{
    return await axios.get(`${base_url}/app/rooms-to-book/`, {params: data});
};

export const GetRoomsToBookId = async(id) =>{
    return await axios.get(`${base_url}/app/rooms-to-book/${id}/`);
};

export const BookRoom = async(data) =>{
    return await axios.post(`${base_url}/app/book-room/`, data);
};




//    TRANSPORTS

export const GetTransportsToBook = async(data) =>{
    return await axios.get(`${base_url}/app/transports-to-book/`, {params: data});
};

export const GetTransportsToBookId = async(id) =>{
    return await axios.get(`${base_url}/app/transports-to-book/${id}/`);
};

export const BookTransport = async(data) =>{
    return await axios.post(`${base_url}/app/book-transport/`, data);
};



//    TOURS

export const GetToursToBook = async() =>{
    return await axios.get(`${base_url}/app/tours-to-book/`);
};

export const GetToursToBookId = async(id) =>{
    return await axios.get(`${base_url}/app/tours-to-book/${id}/`);
};

export const GetAgencyDetailsId = async(id) =>{
    return await axios.get(`${base_url}/app/agency-details/${id}/`);
};


export const BookTour = async(data) =>{
    return await axios.post(`${base_url}/app/book-tour/`, data);
};






//    STORE

export const GetStoreCats = async() =>{
    return await axios.get(`${base_url}/app/store/categories/`);
};

export const GetStoreProducts = async() =>{
    return await axios.get(`${base_url}/app/store/products/`);
};


export const GetStoreProductId = async(id) =>{
    return await axios.get(`${base_url}/app/store/products/${id}/`);
};



export const StorePlaceOrder = async(data) =>{
    return await axios.post(`${base_url}/store/place-order/`, data);
};


