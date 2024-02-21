import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    Image,
    useColorScheme,
    View,
    TouchableOpacity,
    Modal,
    ToastAndroid
} from 'react-native';

import { TextInput, Button, } from "@react-native-material/core";

import { BookRoom, BookTour, BookTransport, UserLogin } from '../../APIs/AppAPIs';


import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

import {
    SkypeIndicator,
} from 'react-native-indicators';

import { Icon } from '@rneui/themed';


import { useSelector, useDispatch } from 'react-redux';
// import { setUid, setUname, setName, setEmail, setPhone, setIsLogged } from '../../Redux/userSlice';

import { saveUserData } from '../../Redux/userSlice';
import { useRoute } from '@react-navigation/native';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


function Login({ navigation, setIsLoggedIn }) {
    const route = useRoute();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');


    const { bookTour, tourID, bookTransport, transportData, bookRoom, roomData } = route.params || {};



    const dispatch = useDispatch()

    const [loadingModal, setLoadingModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [created, setCreated] = React.useState(false);
    const [response, setResponse] = React.useState({});


    const handleLogin = () => {
        setResponse({});
        setCreated(false);
        setLoading(true);
        setLoadingModal(true);

        const successResponse = succRes => {
            if (succRes.status === 200) {
                dispatch(

                    saveUserData({
                        uid: succRes?.data?.data?.id,
                        name: `${succRes?.data?.data?.first_name} ${succRes?.data?.data?.last_name}`,
                        email: succRes?.data?.data?.email,
                        phone: succRes?.data?.data?.phone,
                        logged: true
                    })
                )


                if (bookTour) {
                    const finalData = {
                        tour: tourID,
                        client: succRes?.data?.data?.id
                    };

                    BookTour(finalData)
                        .then(res => {
                            ToastAndroid.show('Query Forwarded Successfully', ToastAndroid.SHORT)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        })
                        .catch(err => {

                            ToastAndroid.show('User Login But Query Forward Failed', ToastAndroid.SHORT)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        });
                }
                else if (bookTransport) {
                    const finalData = {
                        ...transportData,
                        client: succRes?.data?.data?.id,
                    }
                    BookTransport(finalData)
                        .then(res => {
                            ToastAndroid.show('Query Forwarded Successfully', ToastAndroid.SHORT)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        })
                        .catch(err => {

                            ToastAndroid.show('User Login But Query Forward Failed', ToastAndroid.SHORT)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        });
                }
                else if (bookRoom) {
                    const finalData = {
                        ...roomData,
                        client: succRes?.data?.data?.id,
                    }
                    BookRoom(finalData)
                        .then(res => {
                            ToastAndroid.show('Query Forwarded Successfully', ToastAndroid.SHORT)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        })
                        .catch(err => {

                            ToastAndroid.show('User Login But Query Forward Failed', ToastAndroid.SHORT)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        });
                }
                else {
                    ToastAndroid.show('User Login Successfully', ToastAndroid.SHORT)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                }


            }
        };

        UserLogin(username, password)
            .then(res => successResponse(res))
            .catch(err => {

                setResponse(err?.response?.data)
                setCreated(false)
                setLoading(false);

            });
    }
    const handleCreateAccount = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'CreateAccount', params: { bookTour: bookTour ? bookTour : false, tourID: tourID, bookTransport: bookTransport ? bookTransport : false, transportData: transportData, bookRoom: bookRoom ? bookRoom : false, roomData: roomData } }],
        });

    }
    const handleForgetPassword = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'ForgetPassword' }],
        });

    }

    return (

        <ScrollView contentContainerStyle={styles.container}>



            <Modal
                animationType="none"
                transparent={true}
                visible={loadingModal}
                onRequestClose={() => {
                    if (!loading) {
                        setLoadingModal(!loadingModal);
                    }
                }}>
                <TouchableOpacity style={[styles.modalBookingOverlay, { paddingBottom: 30 }]} onPress={() => {
                    if (!loading) {
                        setLoadingModal(!loadingModal);
                    }
                }}>
                    <View style={[styles.modalBooking, { paddingBottom: 30, height: loading ? 200 : 'auto' }]}>
                        <View>
                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 20 }}>Logging in</Text>
                        </View>
                        <View>
                            {loading ?
                                <SkypeIndicator color={commonStylesSheet.darkBackground} count={6} size={50} />
                                :
                                created ?
                                    <>
                                        <Icon type='material-community' iconProps={{ style: { fontSize: 30, color: commonStylesSheet.darkBackground, marginVertical: 20 } }} name='check-all' />
                                        <Text style={{ fontStyle: 'italic', fontSize: 18, color: commonStylesSheet.darkBackground }}>
                                            {/* {bookedBooking.name} */}
                                            Logged in
                                        </Text>
                                    </>
                                    :
                                    <>
                                        <Icon type='material-community' iconProps={{ style: { fontSize: 30, color: commonStylesSheet.errorText, marginVertical: 20 } }} name='close-circle-outline' />
                                        {
                                            response?.error_messages?.map((message, index) => (
                                                <View key={index} style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontStyle: 'italic', fontSize: 18, color: commonStylesSheet.errorText, marginBottom: 5, marginRight: 5 }}>
                                                        {index + 1}:
                                                    </Text>
                                                    <Text key={index} style={{ fontStyle: 'italic', fontSize: 18, color: commonStylesSheet.errorText, marginBottom: 5 }}>
                                                        {message}
                                                    </Text>
                                                </View>
                                            ))
                                        }
                                        {/* <Text style={{ fontStyle: 'italic', fontSize: 18, color: commonStylesSheet.errorText }}>
                                            {response?.error_messages ? response?.error_messages[0] : ''}
                                        </Text> */}
                                    </>

                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal >



            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flecx-start', }}>

                <Image source={require('../../Images/cms_logo.png')} style={{ width: 140, height: 80, resizeMode: 'contain', marginTop: (15 / 100) * screenHeight }} resizeMethod='resize' />
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', marginVertical: 30 }}>Welcome Back</Text>


                <TextInput
                    label='E-mail'

                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}

                    onChangeText={setUsername}
                    value={username}
                />

                <TextInput
                    label='Password'

                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />


                <TouchableOpacity style={[styles.loginButton]} onPress={() => handleLogin()}>
                    <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Log in</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: (95 / 100) * screenWidth, marginBottom: 20, marginTop: 10 }}>
                    <Button variant="text" title="Create Account" onPress={handleCreateAccount} color={commonStylesSheet.muteText} uppercase={false} />
                    <Button variant="text" title="Forgot Password?" onPress={handleForgetPassword} color={commonStylesSheet.muteText} uppercase={false} />
                </View>

            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({


    loginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 4,
        width: (screenWidth * 85) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center',
        marginVertical: 10
    },

    container: {
        flexGrow: 1,
        backgroundColor: commonStylesSheet.screenBackground,
    },




    modalBooking: {
        flexDirection: 'column',
        justifyContent: '',
        paddingBottom: 100,
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 35,
        // paddingHorizontal: 40,
        // height: '',
        // minHeight: 200,
        width: 300,
        alignItems: 'center',
    },

    modalBookingOverlay: {
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',

        height: screenHeight,
        width: screenWidth,
        backgroundColor: '#D3D3D3CC'

    }


});


export default Login;
