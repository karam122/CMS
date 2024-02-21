



import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
    ScrollView,
    Animated,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';


import { Icon } from '@rneui/themed';

import { useNavigation } from '@react-navigation/native';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';



const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;





function DashboardTabs() {

    const navigation = useNavigation();


    const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const animationStyle = {
        opacity: fadeAnim,
        transform: [{
            translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
            }),
        }],
    };


    return (


        // <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
        <View style={{ flexDirection: 'column', backgroundColor: commonStylesSheet.screenBackground }}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 170, backgroundColor: commonStylesSheet.brandLogoBackground, ...commonStylesSheet.ThreeD }}>
                <Image source={require('../../Images/cms_logo_no_bg.png')} style={{ marginTop: -40, width: 100, resizeMode: 'contain' }} resizeMethod='resize' />
            </View>
            <View style={styles.tabContainer}>


                <Animated.View style={animationStyle}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Booking', { currentBooking: 'trip' }) }} style={styles.tabButton}>
                        <Icon type='ionicon' name='briefcase' iconProps={styles.tabIcon} />
                        <Text style={styles.tabText}>Tour</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={animationStyle}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Booking', { currentBooking: 'transport' }) }} style={styles.tabButton}>
                        <Icon type='ionicon' name='car-sport' iconProps={styles.tabIcon} />
                        <Text style={styles.tabText}>Transport</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={animationStyle}>
                    <TouchableOpacity onPress={() => { navigation.navigate('CMS Store') }} style={styles.tabButton}>
                        <Icon type='material-community' name='storefront' iconProps={styles.tabIcon} />
                        <Text style={styles.tabText}>CMS Store</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={animationStyle}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Booking', { currentBooking: 'hotel' }) }} style={styles.tabButton}>
                        <Icon type='ionicon' name='business' iconProps={styles.tabIcon} />
                        <Text style={styles.tabText}>Hotel</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* <TouchableOpacity onPress={() => { navigation.navigate('Booking', { currentBooking: 'flight' }) }}  style={styles.tabButton}>
                <Icon type='ionicon' name='airplane' iconProps={styles.tabIcon} />
                <Text style={styles.tabText}>Flight</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Booking', { currentBooking: 'hotel' }) }} style={styles.tabButton}>
                <Icon type='ionicon' name='business' iconProps={styles.tabIcon} />
                <Text style={styles.tabText}>Hotel</Text>
            </TouchableOpacity> */}

            </View>
        </View>
    );

}


export default DashboardTabs;



const styles = StyleSheet.create({
    tabContainer: {
        // backgroundColor: commonStylesSheet.screenBackground,
        marginBottom: 20,
        width: screenWidth,
        minWidth: screenWidth,
        maxWidth: screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingVertical: 20,
        paddingHorizontal: 8,
        // height: 80,
        marginTop: -35
    },
    tabButton: {
        // borderWidth: 0.7,
        // width: 110,
        width: 'auto',
        minWidth: 75,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 12,
        paddingVertical: 8,
        backgroundColor: commonStylesSheet.darkForeground,


        ...commonStylesSheet.ThreeD,
        elevation: 20,
        shadowColor: commonStylesSheet.darkBackground,
        shadowColor: 'red',
        // shadowColor: '#59a52c',


    },
    tabIcon: {
        style: {
            fontSize: 30,
            color: commonStylesSheet.darkBackground
        }

    },
    tabText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: commonStylesSheet.darkBackground

    }
});
