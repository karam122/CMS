




import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
    ScrollView,
    ActivityIndicator,
    Linking,
    Image
} from 'react-native';


import RenderHtml from 'react-native-render-html';
import {
    SkypeIndicator,
} from 'react-native-indicators';

import { base_url, transportWhatsappMessage } from '../../../APIs/constants';
import { SliderBox } from "react-native-image-slider-box";
import StarRating from 'react-native-star-rating';
import { Icon } from '@rneui/themed';
import { BookTransport, GetTransportsToBookId } from '../../../APIs/AppAPIs';
import { commonStylesSheet, htmlTagsStyles } from '../../../StyleSheets/CommonStylesheet';


import { useNavigation } from '@react-navigation/native';
import { useSelector, } from 'react-redux';
import AgencyDetails from '../TourBookingModals/AgencyDetails';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function SingleTransport({ selectedTransportx, selectedTransportModal, setSelectedTransportModal, finalPickup, finalDestination, finalPassengers, finalDatesDetail, finalTimesDetail }) {



    const isLogged = useSelector((state) => state.user.isLogged)
    const uid = useSelector((state) => state.user.uid)

    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };


    const navigation = useNavigation();
    const [selectedTransport, setSelectedTransport] = React.useState(selectedTransportx);

    const [companyModal, setCompanyModal] = React.useState(false);

    const [confirmTransportModal, setConfirmTransportModal] = React.useState(false);
    const [bookingTransportModal, setBookingTransportModal] = React.useState(false);
    const [transportBooked, setTransportBooked] = React.useState(false);
    const [bookingTransport, setBookingTransport] = React.useState(false);
    const [bookedBooking, setBookedBooking] = React.useState({});


    const handleBookTransport = () => {
        setTransportBooked(false);
        setBookingTransport(true);
        setBookingTransportModal(true);

        const finalData = {
            transport: selectedTransport.id,
            client: uid,
            pickup: finalPickup.id,
            drop: finalDestination.id,
            passengers: finalPassengers,
            pickup_date: finalDatesDetail.checkin.toISOString().split('T')[0],
            return_date: finalDatesDetail.checkout.toISOString().split('T')[0],
            pickup_time: finalTimesDetail.checkin.toLocaleTimeString('en-US', { hour12: false }),
            return_time: finalTimesDetail.checkout.toLocaleTimeString('en-US', { hour12: false }),
            is_rounded: true,
        }
        BookTransport(finalData)
            .then(res => {
                setBookingTransport(false)
                setTransportBooked(res.data.booked)
                setBookedBooking(res.data.data)
                setTimeout(() => {
                    setBookingTransportModal(false);
                    setConfirmTransportModal(false);
                }, 3000);
            })
            .catch(err => {
                setBookingTransport(false)
                setTransportBooked(err?.response?.data?.booked)
                console.log('HotelErr', err?.response?.data);
                setTimeout(() => {
                    setBookingTransportModal(false);
                    setConfirmTransportModal(false);
                }, 3000);
            });

    };


    const handleLoginForwardQuery = () => {

        const finalData = {
            transport: selectedTransport.id,
            pickup: finalPickup.id,
            drop: finalDestination.id,
            passengers: finalPassengers,
            pickup_date: finalDatesDetail.checkin.toISOString().split('T')[0],
            return_date: finalDatesDetail.checkout.toISOString().split('T')[0],
            pickup_time: finalTimesDetail.checkin.toLocaleTimeString('en-US', { hour12: false }),
            return_time: finalTimesDetail.checkout.toLocaleTimeString('en-US', { hour12: false }),
            is_rounded: true,
        }

        navigation.reset({
            index: 0,
            routes: [{
                name: 'Login', params: {
                    bookTransport: true,
                    transportData: finalData
                }
            }],
        });
    }



    const fetchTransport = (id) => {

        GetTransportsToBookId(id)
            .then(res => {
                setSelectedTransport(res?.data?.data)
            })
            .catch(err => {
                console.log('TranssportErr', err?.response);
            });
    };

    React.useEffect(() => {
        if (!selectedTransport.name) {
            fetchTransport(selectedTransport.id);
        }
    }, []);


    const handleViewCompany = () => {
        setCompanyModal(true);
    };




    return (
        <View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={bookingTransportModal}
                onRequestClose={() => {
                    if (!bookingTransport) {
                        setBookingTransportModal(!bookingTransportModal);
                        setConfirmTransportModal(!false);
                    }
                }}>
                <View style={[styles.modalBookingOverlay, { paddingBottom: 30 }]}>
                    <View style={[styles.modalBooking, { paddingBottom: 30 }]}>
                        <View>
                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 20 }}>Query</Text>
                        </View>
                        <View>
                            {bookingTransport ?
                                <SkypeIndicator color={commonStylesSheet.darkBackground} count={6} size={50} />

                                :
                                transportBooked ?
                                    <>
                                        <Icon type='material-community' iconProps={{ style: { fontSize: 50, color: commonStylesSheet.darkBackground, marginVertical: 20 } }} name='check-all' />
                                        <Text style={{ fontStyle: 'italic', fontSize: 30, color: commonStylesSheet.darkBackground }}>
                                            {bookedBooking.name}
                                        </Text>
                                    </>
                                    :
                                    <>
                                        <Icon type='material-community' iconProps={{ style: { fontSize: 50, color: commonStylesSheet.errorText, marginVertical: 20 } }} name='close-circle-outline' />
                                        <Text style={{ fontStyle: 'italic', fontSize: 30, color: commonStylesSheet.errorText }}>
                                            Query Failed
                                        </Text>
                                    </>

                            }
                        </View>
                    </View>
                </View>
            </Modal >


            {confirmTransportModal &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={confirmTransportModal}
                    onRequestClose={() => {
                        setConfirmTransportModal(!confirmTransportModal);
                    }}>

                    <View style={[styles.modalView, { paddingBottom: 30 }]}>
                        <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth }}>
                                <Icon type='ionicon' name='arrow-back' onPress={() => setConfirmTransportModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, marginLeft: 5, backgroundColor: commonStylesSheet.screenBackground } }} />
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold', marginLeft: 10 }]}>Confirm Booking</Text>
                            </View>


                            <ScrollView contentContainerStyle={{ marginTop: 10, paddingBottom: 40, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} >

                                {finalPickup.country &&

                                    <>
                                        <Text style={styles.textHeading}>Pickup Up</Text>

                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Icon type='material-community' name='map-marker' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{finalPickup.city}, {finalPickup.country}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Icon type='material-community' name='clock-time-two' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{finalTimesDetail.checkin.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} / {finalDatesDetail.checkin.toLocaleDateString('en-US', dateOptions)} </Text>
                                        </View>

                                        <Text style={styles.textHeading}>Drop Off</Text>
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Icon type='material-community' name='map-marker' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{finalDestination.city}, {finalDestination.country}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Icon type='material-community' name='clock-time-two' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{finalTimesDetail.checkout.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} / {finalDatesDetail.checkout.toLocaleDateString('en-US', dateOptions)} </Text>
                                        </View>
                                    </>
                                }
                                <Text style={styles.textHeading}>Car</Text>
                                <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{selectedTransport.name}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: (90 / 100) * screenWidth, marginVertical: 10, marginTop: 5, paddingHorizontal: 10 }} >
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.filtersStar, fontSize: 16, fontWeight: 'bold' }}>PKR {selectedTransport.price_day.toLocaleString()}/day</Text>
                                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{selectedTransport.km_day} KM</Text>
                                        </View> */}
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.filtersStar, fontSize: 16, fontWeight: 'bold' }}>PKR {selectedTransport.price_week.toLocaleString()}/week</Text>
                                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{selectedTransport.km_week} KM</Text>
                                        </View> */}
                                    </View>
                                </View>
                                <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10, marginBottom: 15 }} >
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{selectedTransport.type_name}</Text>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 6, marginHorizontal: 10 }}>{'\u2B24'}</Text>
                                    <View style={styles.inlineFeatures}>
                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{selectedTransport.doors} {selectedTransport.doors > 1 ? 'doors' : 'door'}</Text>
                                    </View>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 6, marginHorizontal: 10, }}>{'\u2B24'}</Text>
                                    <View style={styles.inlineFeatures}>
                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{selectedTransport.sitting_capacity} {selectedTransport.sitting_capacity > 1 ? 'seats' : 'seat'}</Text>
                                    </View>
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 6, marginHorizontal: 10, }}>{'\u2B24'}</Text>
                                    <View style={styles.inlineFeatures}>
                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{selectedTransport.bags}x small {selectedTransport.bags > 1 ? 'bags' : 'bag'}</Text>
                                    </View>
                                </ScrollView>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <TouchableOpacity onPress={() => setConfirmTransportModal(false)} style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: commonStylesSheet.errorText, width: 'auto', paddingHorizontal: 20 }]} disabled={!(isLogged && uid > 0)} >
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15, fontWeight: 'bold', ...commonStylesSheet.ThreeD }}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleBookTransport()} style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: !(isLogged && uid > 0) ? commonStylesSheet.filtersStar : commonStylesSheet.darkBackground, width: 'auto', paddingHorizontal: 20 }]} disabled={!(isLogged && uid > 0)} >
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15, fontWeight: 'bold', ...commonStylesSheet.ThreeD }}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>



                            </ScrollView>

                        </View>
                    </View>


                </Modal >
            }

            {companyModal &&
                <AgencyDetails
                    selectedTour={selectedTransport}
                    companyModal={companyModal}
                    setCompanyModal={(value) => setCompanyModal(value)}

                />
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedTransportModal}
                onRequestClose={() => {
                    setSelectedTransportModal(!selectedTransportModal);
                }}>
                <View style={[styles.modalView, { paddingBottom: 30 }]}>
                    <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth }}>
                            <Icon type='ionicon' name='arrow-back' onPress={() => setSelectedTransportModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, marginLeft: 10, backgroundColor: commonStylesSheet.screenBackground } }} />
                            <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold', marginLeft: 10 }]}>Back</Text>
                        </View>


                        {
                            selectedTransport.name ?


                                <ScrollView contentContainerStyle={{ marginTop: 10, paddingBottom: 40, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} >
                                    <View style={{ left: -10 }}>
                                        <SliderBox
                                            images={selectedTransport?.images.map(img => `${base_url}${img}`)}
                                            resizeMode='contain'
                                            
                                            dotColor={commonStylesSheet.filtersStar}
                                            inactiveDotColor={'#D3D3D3'}
                                            ImageComponentStyle={{ height: 200, width: screenWidth, backgroundColor: 'white'  }}
                                            
                                        />
                                    </View>
                                    <Text style={[styles.textHeading, { marginTop: 10, marginBottom: 0 }]}>{selectedTransport?.name}</Text>

                                    

                                    <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>Per Day</Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>PKR {selectedTransport.price_day?.toLocaleString()}</Text>
                                        </View>
                                        
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>Per Week</Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>PKR {selectedTransport.price_week?.toLocaleString()}</Text>
                                        </View>
                                        
                                    </View>


                                    <View style={{ flexDirection: 'row', marginTop: 0 }}>
                                        <View style={{ flex: 1.3 }}>
                                            <Text style={styles.textHeading}>Origin</Text>

                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                                {selectedTransport?.origin?.city}
                                            </Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                                {selectedTransport?.origin?.country}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>

                                            <Text style={styles.textHeading}>Destination</Text>

                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                                {selectedTransport?.destination?.city}
                                            </Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                                {selectedTransport?.destination?.country}
                                            </Text>
                                        </View>
                                    </View>


                                    <Text style={styles.textHeading}>Car Specs</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: '' }}>
                                        <View style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', marginRight: 5, width: (50 / 100) * screenWidth, marginBottom: 3 }}>
                                            <Icon type='material-community' name='car-convertible' iconProps={{ style: { fontSize: 24, color: commonStylesSheet.filtersStar, marginRight: 2 } }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}> Type: {selectedTransport.type_name}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, width: (50 / 100) * screenWidth, marginBottom: 3 }}>
                                            <Icon type='material-community' name='car-convertible' iconProps={{ style: { fontSize: 24, color: commonStylesSheet.filtersStar, marginRight: 2 } }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}> Brand: {selectedTransport.brand}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: '' }}>
                                        <View style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', marginRight: 5, width: (50 / 100) * screenWidth, marginBottom: 3 }}>
                                            <Icon type='material-community' name='car-convertible' iconProps={{ style: { fontSize: 24, color: commonStylesSheet.filtersStar, marginRight: 2 } }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}> Model: {selectedTransport.model_year}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, width: (50 / 100) * screenWidth, marginBottom: 3 }}>
                                            <Icon type='material-community' name='car-seat' iconProps={{ style: { fontSize: 24, color: commonStylesSheet.filtersStar, marginRight: 2 } }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}> Passengers: {selectedTransport.sitting_capacity}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: '' }}>
                                        <View style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', marginRight: 5, width: (50 / 100) * screenWidth, marginBottom: 3 }}>
                                            <Icon type='material-community' name='car-door' iconProps={{ style: { fontSize: 24, color: commonStylesSheet.filtersStar, marginRight: 2 } }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}> Doors: {selectedTransport.doors}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 5, width: (50 / 100) * screenWidth, marginBottom: 3 }}>
                                            <Icon type='ionicon' name='briefcase' iconProps={{ style: { fontSize: 24, color: commonStylesSheet.filtersStar, marginRight: 2 } }} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}> Bags: {selectedTransport.bags}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.textHeading}>Car Features</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap', paddingHorizontal: 5, justifyContent: selectedTransport?.features?.length > 3 ? 'space-between' : 'flex-start', }} >
                                        {
                                            selectedTransport?.features.filter(datum => { return datum.status }).map((hFeat, index) => (
                                                <View key={index} style={{ flexDirection: 'column', marginHorizontal: 10, marginBottom: 10 }}>
                                                    <Icon iconProps={{ size: 24, color: commonStylesSheet.filtersStar }} type={hFeat.icon_type} name={hFeat.icon} />
                                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13 }}>{hFeat.name}</Text>
                                                </View>
                                            ))
                                        }
                                    </View>


                                    <Text style={[styles.textHeading, { marginBottom: 0 }]}>Description</Text>
                                    <View style={{ flexDirection: 'column', marginVertical: 0, marginTop: 0 }}>
                                        <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedTransport.description} </div>` }}
                                        
                                        tagsStyles={htmlTagsStyles}
                                        />
                                    </View>



                                    <Text style={[styles.textHeading, { marginTop: 5, marginBottom: 0 }]}>Terms & Conditions</Text>
                                    <View style={{ flexDirection: 'column', marginVertical: 0 }}>
                                        <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedTransport.terms_conditions} </div>` }}
                                        
                                        tagsStyles={htmlTagsStyles}
                                        />
                                    </View>




                                    <Text style={styles.textHeading}>Rental Includes</Text>
                                    <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                                        {/* <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>Mileage Limit (Day)</Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{selectedTransport.km_day} KM</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>Mileage Limit (Week)</Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{selectedTransport.km_week} KM</Text>
                                        </View> */}
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>Security Deposit</Text>
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>PKR: {selectedTransport.advance_payment?.toLocaleString()}</Text>
                                        </View>
                                    </View>



                                    <Text style={styles.textHeading}>Company Details</Text>
                                    <View style={{ width: (90 / 100) * screenWidth, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minHeight: 80 }}>
                                            {selectedTransport?.agency?.logo ?
                                                <Image style={[styles.packageImage, { width: 50, height: 50, borderRadius: 100, }]} resizeMode='stretch' src={`${base_url}${selectedTransport?.agency?.logo}`} />
                                                :
                                                <Icon iconStyle={{ fontSize: 36 }} type='material-community' name='account-circle' />
                                            }
                                        </View>
                                        <View style={{ marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start', flex: 1, justifyContent: 'center', marginLeft: 8, minHeight: 80, }}>


                                            <TouchableOpacity onPress={() => handleViewCompany()} >
                                                <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 18, fontWeight: 'bold', marginRight: 20, }} numberOfLines={2} ellipsizeMode="tail">
                                                    {selectedTransport?.agency?.first_name}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                {selectedTransport?.agency?.license_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                                    </View>
                                                    : <></>}

                                                {selectedTransport?.agency?.iata_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                        <Image source={require('../../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                                    </View>
                                                    : <></>}
                                                {selectedTransport?.agency?.hajj_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                        <Image source={require('../../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                                    </View>
                                                    : <></>}

                                                {selectedTransport?.agency?.oep_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 2 }}>
                                                        <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>OEP</Text>
                                                    </View>
                                                    : <></>}

                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, marginTop: 2, marginBottom: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                        <TouchableOpacity
                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.callButton, borderBottomLeftRadius: 12 }]}
                                            onPress={() => {
                                                Linking.openURL(`tel:${selectedTransport?.agency?.phone}`)
                                            }}>
                                            <Icon type='material-community' name='phone' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 18, fontWeight: 'bold' }}>Call</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1.5 }]}
                                            onPress={() => {
                                                Linking.openURL(`whatsapp://send?text=${transportWhatsappMessage(selectedTransport?.name)}&phone=${selectedTransport?.agency?.phone}`)
                                            }}>
                                            <Icon type='material-community' name='whatsapp' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 18, fontWeight: 'bold' }}>WhatsApp</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.moreButton, borderBottomRightRadius: 12 }]}
                                            onPress={() => {
                                                // Linking.openURL(`tel:${+923174562491}`)
                                            }}>
                                            <Icon type='material-community' name='share-variant' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 18, fontWeight: 'bold' }}>Share</Text>
                                        </TouchableOpacity>
                                    </View>



                                    {!(isLogged && uid > 0) &&
                                        <Text style={{ textAlign: 'center', color: commonStylesSheet.filtersStar, marginTop: 20, marginBottom: -20 }}>You need to be logged in before booking</Text>
                                    }


                                    <TouchableOpacity onPress={() => !(isLogged && uid > 0) ? handleLoginForwardQuery() : setConfirmTransportModal(true)}
                                        style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: commonStylesSheet.darkBackground }]} >
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>
                                            {
                                                !(isLogged && uid > 0) ?
                                                    'Login & Forward Query'
                                                    :
                                                    'Forward Query'
                                            }
                                        </Text>
                                    </TouchableOpacity>


                                </ScrollView>
                                :
                                <View style={{ height: screenHeight, flexDirection: 'column', justifyContent: 'center' }}>
                                    <ActivityIndicator size={60} color={commonStylesSheet.darkBackground} />
                                </View>

                        }
                    </View>
                </View>
            </Modal >

        </View>
    );

}

export default SingleTransport;




const styles = StyleSheet.create({
    shareButton: {
        flex: 1,
        // marginHorizontal: 3,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: commonStylesSheet.darkForeground

    },

    textHeading: {
        fontSize: 16,
        // color: commonStylesSheet.modalsText, 
        color: 'black',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 3
    },



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
        padding: 35,
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',
    },

    modalBooking: {
        flexDirection: 'column',
        justifyContent: '',
        paddingBottom: 100,
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 35,
        height: 250,
        width: 300,
        alignItems: 'center',
    },

    modalBookingOverlay: {
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',

        height: screenHeight,
        width: screenWidth,
        backgroundColor: '#D3D3D3CC'

    }

});
