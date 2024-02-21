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

function DatesModal({dateModal, setDateModal, checkinDate, checkoutDate, finalDatesDetail, setCheckinDate, setCheckoutDate, setFinalDatesDetail, headerValues}) {

    const currentDate = new Date();

  // Set the minimum date to the current date minus one day
  const minimumDate = new Date(currentDate);
  minimumDate.setDate(currentDate.getDate() - 1);

  

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={dateModal}
            onRequestClose={() => {
                setDateModal(!dateModal);
            }}>
            <View style={styles.modalView}>
                <View>

                    <View style={[styles.modalHeader, {justifyContent: 'space-between'}]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon type='ionicon' name='arrow-back' onPress={() => setDateModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{headerValues[0]}</Text>
                                <Text style={[{ fontSize: 14, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalDatesDetail?.checkin.toDateString()}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{headerValues[1]}</Text>
                                <Text style={[{ fontSize: 14, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalDatesDetail?.checkout.toDateString()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalBodyResults}>
                        <DatePicker
                            date={checkinDate} onDateChange={setCheckinDate}
                            mode='date'
                            minimumDate={minimumDate} 
                            backgroundColor={commonStylesSheet.darkForeground} androidVariant='nativeAndroid'
                            height={120}
                            textColor={commonStylesSheet.modalsText}
                            style={{ height: 200, width: (90 / 100) * screenWidth, marginTop: 30,  ...commonStylesSheet.ThreeD  }}
                        />
                        <DatePicker
                            date={checkoutDate} onDateChange={setCheckoutDate}
                            mode='date'
                            minimumDate={minimumDate} 
                            backgroundColor={commonStylesSheet.darkForeground} androidVariant='nativeAndroid'
                            height={120} 
                            textColor={commonStylesSheet.modalsText}
                            style={{ height: 200, width: (90 / 100) * screenWidth, marginTop: 30,  ...commonStylesSheet.ThreeD  }}
                            
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => { setFinalDatesDetail({ checkin: checkinDate, checkout: checkoutDate }); setDateModal(false); }} style={styles.modalSearchButton}>
                    <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>

    );
}

export default DatesModal;





const styles = StyleSheet.create({
    

    modalSearchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 4,
        width: (screenWidth * 90) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center'


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


