

import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
    ScrollView,
    ToastAndroid,
    Image,
    Keyboard
} from 'react-native';

import { base_url } from '../../APIs/constants';
import { SliderBox } from "react-native-image-slider-box";
import StarRating from 'react-native-star-rating';
import { Icon } from '@rneui/themed';

import { Stack, TextInput, Button, IconButton } from "@react-native-material/core";

import {
    SkypeIndicator,
} from 'react-native-indicators';

import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

import SelectDropdown from 'react-native-select-dropdown';


import { useNavigation } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, loadCartData, selectCart } from '../../Redux/cartSlice';
import { StorePlaceOrder } from '../../APIs/AppAPIs';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function StoreCart({ }) {

    const dispatch = useDispatch();


    const navigation = useNavigation();


    const oldCart = useSelector((state) => state.cart.cart);
    const [cart, setCart] = React.useState(oldCart);

    const [ValidationErrors, setValidationErrors] = React.useState({});

    const isLogged = useSelector((state) => state.user.isLogged)
    const name = useSelector((state) => state.user.name)
    const email = useSelector((state) => state.user.email)
    const mobile = useSelector((state) => state.user.phone)
    const uid = useSelector((state) => state.user.uid)

    const [clientName, setClientName] = React.useState(name);
    const [clientEmail, setClientEmail] = React.useState(email);
    const [clientMobile, setClientMobile] = React.useState(mobile);
    const [clientAddress, setClientAddress] = React.useState('');
    const [clientCity, setClientCity] = React.useState('');
    const [clientState, setClientState] = React.useState('');
    const [clientZip, setClientZip] = React.useState('');

    const [checkoutModal, setCheckoutModal] = React.useState(false);
    const [currentCheckout, setCurrentCheckout] = React.useState(0);



    const totalWithoutTax = cart.reduce((accumulator, currentValue) => parseFloat(accumulator) + (parseFloat(currentValue.price) * parseFloat(currentValue.quantity)), 0);

    const totalTax = Math.round(cart.reduce((accumulator, currentValue) => accumulator + (parseFloat(currentValue.sales_tax) / 100) * parseFloat(currentValue.price) * parseFloat(currentValue.quantity), 0));


    const handleSetCartQuantity = (product, quantity) => {
        const existingProductIndex = cart.findIndex((item) => item.id === product.id && item.variant === product.variant);
        const updatedCart = JSON.parse(JSON.stringify(cart));
        updatedCart[existingProductIndex].quantity = quantity;
        setCart(updatedCart);
    };

    const handleRemoveFromCart = (product) => {
        const updatedCart = cart.filter((item) => !(item.id === product.id && item.variant === product.variant));
        setCart(updatedCart);
        dispatch(addToCart(updatedCart));
        ToastAndroid.show('Product Removed From Cart', ToastAndroid.SHORT);
    };

    const handleUpdateCart = () => {
        dispatch(addToCart(cart));
        ToastAndroid.show('Cart Updated Successfully', ToastAndroid.SHORT);
    };

    const handleEmptyCart = () => {
        setCart([]);
        dispatch(addToCart([]));
        ToastAndroid.show('Cart Emptied Successfully', ToastAndroid.SHORT);
    };

    const handleCheckout = () => {
        dispatch(addToCart(cart));

        setCheckoutModal(true);

    };


    const handleBackCheckout = () => {
        if (currentCheckout === 0) {
            setCheckoutModal(false)
        }
        else {
            setCurrentCheckout(currentCheckout - 1)
        }
    }



    const [bookingOrderModal, setBookingOrderModal] = React.useState(false);
    const [transportBooked, setTransportBooked] = React.useState(false);
    const [bookingOrder, setBookingOrder] = React.useState(false);
    const [bookedBooking, setBookedBooking] = React.useState({});

    const isMailValid = email => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(email)) {
            return true;
        } else {
            return false;
        }
    };

    const handleNextCheckout = () => {
        setValidationErrors({});
        if (currentCheckout === 0) {
            setCurrentCheckout(1);
        }
        else if (currentCheckout === 1) {

            if (!clientName.trim()) {
                setValidationErrors({
                    name: 'Please enter valid name'
                })
            }
            else if (!clientEmail.trim()) {
                setValidationErrors({
                    email: 'Please enter valid mail address'
                })
            }
            else if (!isMailValid(clientEmail)) {
                setValidationErrors({
                    email: 'Please enter valid mail address'
                })
            }
            else if (!clientMobile.trim()) {
                setValidationErrors({
                    mobile: 'Please enter valid mobile number'
                })
            }
            else if (!clientAddress.trim()) {
                setValidationErrors({
                    address: 'Please enter valid address'
                })
            } else if (!clientCity.trim()) {
                setValidationErrors({
                    city: 'Please enter valid city'
                })
            } else if (!clientState.trim()) {
                setValidationErrors({
                    state: 'Please enter valid state'
                })
            }

            else
                setCurrentCheckout(2);
        }
        else if (currentCheckout === 2) {
            setCurrentCheckout(3);
        }
        else if (currentCheckout === 3) {

            setTransportBooked(false);
            setBookingOrder(true);
            setBookingOrderModal(true);

            const finalData = {
                client_name: clientName,
                client_email: clientEmail,
                client_mobile: clientMobile,
                client_address: clientAddress,
                client_city: clientCity,
                client_state: clientState,
                client_zip: clientZip,
                subtotal: totalWithoutTax,
                tax: totalTax,
                total: (totalWithoutTax + totalTax),

                order_lines: cart.map((prod) => ({
                    product_id: prod.id,
                    product_name: prod.name,
                    product_variant: prod.variant,
                    product_price: prod.price,
                    quantity: prod.quantity,
                    product_sales_tax: prod.sales_tax

                }))

            }

            StorePlaceOrder(finalData)
                .then(res => {
                    setBookingOrder(false)
                    setTransportBooked(res.data.booked)
                    setBookedBooking(res.data.data);
                    handleEmptyCart();
                })
                .catch(err => {
                    setBookingOrder(false)
                    setTransportBooked(err?.response?.data?.booked)
                    console.log('HotelErr', err?.response?.data);

                });

        }
    }


    const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);




    return (

        <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>



            <Modal
                animationType="slide"
                transparent={true}
                visible={bookingOrderModal}
                onRequestClose={() => {
                    if (!bookingOrder) {
                        setBookingOrderModal(!bookingOrderModal);
                    }
                }}>
                <View style={[styles.modalBookingOverlay, { paddingBottom: 30 }]}>
                    <View style={[styles.modalBooking, { paddingBottom: 30 }]}>
                        <View>
                            {/* <Text style={{ color: commonStylesSheet.modalsText, fontSize: 20 }}>Order</Text> */}
                        </View>
                        <View>
                            {bookingOrder ?
                                <SkypeIndicator color={commonStylesSheet.darkBackground} count={6} size={50} />

                                :
                                transportBooked ?
                                    <>
                                        <Icon type='material-community' iconProps={{ style: { fontSize: 50, color: commonStylesSheet.darkBackground, marginVertical: 20 } }} name='check-all' />
                                        <Text style={{ fontStyle: 'italic', fontSize: 40, color: commonStylesSheet.darkBackground, textAlign: 'center' }}>
                                            {bookedBooking.name}
                                        </Text>
                                        <Text style={{ fontStyle: 'italic', fontSize: 20, color: commonStylesSheet.modalsText, marginTop: 30, textAlign: 'center' }}>
                                            Thank you so much for your order, we hope you love your time with us
                                        </Text>
                                    </>
                                    :
                                    <>
                                        <Icon type='material-community' iconProps={{ style: { fontSize: 50, color: commonStylesSheet.errorText, marginVertical: 20 } }} name='close-circle-outline' />
                                        <Text style={{ fontStyle: 'italic', fontSize: 20, color: commonStylesSheet.errorText }}>
                                            Order Placement Failed
                                        </Text>
                                    </>

                            }

                        </View>
                        {transportBooked ?
                            <TouchableOpacity onPress={() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Home' }],
                                });
                            }} style={[styles.modalSearchButton, { position: 'absolute', bottom: 80 }]}>
                                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Back To Home</Text>
                            </TouchableOpacity>

                            :
                            <TouchableOpacity onPress={() => setBookingOrderModal(false)} style={[styles.modalSearchButton, { position: 'absolute', bottom: 80 }]}>
                                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Back</Text>
                            </TouchableOpacity>


                        }
                    </View>
                </View>
            </Modal >



            {checkoutModal &&

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={checkoutModal}
                    onRequestClose={() => {
                        setCheckoutModal(!checkoutModal);
                    }}>
                    <View style={styles.modalView}>
                        <View>
                            <View style={styles.modalHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Icon type='ionicon' name='arrow-back' onPress={() => handleBackCheckout()} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />
                                    <Text style={[{ fontSize: 20, color: commonStylesSheet.modalsText, marginLeft: 10 }]}>Shopping Checkout</Text>
                                </View>


                                <View style={styles.tabContainer}>
                                    <View style={styles.tabButton}>
                                        {currentCheckout === 0 ?
                                            <Icon type='material-community' name='circle-slice-8' iconProps={{ style: [styles.tabIcon, { color: commonStylesSheet.darkBackground }] }} />
                                            :
                                            <Icon type='material-community' name='circle-outline' iconProps={{ style: styles.tabIcon }}
                                                onPress={() => {
                                                    if (currentCheckout > 0) {
                                                        setCurrentCheckout(0)
                                                    }
                                                }}
                                            />
                                        }
                                        <Text style={currentCheckout === 0 ? [styles.tabText, { color: commonStylesSheet.darkBackground }] : styles.tabText}>Review</Text>
                                    </View>
                                    <View style={styles.tabButton}>
                                        {currentCheckout === 1 ?
                                            <Icon type='material-community' name='circle-slice-8' iconProps={{ style: [styles.tabIcon, { color: commonStylesSheet.darkBackground }] }} />
                                            :
                                            <Icon type='material-community' name='circle-outline' iconProps={{ style: styles.tabIcon }}
                                                onPress={() => {
                                                    if (currentCheckout > 1) {
                                                        setCurrentCheckout(1)
                                                    }
                                                }}
                                            />
                                        }
                                        <Text style={currentCheckout === 1 ? [styles.tabText, { color: commonStylesSheet.darkBackground }] : styles.tabText}>Personal Info</Text>
                                    </View>
                                    <View style={styles.tabButton}>
                                        {currentCheckout === 2 ?
                                            <Icon type='material-community' name='circle-slice-8' iconProps={{ style: [styles.tabIcon, { color: commonStylesSheet.darkBackground }] }} />
                                            :
                                            <Icon type='material-community' name='circle-outline' iconProps={{ style: styles.tabIcon }}
                                                onPress={() => {
                                                    if (currentCheckout > 2) {
                                                        setCurrentCheckout(2)
                                                    }
                                                }}
                                            />
                                        }
                                        <Text style={currentCheckout === 2 ? [styles.tabText, { color: commonStylesSheet.darkBackground }] : styles.tabText}>Payment</Text>
                                    </View>
                                    <View style={styles.tabButton}>
                                        {currentCheckout === 3 ?
                                            <Icon type='material-community' name='circle-slice-8' iconProps={{ style: [styles.tabIcon, { color: commonStylesSheet.darkBackground }] }} />
                                            :
                                            <Icon type='material-community' name='circle-outline' iconProps={{ style: styles.tabIcon }} />
                                        }
                                        <Text style={currentCheckout === 3 ? [styles.tabText, { color: commonStylesSheet.darkBackground }] : styles.tabText}>Order</Text>
                                    </View>

                                </View>
                            </View>

                            <View style={styles.modalBodyResults}>
                                {/* <View style={{ flexDirection: 'row' }}> */}

                                <ScrollView contentContainerStyle={{ borderWidth: 0, paddingBottom: isKeyboardVisible ? 270 : currentCheckout === 3 ? 80 : currentCheckout === 1 ? 80  : 0, }} showsVerticalScrollIndicator={false}>
                                    {/* <View style={{ flexGrow: 1 }}> */}
                                    {
                                        currentCheckout === 0 ?
                                            <View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                    <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>Subtotal</Text>
                                                    <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>PKR {totalWithoutTax.toLocaleString()}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                    <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>Sales Tax</Text>
                                                    <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>PKR {totalTax.toLocaleString()}
                                                    </Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: commonStylesSheet.modalsText, paddingTop: 5 }}>
                                                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Total</Text>
                                                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>PKR {(totalWithoutTax + totalTax).toLocaleString()}
                                                    </Text>
                                                </View>

                                            </View>
                                            : currentCheckout === 1 ?

                                                <View>
                                                    <TextInput
                                                        label='Name'
                                                        variant='filled'
                                                        style={[{ marginBottom: 0, }]}
                                                        color='black'
                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientName}
                                                        value={clientName}
                                                    />
                                                    {
                                                        ValidationErrors['name'] &&
                                                        <Text style={{ marginBottom: 1, color: commonStylesSheet.errorText }}>{ValidationErrors['name']}</Text>
                                                    }

                                                    <TextInput
                                                        label='Email'

                                                        variant='filled'
                                                        style={[{ marginTop: 8, }]}
                                                        color='black'
                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientEmail}
                                                        value={clientEmail}

                                                        keyboardType='email-address'
                                                    />
                                                    {
                                                        ValidationErrors['email'] &&
                                                        <Text style={{ marginBottom: 1, color: commonStylesSheet.errorText }}>{ValidationErrors['email']}</Text>
                                                    }
                                                    <TextInput
                                                        label='Mobile'
                                                        variant='filled'
                                                        style={[{ marginTop: 8, }]}
                                                        color='black'
                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientMobile}
                                                        value={clientMobile}

                                                        keyboardType='phone-pad'
                                                    />
                                                    {
                                                        ValidationErrors['mobile'] &&
                                                        <Text style={{ marginBottom: 1, color: commonStylesSheet.errorText }}>{ValidationErrors['mobile']}</Text>
                                                    }
                                                    <TextInput
                                                        label='Address'
                                                        variant='filled'
                                                        style={[{ marginTop: 8, }]}
                                                        color='black'
                                                        multiline
                                                        numberOfLines={3}

                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3, paddingTop: 25 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientAddress}
                                                        value={clientAddress}

                                                    />
                                                    {
                                                        ValidationErrors['address'] &&
                                                        <Text style={{ marginBottom: 1, color: commonStylesSheet.errorText }}>{ValidationErrors['address']}</Text>
                                                    }
                                                    <TextInput
                                                        label='City'
                                                        variant='filled'
                                                        style={[{ marginTop: 8, }]}
                                                        color='black'
                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientCity}
                                                        value={clientCity}
                                                    />
                                                    {
                                                        ValidationErrors['city'] &&
                                                        <Text style={{ marginBottom: 1, color: commonStylesSheet.errorText }}>{ValidationErrors['city']}</Text>
                                                    }
                                                    <TextInput
                                                        label='State'
                                                        variant='filled'
                                                        style={[{ marginTop: 8, }]}
                                                        color='black'
                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientState}
                                                        value={clientState}
                                                    />
                                                    {
                                                        ValidationErrors['state'] &&
                                                        <Text style={{ marginBottom: 1, color: commonStylesSheet.errorText }}>{ValidationErrors['state']}</Text>
                                                    }
                                                    <TextInput
                                                        label='Zip'
                                                        variant='filled'
                                                        style={[{ marginTop: 8, }]}
                                                        color='black'
                                                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                                                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                                                        placeholderTextColor={commonStylesSheet.muteText}
                                                        onChangeText={setClientZip}
                                                        value={clientZip}

                                                        keyboardType='numeric'
                                                    />



                                                </View>

                                                : currentCheckout === 2 ?

                                                    <View>

                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, backgroundColor: commonStylesSheet.darkForeground, paddingVertical: 20, paddingHorizontal: 10, borderRadius: 12, ...commonStylesSheet.ThreeD }}>
                                                            <Text style={{ fontSize: 20, color: commonStylesSheet.modalsText }}>Cash On Delivery</Text>
                                                            <Icon type='material-community' name='circle-slice-8' iconProps={{ style: [styles.tabIcon, { color: commonStylesSheet.darkBackground }] }} />
                                                        </View>

                                                    </View>

                                                    :
                                                    <View>

                                                        <View showsVerticalScrollIndicator={false} horizontal={false} contentContainerStyle={{ paddingBottom: 200 }}>
                                                            <View style={{ flexDirection: 'column', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: commonStylesSheet.modalsText, paddingBottom: 8 }}>
                                                                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 5 }}>Person</Text>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{clientName}</Text>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{clientMobile}</Text>
                                                            </View>

                                                            <View style={{ flexDirection: 'column', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: commonStylesSheet.modalsText, paddingBottom: 8 }}>
                                                                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 5 }}>Payment</Text>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>Cash On Delivery</Text>
                                                            </View>

                                                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 5 }}>Products</Text>
                                                            {
                                                                cart.map((prod, index) => (
                                                                    <View key={index} style={{ flexDirection: 'row', position: 'relative', backgroundColor: commonStylesSheet.darkForeground, marginHorizontal: 0, marginVertical: 5, borderRadius: 12, padding: 0, ...commonStylesSheet.ThreeD }}>
                                                                        <Image src={prod.image} style={{ flex: 1, height: 100, maxWidth: 90, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, marginLeft: 0 }} resizeMode='stretch' />
                                                                        <View style={{ flexDirection: 'column', margin: 5, flex: 2, justifyContent: 'space-around' }}>
                                                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: commonStylesSheet.modalsText }} numberOfLines={2} ellipsizeMode="tail">{prod.name}</Text>
                                                                            <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginTop: 1 }} numberOfLines={2} ellipsizeMode="tail">{prod.variant}</Text>


                                                                            <View style={[styles.counterContainer, { position: 'relative' }]}>

                                                                                <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginHorizontal: 2 }}>{prod.quantity}</Text>

                                                                                <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, }}> x {prod.price}</Text>
                                                                                <Text style={{ fontSize: 16, fontWeight: '500', color: commonStylesSheet.modalsText, position: 'absolute', right: 4, zIndex: 99 }}>PKR {(prod.quantity * prod.price).toLocaleString()}</Text>
                                                                            </View>

                                                                        </View>
                                                                    </View>
                                                                ))
                                                            }

                                                            <View style={{ flexDirection: 'column', marginTop: 10, borderTopWidth: 1, borderTopColor: commonStylesSheet.modalsText, paddingTop: 8 }}>
                                                                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 5 }}>Order Summary</Text>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>Subtotal</Text>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>PKR {totalWithoutTax.toLocaleString()}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>Sales Tax</Text>
                                                                <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>PKR {totalTax.toLocaleString()}
                                                                </Text>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: commonStylesSheet.modalsText, paddingTop: 5 }}>
                                                                <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>Total</Text>
                                                                <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>PKR {(totalWithoutTax + totalTax).toLocaleString()}
                                                                </Text>
                                                            </View>

                                                        </View>

                                                    </View>
                                    }
                                    {/* </View> */}


                                </ScrollView>
                                <TouchableOpacity onPress={() => handleNextCheckout()} style={[styles.modalSearchButton, { position: 'absolute', bottom: 0 }]}>
                                    {
                                        currentCheckout < 3 ?
                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Continue</Text>
                                            : <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Place Order</Text>
                                    }
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>
                </Modal>

            }


            {cart.length > 0 ?


                <View style={{ minHeight: screenHeight - 145 }} >
                    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
                        {
                            cart.map((prod, index) => (
                                <View key={index} style={{ flexDirection: 'row', position: 'relative', backgroundColor: commonStylesSheet.darkForeground, marginHorizontal: 5, marginVertical: 5, borderRadius: 12, padding: 0, ...commonStylesSheet.ThreeD }}>
                                    <Image src={prod.image} style={{ flex: 1, height: 100, maxWidth: 90, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, marginLeft: 0 }} resizeMode='stretch' />
                                    <View style={{ flexDirection: 'column', margin: 5, flex: 2, justifyContent: 'space-around' }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: commonStylesSheet.modalsText }} numberOfLines={2} ellipsizeMode="tail">{prod.name}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginTop: 1 }} numberOfLines={2} ellipsizeMode="tail">{prod.variant}</Text>


                                        <View style={[styles.counterContainer, { position: 'relative' }]}>
                                            <View style={styles.counterButtons}>
                                                <Icon type='material-community' name='minus' iconStyle={styles.counterIcons}
                                                    disabled={prod.quantity <= 1}
                                                    onPress={() => handleSetCartQuantity(prod, prod.quantity - 1)}
                                                />
                                                <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginHorizontal: 2 }}>{prod.quantity}</Text>
                                                <Icon type='material-community' name='plus' iconStyle={styles.counterIcons}
                                                    disabled={prod.quantity >= 30}
                                                    onPress={() => handleSetCartQuantity(prod, prod.quantity + 1)}
                                                />
                                            </View>
                                            <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, }}> x {prod.price}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: commonStylesSheet.modalsText, position: 'absolute', right: 4, zIndex: 99 }}>PKR {(prod.quantity * prod.price).toLocaleString()}</Text>
                                        </View>

                                    </View>
                                    <View style={{ position: 'absolute', right: 5, top: 5, zIndex: 99 }}>
                                        <TouchableOpacity onPress={() => handleRemoveFromCart(prod)} style={{ backgroundColor: commonStylesSheet.darkForeground, paddingHorizontal: 8, borderRadius: 20 }}>
                                            <Icon type='material-community' name='trash-can-outline' iconStyle={{ color: commonStylesSheet.errorText }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20, marginBottom: 100 }}>
                            <TouchableOpacity onPress={() => handleEmptyCart()} style={{ backgroundColor: commonStylesSheet.darkForeground, borderRadius: 8, borderWidth: 1, borderColor: commonStylesSheet.errorText, width: 'fit-content', alignItems: 'center', padding: 12, ...commonStylesSheet.ThreeD }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.errorText }}>
                                    Empty Cart
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdateCart()} style={{ backgroundColor: commonStylesSheet.darkForeground, borderRadius: 8, borderWidth: 1, borderColor: commonStylesSheet.darkBackground, width: 'fit-content', alignItems: 'center', padding: 12, ...commonStylesSheet.ThreeD }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.darkBackground }}>
                                    Update Cart
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                    <View style={{ position: 'absolute', bottom: 0, width: screenWidth, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: commonStylesSheet.modalsText, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#D3D3D3', paddingVertical: 10, }}>

                        <Text style={{ fontSize: 24, fontWeight: 500, color: commonStylesSheet.modalsText, marginTop: 10 }}>
                            Total: PKR {totalWithoutTax.toLocaleString()}
                        </Text>

                        <TouchableOpacity onPress={() => handleCheckout()} style={{ backgroundColor: commonStylesSheet.darkBackground, borderRadius: 8, flexDirection: 'row', alignItems: 'center', padding: 12, ...commonStylesSheet.ThreeD }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.darkForeground }}>
                                Checkout
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

                :
                <View style={{ backgroundColor: commonStylesSheet.screenBackground, width: screenWidth, height: screenHeight, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon type='material-community' name='cart-outline' iconStyle={{ color: commonStylesSheet.modalsText, fontSize: 30 }} />
                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 25, fontWeight: 'bold' }}>Your Cart is Empty</Text>
                </View>
            }

        </View>
    );

}

