import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    useColorScheme,
    View,
    Image,
    TouchableOpacity,
    Modal,
    ToastAndroid
} from 'react-native';

import { Stack, TextInput, Button, IconButton } from "@react-native-material/core";
import { BookRoom, BookTour, BookTransport, UserSignup } from '../../APIs/AppAPIs';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

import { useSelector, useDispatch } from 'react-redux';

import { saveUserData } from '../../Redux/userSlice';

import {
    SkypeIndicator,
} from 'react-native-indicators';

import { Icon } from '@rneui/themed';
import { useRoute } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function CreateAccount({ navigation }) {


    const dispatch = useDispatch()
    const route = useRoute();


    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [mobile, setMobile] = React.useState('');
    const [password, setPassword] = React.useState('');
    // const [password1, setPassword1] = React.useState('');


    const { bookTour, tourID, bookTransport, transportData, bookRoom, roomData } = route.params || {};


    const [loadingModal, setLoadingModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [created, setCreated] = React.useState(false);
    const [response, setResponse] = React.useState({});


    const successResponse = succRes => {
        if (succRes.status === 200) {
            console.log(succRes.data.data)

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
                        ToastAndroid.show('Login & Query Forwarded Successfully', ToastAndroid.SHORT)
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
                ToastAndroid.show('Account Created & Login Successfully', ToastAndroid.SHORT)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }



            // console.log(succRes.data);

            // setResponse(succRes?.data?.data)
            // setCreated(succRes?.status)
            // setLoading(false);
        }
    };
    const handleSignup = () => {
        setResponse({});
        setCreated(false);
        setLoading(true);
        setLoadingModal(true);


        const finalData = {
            uid: 0,
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone: mobile,
            status: true,
            password: password
        };
        UserSignup(finalData)
            .then(res => successResponse(res))
            .catch(err => {
                // console.log('LoginErr', err);
                // console.log('LoginErr', err?.response?.data);

                setResponse(err?.response?.data)
                setCreated(false)
                setLoading(false);

            });

    }
    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
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
                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 20 }}>Signing up</Text>
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
                                            You can log in as: {response?.email}
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


            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>

                <Image source={require('../../Images/cms_logo.png')} style={{ width: 140, height: 80, resizeMode: 'contain', marginTop: (5 / 100) * screenHeight }} resizeMethod='resize' />
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', marginVertical: 30 }}>Sign up</Text>


                <TextInput
                    label='First name'
                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}

                    onChangeText={setFirstName}
                    value={firstName}
                />

                <TextInput
                    label='Last name'
                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}

                    onChangeText={setLastName}
                    value={lastName}
                />


                <TextInput
                    label='Email'
                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}

                    onChangeText={setEmail}
                    value={email}
                    keyboardType='email-address'
                />

                <TextInput
                    label='Mobile'
                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}

                    onChangeText={setMobile}
                    value={mobile}
                    keyboardType='phone-pad'
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

                {/* <TextInput
                    label='Confirm Password'
                    variant='filled'
                    style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                    color='black'
                    inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                    inputContainerStyle={{ backgroundColor: '#00000000' }}
                    placeholderTextColor={commonStylesSheet.muteText}
                    secureTextEntry
                    onChangeText={setPassword1}
                    value={password1}

                /> */}


                <TouchableOpacity style={[styles.loginButton]} onPress={() => handleSignup()}>
                    <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Sign up & Login</Text>
                </TouchableOpacity>


                <View style={{ flexDirection: 'row', justifyContent: 'center', width: (95 / 100) * screenWidth, marginBottom: 20, marginTop: 10 }}>
                    <Button variant="text" title="Have an Account" onPress={handleLogin} color={commonStylesSheet.muteText} uppercase={false} />
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
        backgroundColor: commonStylesSheet.screenBackground
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


export default CreateAccount;
