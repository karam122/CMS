import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ToastAndroid
} from "react-native";

import { Icon } from '@rneui/themed';
import { commonStylesSheet } from "../../StyleSheets/CommonStylesheet";


import { useSelector, useDispatch } from 'react-redux';
import { logUserOut } from '../../Redux/userSlice';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function MoreScreen({ navigation }) {


    const dispatch = useDispatch();

    const isLogged = useSelector((state) => state.user.isLogged)
    const name = useSelector((state) => state.user.name)
    const email = useSelector((state) => state.user.email)
    const uid = useSelector((state) => state.user.uid)



    const handleLogout = () => {
        dispatch(logUserOut())
        ToastAndroid.show('User Logged Out', ToastAndroid.SHORT)
    }




    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: commonStylesSheet.screenBackground, padding: 20 }}>
            {/* <TouchableOpacity style={styles.moreButtons} onPress={() => navigation.navigate('CMS Store')}>
                <Icon type='material-community' name='storefront' iconStyle={{ fontSize: 30, color: commonStylesSheet.modalsText }} />
                <Text style={{ fontSize: 16, color: commonStylesSheet.modalsText, marginTop: 1 }}>CMS Store</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreButtons} onPress={() => navigation.navigate('Cart')}>
                <Icon type='material-community' name='cart' iconStyle={{ fontSize: 30, color: commonStylesSheet.modalsText }} />
                <Text style={{ fontSize: 16, color: commonStylesSheet.modalsText, marginTop: 1 }}>My Cart</Text>
            </TouchableOpacity> */}


            <View style={[styles.navcMenu]}>
                <View style={styles.menueCorner} />
                {(isLogged && uid > 0) ?
                    <View style={{ marginBottom: 20 }} >
                        <View style={[styles.loginButton, {flexDirection: 'column', alignItems: 'flex-start'}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon type="material-community" name='account-circle' iconStyle={[styles.loginButtonIcon, {fontSize: 35}]} />
                                <Text style={[styles.loginButtonText, {fontSize: 20}]}>{name}</Text>
                            </View>
                            {/* <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Icon type="material-community" name='email' iconStyle={styles.loginButtonIcon} />
                                <Text style={styles.loginButtonText}>{email}</Text>
                            </View> */}
                        </View>
                    </View>
                    :
                    <TouchableOpacity style={styles.loginButton} onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }}>
                        <Icon type="material-community" name='login' iconStyle={styles.loginButtonIcon} />
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>
                }

                {(isLogged) &&
                    <TouchableOpacity style={styles.loginButton} onPress={() => handleLogout()}>
                        <Icon type="material-community" name='logout' iconStyle={styles.loginButtonIcon} />
                        <Text style={styles.loginButtonText}>LOGOUT</Text>
                    </TouchableOpacity>
                }
            </View>

        </View>
    );
}




export default MoreScreen;


const styles = StyleSheet.create({

    moreButtons: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: commonStylesSheet.darkForeground,
        width: 100,
        marginHorizontal: 7,
        paddingVertical: 10,
        borderRadius: 8,

        ...commonStylesSheet.ThreeD


    },

    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (90 / 100) * screenWidth,
        backgroundColor: commonStylesSheet.darkForeground,
        padding: 20,
        borderRadius: 8,


        ...commonStylesSheet.ThreeD

    },

    loginButtonText: {
        color: commonStylesSheet.modalsText,
        fontWeight: 'bold'

    },

    loginButtonIcon: {
        color: commonStylesSheet.modalsText,
        marginRight: 20

    }


});