export default StoreCart;




const styles = StyleSheet.create({

    modalSearchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        width: (screenWidth * 90) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center',


        ...commonStylesSheet.ThreeD


    },

    textHeading: {
        fontSize: 20,
        // color: commonStylesSheet.modalsText, 
        color: 'black',
        fontWeight: 'bold',
        marginTop: 20, marginBottom: 10
    },


    cartButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 4,
        width: 'fit-content',
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: commonStylesSheet.darkBackground
    },
    modalView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 100,
        backgroundColor: commonStylesSheet.screenBackground,
        minHeight: screenHeight,
        width: screenWidth,

    },
    modalBoody: {
        flexDirection: 'column',
        // paddingHorizontal: 15,
        paddingVertical: 15,
        height: screenHeight
    },
    modalBodyResults: {
        // backgroundColor: commonStylesSheet.darkForeground,
        flexDirection: 'column',
        paddingHorizontal: 15,
        marginVertical: 15,
        height: screenHeight - 200
    },
    modalHeader: {
        left: 0,
        flexDirection: 'column',
        width: screenWidth,
        borderBottomWidth: 0.3,
        borderColor: commonStylesSheet.muteText,
        backgroundColor: commonStylesSheet.darkForeground,
        paddingTop: 35,
        paddingBottom: 15,
        paddingHorizontal: 10,
        alignItems: 'flex-start'
    },

    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: commonStylesSheet.darkForeground,
    },
    counterButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: commonStylesSheet.muteText,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginHorizontal: 1

    },

    counterIcons: {

        fontSize: 20, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground

    },


    modalBooking: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: 100,
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 35,
        height: 250,
        width: 300,
        alignItems: 'center',

        height: screenHeight,
        width: screenWidth
    },

    modalBookingOverlay: {
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',

        height: screenHeight,
        width: screenWidth,
        backgroundColor: '#D3D3D3CC'

    },

    inlineFeatures: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    inlineFeaturesIcon: {
        marginRight: 2
    },


    dropDownButton: {
        width: '100%',
        borderWidth: 0,
        borderBottomWidth: 1.4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: commonStylesSheet.darkForeground,
        borderColor: commonStylesSheet.muteText,
        paddingLeft: 10,
        marginVertical: 5
    },



    tabContainer: {
        minWidth: '100%',
        flexDirection: 'row',
        paddingHorizontal: 5,
        justifyContent: 'space-between',
        height: 'fit-content',
        maxHeight: 120,
        // paddingHorizontal: 10

    },
    tabButton: {
        width: 'fit-content',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 16,
        marginRight: 2,
        color: commonStylesSheet.muteText
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: commonStylesSheet.muteText
    }

});
