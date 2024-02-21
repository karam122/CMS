



import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    ScrollView
} from 'react-native';


import { Icon } from '@rneui/themed';
import { color } from '@rneui/base';




function BookingTabs() {

    
    const [currentBooking, setCurrentBooking] = React.useState('flight');
    
    const handleTabValueChange = (newVallue) => {
        setCurrentBooking(newVallue);
        console.log(newVallue);
    }


    return (


        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>


            <TouchableOpacity onPress={() => handleTabValueChange('trip')}  style={currentBooking === 'trip' ? [styles.tabButton, {backgroundColor: 'black'}] : styles.tabButton}>
                <Icon type='ionicon' name='paper-plane' iconProps={{ style: currentBooking === 'trip' ? [styles.tabIcon, { color: 'white'}] : styles.tabIcon }} />
                <Text style={currentBooking === 'trip' ?  [styles.tabText, { color: 'white' }] : styles.tabText}>Tour</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabValueChange('transport')}  style={currentBooking === 'transport' ? [styles.tabButton, {backgroundColor: 'black'}] : styles.tabButton}>
                <Icon type='ionicon' name='car-sport' iconProps={{ style: currentBooking === 'transport' ? [styles.tabIcon, { color: 'white'}] : styles.tabIcon }} />
                <Text style={currentBooking === 'transport' ?  [styles.tabText, { color: 'white' }] : styles.tabText}>Transport</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabValueChange('flight')} style={currentBooking === 'flight' ? [styles.tabButton, {backgroundColor: 'black'}] : styles.tabButton}>
                <Icon type='ionicon' name='airplane' iconProps={{ style: currentBooking === 'flight' ? [styles.tabIcon, { color: 'white'}] : styles.tabIcon }} />
                <Text style={currentBooking === 'flight' ?  [styles.tabText, { color: 'white' }] : styles.tabText}>Flight</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabValueChange('hotel')} style={currentBooking === 'hotel' ? [styles.tabButton, {backgroundColor: 'black'}] : styles.tabButton}>
                <Icon type='ionicon' name='business' iconProps={{ style: currentBooking === 'hotel' ? [styles.tabIcon, { color: 'white'}] : styles.tabIcon }} />
                <Text style={currentBooking === 'hotel' ?  [styles.tabText, { color: 'white' }] : styles.tabText}>Hotel</Text>
            </TouchableOpacity>


        </ScrollView>
    );

}


export default BookingTabs;



const styles = StyleSheet.create({
    tabContainer: {
        minWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        // paddingHorizontal: 5,
        height: 120
    },
    tabButton: {
        borderWidth: 0.7,
        width: 140,
        height: 60,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#E8E8E8'
    },
    tabButtonActive: {
        backgroundColor: 'black',
        color: 'white'

    },
    tabIcon: {
        fontSize: 30,
        marginHorizontal: 8,
    },
    tabText: {
        fontSize: 20,
        color: 'black'

    }
});
