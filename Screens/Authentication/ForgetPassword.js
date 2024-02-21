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
    ActivityIndicator
} from 'react-native';


import { Stack, TextInput, Button, IconButton } from "@react-native-material/core";
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';
import { UserResetPassword, UserSendResetPassword, UserVerifyResetPassword } from '../../APIs/AppAPIs';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function ForgetPassword({ navigation }) {


    const [email, setEmail] = React.useState('');
    const [OTP, setOTP] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [resetStep, setResetStep] = React.useState(0);

    const [loading, setLoading] = React.useState(false);

    const [error, setError] = React.useState('');

    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });

    }


    const handleSendResetPassword = () => {
        setLoading(true);
        setError('')
        const finalData = {
            email: email,
        };
        const successResponse = succRes => {
            if (succRes.status === 200) {
                setLoading(false)
                setResetStep(resetStep + 1)
            }
        };
        UserSendResetPassword(finalData)
            .then(res => successResponse(res))
            .catch(err => {
                setLoading(false)
                setError(err?.response?.data.error_messages[0])
            });
    }

    const handleVerifyPassword = () => {
        setLoading(true);
        setError('')
        const finalData = {
            email: email,
            otp: OTP
        };
        const successResponse = succRes => {
            if (succRes.status === 200) {
                setLoading(false)
                setResetStep(resetStep + 1)
            }
        };
        UserVerifyResetPassword(finalData)
            .then(res => successResponse(res))
            .catch(err => {
                setLoading(false)
                setError(err?.response?.data.error_messages[0])
            });
    }

    const handleResetPassword = () => {
        setLoading(true);
        setError('')
        const finalData = {
            email: email,
            otp: OTP,
            new_password: password
        };
        const successResponse = succRes => {
            if (succRes.status === 200) {
                setLoading(false)
                setResetStep(resetStep + 1)
            }
        };
        UserResetPassword(finalData)
            .then(res => successResponse(res))
            .catch(err => {
                setLoading(false)
                setError(err?.response?.data.error_messages[0])
            });
    }


    return (

        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>

                <Image source={require('../../Images/cms_logo.png')} style={{ width: 140, height: 80, resizeMode: 'contain', marginTop: (20 / 100) * screenHeight }} resizeMethod='resize' />
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'black', marginVertical: 30 }}>Reset Password</Text>

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
                {resetStep > 0 &&

                    <TextInput
                        label='OTP'
                        variant='filled'
                        style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                        color='black'
                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                        placeholderTextColor={commonStylesSheet.muteText}
                        onChangeText={setOTP}
                        value={OTP}
                        keyboardType='numeric'
                    />

                }
                {resetStep > 1 &&

                    <TextInput
                        label='New Password'
                        variant='filled'
                        style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, }]}
                        color='black'
                        inputStyle={{ backgroundColor: commonStylesSheet.darkForeground, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 3 }}
                        inputContainerStyle={{ backgroundColor: '#00000000' }}
                        placeholderTextColor={commonStylesSheet.muteText}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />

                }

                {resetStep === 0 ?
                    <Text style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, color: commonStylesSheet.muteText }]}>
                        Please enter your email. We will send you an OPT to access your account.
                    </Text>
                    : resetStep === 1 ?
                        <Text style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, color: commonStylesSheet.muteText }]}>
                            We have sent you an OTP on email, please verify.
                        </Text>
                        : resetStep === 2 ?
                            <Text style={[{ width: (85 / 100) * screenWidth, marginBottom: 10, color: commonStylesSheet.muteText }]}>
                                OTP verified, you can reset password now.
                            </Text>
                            : resetStep === 3 ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: (85 / 100) * screenWidth, justifyContent: 'flex-start' }}>
                                    <Text style={[{ marginBottom: 10, color: commonStylesSheet.darkBackground, }]}>
                                        Password reset successfully
                                    </Text>

                                    <TouchableOpacity style={{ marginBottom: 10, marginHorizontal: 10 }} onPress={() => handleLogin()}
                                    >
                                        <Text style={{ color: commonStylesSheet.darkBackground, }}>Log in</Text>
                                    </TouchableOpacity>
                                    <Text style={{ marginBottom: 10, color: commonStylesSheet.darkBackground, }}>Now.</Text>
                                </View>
                                :
                                <></>

                }
                <Text style={[{ width: (85 / 100) * screenWidth, marginBottom: 20, color: commonStylesSheet.errorText }]}>
                    {error}
                </Text>

                <TouchableOpacity style={[styles.loginButton]} onPress={() => {
                    if (resetStep === 0) {
                        handleSendResetPassword()
                    } else if (resetStep === 1) {
                        handleVerifyPassword()
                    } else {
                        handleResetPassword()
                    }
                }}
                    disabled={resetStep >= 3}
                >
                    {
                        resetStep === 0 ?
                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Reset</Text>
                            : resetStep === 1 ?
                                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Verify</Text>
                                :
                                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Reset</Text>
                    }
                    {loading &&
                        <ActivityIndicator style={{ marginLeft: 20 }} color={'white'} />
                    }
                </TouchableOpacity>


                <View style={{ flexDirection: 'row', justifyContent: 'center', width: (95 / 100) * screenWidth, marginBottom: 20, marginTop: 10 }}>
                    <Button variant="text" title="Log In" onPress={handleLogin} color={commonStylesSheet.muteText} uppercase={false} />
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

});


export default ForgetPassword;
