import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
    ScrollView,
    Linking,
    Image,
    ActivityIndicator
} from 'react-native';

import { base_url } from '../../../APIs/constants';

import { Icon } from '@rneui/themed';
import { GetAgencyDetailsId } from '../../../APIs/AppAPIs';

import { commonStylesSheet } from '../../../StyleSheets/CommonStylesheet';



const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function AgencyDetails({ selectedTour, companyModal, setCompanyModal }) {

    const [selectedCompany, setSelectedCompany] = React.useState({});

    React.useEffect(() => {
        if (!selectedCompany.id) {
            GetAgencyDetailsId(selectedTour?.agency?.id)
                .then(res => {
                    setSelectedCompany(res?.data?.data)
                })
                .catch(err => {
                    console.log('TranssportErr', err?.response);
                });
        }
    }, [])



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={companyModal}
            onRequestClose={() => {
                setCompanyModal(!companyModal);
            }}>
            <View style={[styles.modalView, { paddingBottom: 30 }]}>
                <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth }}>
                        <Icon type='ionicon' name='arrow-back' onPress={() => setCompanyModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, marginLeft: 10, backgroundColor: commonStylesSheet.screenBackground } }} />
                        <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold', marginLeft: 10 }]}>Back</Text>
                    </View>


                    <ScrollView contentContainerStyle={{ marginTop: 10, paddingBottom: 40, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} >

                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                            {selectedTour?.agency?.logo ?
                                <Image style={[styles.packageImage, { width: 80, height: 80, borderRadius: 80, }]} resizeMode='stretch' src={`${base_url}${selectedTour?.agency?.logo}`} />
                                :
                                <Icon iconStyle={{ fontSize: 65 }} type='material-community' name='account-circle' />
                            }
                            <Text style={[styles.textHeading, { marginTop: 4 }]}>{selectedTour?.agency?.first_name}</Text>
                        </View>

                        {selectedCompany.id ?

                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: 15, }}>
                                
                                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center',  width: '100%', paddingHorizontal: 10, gap: 25  }}>
                                    {selectedCompany?.license_verified ?
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                            <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                        </View>
                                        : <></>}

                                    {selectedCompany?.iata_verified ?
                                        <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                            <Image source={require('../../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                            <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                        </View>
                                        : <></>}
                                    {selectedCompany?.hajj_verified ?
                                        <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                            <Image source={require('../../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                            <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                        </View>
                                        : <></>}

                                    {selectedCompany?.oep_verified ?
                                        <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 2 }}>
                                            <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                            <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>OEP</Text>
                                        </View>
                                        : <></>}

                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                    <Icon type='material-community' name='account' />
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5, marginRight: 5 }}>{selectedCompany.admin_name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                    <Icon type='material-community' name='phone' />
                                    <TouchableOpacity onPress={() => {
                                        Linking.openURL(`tel:${selectedCompany.phone}`)
                                    }}>
                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5, marginRight: 5 }}>{selectedCompany.phone}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                    <Icon type='material-community' name='email' />
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5, marginRight: 5 }}>{selectedCompany.email}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                    <Icon type='material-community' name='map-marker' />
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5, marginRight: 5 }}>
                                        {selectedCompany.street_address ? selectedCompany.street_address : ''}
                                        {selectedCompany.street_address1 ? ' , ' + selectedCompany.street_address1 : ''}
                                        {selectedCompany.city ? ' , ' + selectedCompany.city : ''}
                                        {selectedCompany.state ? ' , ' + selectedCompany.state : ''}
                                        {selectedCompany.postal_code ? ' , ' + selectedCompany.postal_code : ''}
                                        {selectedCompany.country ? ' , ' + selectedCompany.country : ''}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                    <Icon type='ionicon' name='briefcase' />
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 17, fontWeight: 'bold', marginLeft: 5 }}>Tours</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>Available Packages</Text>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>{selectedCompany.tours}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>Bookings Confirmed</Text>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>{selectedCompany.tour_bookings}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                    <Icon type='ionicon' name='car-sport' />
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 17, fontWeight: 'bold', marginLeft: 5 }}>Transports</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>Available Packages</Text>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>{selectedCompany.transports}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>Bookings Confirmed</Text>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 16, marginLeft: 5 }}>{selectedCompany.transport_bookings}</Text>
                                </View>


                            </View>
                            :
                            <View style={{ height: screenHeight / 1.5, flexDirection: 'column', justifyContent: 'center' }}>
                                <ActivityIndicator size={60} color={commonStylesSheet.darkBackground} />
                            </View>

                        }
                    </ScrollView>

                </View>
            </View>
        </Modal >
    );

}

export default AgencyDetails;




const styles = StyleSheet.create({

    textHeading: {
        fontSize: 16,
        // color: commonStylesSheet.modalsText, 
        color: 'black',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 3
    },



    modalView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 100,
        backgroundColor: commonStylesSheet.screenBackground,
        padding: 35,
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',

    },



});
