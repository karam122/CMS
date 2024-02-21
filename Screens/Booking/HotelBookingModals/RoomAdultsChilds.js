



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
import SelectDropdown from 'react-native-select-dropdown';
import { commonStylesSheet } from '../../../StyleSheets/CommonStylesheet';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;





function RoomAdultsChilds({ guestModal, setGuestModal, roomTypes, guestDetails, setGuestDetails, setFinalGuests }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={guestModal}
            onRequestClose={() => {
                setGuestModal(!guestModal);
            }}>
            <View style={styles.modalView}>
                <View>
                    <View style={styles.modalHeader}>
                        <Icon type='ionicon' name='arrow-back' onPress={() => setGuestModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />
                        <Text style={[{ fontSize: 20, color: commonStylesSheet.modalsText, marginLeft: 10 }]}>Guest Details</Text>
                    </View>

                    <View style={styles.modalBodyResults}>


                        <SelectDropdown
                            data={roomTypes}
                            search
                            searchPlaceHolder='Search'
                            defaultButtonText='Select Room Type'
                            defaultValue={guestDetails.roomType}

                            buttonStyle={styles.dropDownButton}
                            buttonTextStyle={{ textAlign: 'left', fontSize: 20 }}

                            selectedRowStyle={{ backgroundColor: '#D3D3D3' }}
                            rowTextStyle={{ textAlign: 'left' }}
                            renderSearchInputLeftIcon={() => <Icon type='ionicon' name='search-outline' />}
                            renderDropdownIcon={() => <Icon type='ionicon' name='chevron-forward' />}
                            onSelect={(selectedItem, index) => { setGuestDetails({ ...guestDetails, roomType: selectedItem }) }}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem.name }}
                            rowTextForSelection={(item, index) => { return item.name }}
                        />


                        <View style={[styles.counterContainer, { marginTop: 10 }]}>
                            <Text style={{ fontSize: 18, color: commonStylesSheet.modalsText }}>Room</Text>
                            <View style={styles.counterButtons}>
                                <Icon type='material-community' name='minus' iconStyle={styles.counterIcons} disabled={guestDetails.NoRooms <= 0}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoRooms: guestDetails.NoRooms - 1
                                    })}
                                />
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText, marginHorizontal: 5 }}>{guestDetails.NoRooms}</Text>
                                <Icon type='material-community' name='plus' iconStyle={styles.counterIcons} disabled={guestDetails.NoRooms >= 10}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoRooms: guestDetails.NoRooms + 1
                                    })}
                                />
                            </View>
                        </View>

                        <View style={styles.counterContainer}>
                            <Text style={{ fontSize: 18, color: commonStylesSheet.modalsText }}>Adults {`(>11yrs)`}</Text>
                            <View style={styles.counterButtons}>
                                <Icon type='material-community' name='minus' iconStyle={styles.counterIcons} disabled={guestDetails.NoAdults <= 0}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoAdults: guestDetails.NoAdults - 1
                                    })}
                                />
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText, marginHorizontal: 5 }}>{guestDetails.NoAdults}</Text>
                                <Icon type='material-community' name='plus' iconStyle={styles.counterIcons} disabled={guestDetails.NoAdults >= 10}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoAdults: guestDetails.NoAdults + 1
                                    })}
                                />
                            </View>
                        </View>

                        <View style={styles.counterContainer}>
                            <Text style={{ fontSize: 18, color: commonStylesSheet.modalsText }}>Childrens {`(2-11yrs)`}</Text>
                            <View style={styles.counterButtons}>
                                <Icon type='material-community' name='minus' iconStyle={styles.counterIcons} disabled={guestDetails.NoChilds <= 0}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoChilds: guestDetails.NoChilds - 1
                                    })}
                                />
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText, marginHorizontal: 5 }}>{guestDetails.NoChilds}</Text>
                                <Icon type='material-community' name='plus' iconStyle={styles.counterIcons} disabled={guestDetails.NoChilds >= 10}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoChilds: guestDetails.NoChilds + 1
                                    })}
                                />
                            </View>
                        </View>

                        <View style={styles.counterContainer}>
                            <Text style={{ fontSize: 18, color: commonStylesSheet.modalsText }}>Infants {`(<2yrs)`}</Text>
                            <View style={styles.counterButtons}>
                                <Icon type='material-community' name='minus' iconStyle={styles.counterIcons} disabled={guestDetails.NoInfants <= 0}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoInfants: guestDetails.NoInfants - 1
                                    })}
                                />
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText, marginHorizontal: 5 }}>{guestDetails.NoInfants}</Text>
                                <Icon type='material-community' name='plus' iconStyle={styles.counterIcons} disabled={guestDetails.NoInfants >= 10}
                                    onPress={() => setGuestDetails({
                                        ...guestDetails,
                                        NoInfants: guestDetails.NoInfants + 1
                                    })}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { setFinalGuests({ ...guestDetails }); setGuestModal(false); }} style={styles.modalSearchButton}>
                    <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default RoomAdultsChilds;



const styles = StyleSheet.create({

    modalSearchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        width: (screenWidth * 90) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center'


    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: commonStylesSheet.darkForeground,
        padding: 15,
        paddingVertical: 10,
        borderRadius: 8,
        marginVertical: 7
    },
    counterButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: commonStylesSheet.muteText,
        borderRadius: 4,
        padding: 4

    },

    counterIcons: {

        fontSize: 22, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground

    },

    dropDownButton: {
        width: '100%',
        borderWidth: 0,
        borderBottomWidth: 1.4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: commonStylesSheet.darkForeground,
        borderColor: commonStylesSheet.muteText,
        paddingLeft: 10,
        marginVertical: 10
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



