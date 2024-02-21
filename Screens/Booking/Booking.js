import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Dimensions,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import { Icon } from '@rneui/themed';

import HotelBookings from './HotelBookings';
import TransportBookings from './TransportBooking';
import TourBooking from './TourBooking';
import { useRoute } from '@react-navigation/native';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function Booking() {
    const route = useRoute();
    const [currentBooking, setCurrentBooking] = React.useState('trip');
    const handleTabValueChange = (newVallue) => { setCurrentBooking(newVallue); }

    React.useEffect(() => {
        if (route.params && route.params.currentBooking) {
            setCurrentBooking(route.params.currentBooking);
        }
        else {
            setCurrentBooking('trip')
        }
    }, [route.params]);



    const CommingSoon = () => {


        return (
            <View style={{ backgroundColor: commonStylesSheet.screenBackground, height: screenHeight - 300, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ marginTop: 30 }}>
                    {currentBooking === 'flight' ?
                        <Icon type='material-community' name='airplane' iconStyle={{ color: commonStylesSheet.modalsText, fontSize: 45 }} /> :
                        <Icon type='ionicon' name='business' iconStyle={{ color: commonStylesSheet.modalsText, fontSize: 45 }} />

                    }
                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 40, fontWeight: 900 }} >Comming</Text>
                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 40, fontWeight: 900 }} >Soon......</Text>
                </View>
            </View>
        )
    }



    return (
        // <ScrollView 
        // contentContainerStyle={styles.dashboardContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.dashboardContainer}>
            <View style={{ flexDirection: 'row', width: screenWidth, justifyContent: 'center' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
                    <TouchableOpacity onPress={() => handleTabValueChange('trip')} style={currentBooking === 'trip' ? [styles.tabButton, { backgroundColor: commonStylesSheet.darkBackground }] : styles.tabButton}>
                        <Icon type='ionicon' name='briefcase' iconProps={{ style: currentBooking === 'trip' ? [styles.tabIcon, { color: 'white' }] : styles.tabIcon }} />
                        <Text style={currentBooking === 'trip' ? [styles.tabText, { color: 'white' }] : styles.tabText}>Tour</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabValueChange('transport')} style={currentBooking === 'transport' ? [styles.tabButton, { backgroundColor: commonStylesSheet.darkBackground }] : styles.tabButton}>
                        <Icon type='ionicon' name='car-sport' iconProps={{ style: currentBooking === 'transport' ? [styles.tabIcon, { color: 'white', marginHorizontal: 5 }] : [styles.tabIcon, { marginHorizontal: 5 }] }} />
                        <Text style={currentBooking === 'transport' ? [styles.tabText, { color: 'white' }] : styles.tabText}>Transport</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabValueChange('hotel')} style={currentBooking === 'hotel' ? [styles.tabButton, { backgroundColor: commonStylesSheet.darkBackground }] : styles.tabButton}>
                        <Icon type='ionicon' name='business' iconProps={{ style: currentBooking === 'hotel' ? [styles.tabIcon, { color: 'white' }] : styles.tabIcon }} />
                        <Text style={currentBooking === 'hotel' ? [styles.tabText, { color: 'white' }] : styles.tabText}>Hotel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabValueChange('flight')} style={currentBooking === 'flight' ? [styles.tabButton, { backgroundColor: commonStylesSheet.darkBackground }] : styles.tabButton}>
                        <Icon type='ionicon' name='airplane' iconProps={{ style: currentBooking === 'flight' ? [styles.tabIcon, { color: 'white' }] : styles.tabIcon }} />
                        <Text style={currentBooking === 'flight' ? [styles.tabText, { color: 'white' }] : styles.tabText}>Flight</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>


            <View style={{ paddingHorizontal: 10 }}>


                {
                    currentBooking === 'flight' ?
                        <CommingSoon />
                        : currentBooking === 'hotel' ?
                            <HotelBookings />
                            // <CommingSoon />
                            : currentBooking === 'transport' ?
                                <TransportBookings />
                                : currentBooking === 'trip' ?
                                    <TourBooking />
                                    : <></>
                }
            </View>
        </View>
    );
}



export default Booking;



const styles = StyleSheet.create({
    dashboardContainer: {
        backgroundColor: commonStylesSheet.screenBackground,
        // paddingHorizontal: 10,
    },
    tabContainer: {
        minWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        // paddingHorizontal: 5,
        // height: (12/100)*screenHeight,
        height: 90,
        maxHeight: 120,
        backgroundColor: commonStylesSheet.screenBackground,
        paddingHorizontal: 10

    },
    tabButton: {
        // borderWidth: 1,
        borderColor: commonStylesSheet.muteText,
        width: 120,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: commonStylesSheet.darkForeground,


        ...commonStylesSheet.ThreeD

    },
    tabIcon: {
        fontSize: 20,
        marginHorizontal: 8,
        color: commonStylesSheet.muteText
    },
    tabText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: commonStylesSheet.muteText
    }

});
