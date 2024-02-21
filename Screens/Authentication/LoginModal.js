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
    Modal
} from 'react-native';

import { Stack, TextInput, Button, IconButton } from "@react-native-material/core";

import { UserLogin } from '../../APIs/AppAPIs';


import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

import {
    SkypeIndicator,
} from 'react-native-indicators';

import { Icon } from '@rneui/themed';


import { useSelector, useDispatch } from 'react-redux';
// import { setUid, setUname, setName, setEmail, setPhone, setIsLogged } from '../../Redux/userSlice';

import { saveUserData } from '../../Redux/userSlice';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


function LoginModal({ navigation, setIsLoggedIn }) {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');


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
                // dispatch(setUname(succRes?.data?.data?.username))
                // dispatch(setUid(succRes?.data?.data?.id))
                // dispatch(setEmail(succRes?.data?.data?.email))
                // dispatch(setName(`${succRes?.data?.data?.first_name} ${succRes?.data?.data?.last_name}`))
                // dispatch(setPhone(succRes?.data?.data?.email));
                // dispatch(setIsLogged(true));

                dispatch(

                    saveUserData({
                        uid: succRes?.data?.data?.id,
                        uname: succRes?.data?.data?.username,
                        name: `${succRes?.data?.data?.first_name} ${succRes?.data?.data?.last_name}`,
                        email: succRes?.data?.data?.email,
                        phone: succRes?.data?.data?.phone,
                        logged: true
                    })
                )

                // console.log(succRes.data);

                setResponse(succRes?.data?.data)
                setCreated(succRes?.status)
                setLoading(false);
                setLoadingModal(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
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
            routes: [{ name: 'CreateAccount' }],
        });

    }
    const handleForgetPassword = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'ForgetPassword' }],
        });

    }

    return (


        <Modal
            animationType="none"
            transparent={true}
            visible={loginModal}
            onRequestClose={() => {
                if (!loading) {
                    setLoadingModal(!loadingModal);
                }
            }}>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flecx-start', }}>

                    <Image source={require('../../Images/cms_logo.png')} style={{ width: 140, height: 80, resizeMode: 'contain', marginTop: (15 / 100) * screenHeight }} resizeMethod='resize' />
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', marginVertical: 30 }}>Welcome Back</Text>


                    <TextInput
                        label='User name'

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

        </Modal>
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


export default LoginModal;
