import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
} from 'react-native';


import { Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { commonStylesSheet } from '../../../StyleSheets/CommonStylesheet';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function TimesModal({timeModal, setTimeModal, checkinTime, checkoutTime, finalTimesDetail, setCheckinTime, setCheckoutTime, setFinalTimesDetail, headerValues}) {

    

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={timeModal}
            onRequestClose={() => {
                setTimeModal(!timeModal);
            }}>
            <View style={styles.modalView}>
                <View>

                    <View style={[styles.modalHeader, {justifyContent: 'space-between'}]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon type='ionicon' name='arrow-back' onPress={() => setTimeModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{headerValues[0]}</Text>
                                <Text style={[{ fontSize: 14, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalTimesDetail?.checkin.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{headerValues[1]}</Text>
                                <Text style={[{ fontSize: 14, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalTimesDetail?.checkout.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalBodyResults}>
                        <DatePicker
                            date={checkinTime} onDateChange={setCheckinTime}
                            mode='time'
                            backgroundColor={commonStylesSheet.darkForeground} androidVariant='nativeAndroid'
                            height={120}
                            textColor={commonStylesSheet.modalsText}
                            style={{ height: 200, width: (90 / 100) * screenWidth, marginTop: 30, ...commonStylesSheet.ThreeD }}
                        />
                        <DatePicker
                            date={checkoutTime} onDateChange={setCheckoutTime}
                            mode='time'
                            backgroundColor={commonStylesSheet.darkForeground} androidVariant='nativeAndroid'
                            height={120}
                            textColor={commonStylesSheet.modalsText}
                            style={{ height: 200, width: (90 / 100) * screenWidth, marginTop: 30,  ...commonStylesSheet.ThreeD }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => { setFinalTimesDetail({ checkin: checkinTime, checkout: checkoutTime }); setTimeModal(false); }} style={styles.modalSearchButton}>
                    <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>

    );
}

export default TimesModal;





const styles = StyleSheet.create({
    

    modalSearchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 4,
        width: (screenWidth * 90) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center',

        ...commonStylesSheet.ThreeD


    },
    
    
    modalView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 100,
        backgroundColor: commonStylesSheet.screenBackground,
        height: screenHeight,
        width: screenWidth,

    },
    modalBoody: {
        flexDirection: 'column',
        // paddingHorizontal: 15,
        paddingVertical: 15
    },
    modalBodyResults: {
        // backgroundColor: commonStylesSheet.darkForeground,
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginVertical: 15
    },
    modalHeader: {
        left: 0,
        flexDirection: 'row',
        width: screenWidth,
        borderBottomWidth: 0.3,
        borderColor: commonStylesSheet.muteText,
        backgroundColor: commonStylesSheet.darkForeground,
        paddingTop: 35,
        paddingBottom: 15,
        paddingHorizontal: 10,
        alignItems: 'center'
    },



});


