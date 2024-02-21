
import React from 'react';
import {
    StyleSheet,
    Dimensions,
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';


import { Icon } from '@rneui/themed';

import { useNavigation } from '@react-navigation/native';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';


import { useSelector, useDispatch } from 'react-redux';
import { logUserOut } from '../../Redux/userSlice';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



function DashboardNav() {

    const navigation = useNavigation();

    const [navcMenu, setnavcMenu] = React.useState(false);


    const dispatch = useDispatch();

    const isLogged = useSelector((state) => state.user.isLogged)
    const name = useSelector((state) => state.user.name)
    const uid = useSelector((state) => state.user.uid)



    const handleLogout = () => {
        dispatch(logUserOut())
    }


    return (


        <View style={styles.navContainer}>

            {/* <Modal
                animationType="none"
                transparent={true}
                visible={navcMenu}
                onRequestClose={() => {
                    setnavcMenu(!navcMenu);
                }}>
                <TouchableOpacity style={[styles.navcMenuOverlay, { paddingBottom: 30 }]} onPress={() => setnavcMenu(false)} >
                    <View style={[styles.navcMenu]}>
                        <View style={styles.menueCorner} />
                        {(isLogged && uid > 0) ?
                            <View style={styles.navcMenuItem} >
                                <Text style={[styles.menuTitle, { color: commonStylesSheet.darkBackground }]}>{name}</Text>
                            </View>
                            :
                            <TouchableOpacity style={styles.navcMenuItem} onPress={() => {
                                setnavcMenu(false); navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            }}>
                                <Text style={styles.menuTitle}>LOGIN</Text>
                            </TouchableOpacity>
                        }
                        {(isLogged) &&
                            <TouchableOpacity style={styles.navcMenuItem} onPress={() => handleLogout()}>
                                <Text style={styles.menuTitle}>LOGOUT</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </TouchableOpacity>
            </Modal > */}


            <Image source={require('../../Images/cms_logo_no_bg.png')} style={{ width: 100,  resizeMode: 'contain' }} resizeMethod='resize' />
            {/* <TextInput
                placeholder='Search'
                variant='outlined'
                style={[{ width: (55 / 100) * screenWidth, borderWidth: 0, backgroundColor: commonStylesSheet.darkForeground, borderRadius: 12, padding: 10, paddingHorizontal: 20, ...commonStylesSheet.ThreeD }]}
                inlineImageLeft='search_icon'
            />
            <Icon type='material-community' name='cart' onPress={() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Cart' }],
                });
            }} iconStyle={{ backgroundColor: commonStylesSheet.screenBackground, paddingHorizontal: 10 }} />
             */}

            {/* <Icon type='material-community' name='account-circle' onPress={() => setnavcMenu(true)} iconStyle={{ backgroundColor: commonStylesSheet.screenBackground }} /> */}



        </View>
    );

}


export default DashboardNav;



const styles = StyleSheet.create({
    navContainer: {
        backgroundColor: commonStylesSheet.brandLogoBackground,
        minWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20,
        paddingHorizontal: 10,
        height: 150,
        alignItems: 'center',
        position: 'relative'
    },

    navcMenuItem: {
        width: '100%',
        // borderWidth: 0.3,
        // borderRadius: 4,
        // borderBottomColor: commonStylesSheet.modalsText,
        padding: 5,
        marginVertical: 10

    },

    menuTitle: {
        color: commonStylesSheet.modalsText
    },

    navcMenu: {
        position: 'relative',
        flexDirection: 'column',
        justifyContent: '',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: commonStylesSheet.darkForeground,
        borderRadius: 10,
        borderTopRightRadius: 0,
        padding: 35,
        width: 200,
        alignItems: 'center',
        top: 80,
        right: 7
    },

    menueCorner: {
        position: 'absolute',
        height: 30,
        width: 22,
        transform: 'rotateY(0deg) rotate(45deg)',
        backgroundColor: commonStylesSheet.darkForeground,
        top: -8,
        right: 8,
    },

    navcMenuOverlay: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: screenHeight,
        width: screenWidth,
        backgroundColor: '#D3D3D31A'
    }
});
