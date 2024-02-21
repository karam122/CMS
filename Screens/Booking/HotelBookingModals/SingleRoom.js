




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
    Image
} from 'react-native';

import { base_url, roomWhatsappMessage, } from '../../../APIs/constants';
import { SliderBox } from "react-native-image-slider-box";
import StarRating from 'react-native-star-rating';
import { Icon } from '@rneui/themed';


import {
    SkypeIndicator,
} from 'react-native-indicators';
import { BookRoom, GetRoomsToBookId } from '../../../APIs/AppAPIs';
import { commonStylesSheet, htmlTagsStyles } from '../../../StyleSheets/CommonStylesheet';
import { useSelector, } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { Linking } from 'react-native';
import AgencyDetails from '../TourBookingModals/AgencyDetails';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function SingleRoom({ selectedRoomx, selectedRoomModal, setSelectedRoomModal, totalNights, finalGuests, finalDestination, finalDatesDetail }) {

    const navigation = useNavigation();

    const isLogged = useSelector((state) => state.user.isLogged)
    const uid = useSelector((state) => state.user.uid)

    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };


    const [selectedRoom, setSelectedRoom] = React.useState(selectedRoomx);

    const [companyModal, setCompanyModal] = React.useState(false);

    const [confirmTransportModal, setConfirmTransportModal] = React.useState(false);
    const [bookingRoomModal, setBookingRoomModal] = React.useState(false);
    const [roomBooked, setRoomBooked] = React.useState(false);
    const [bookingRoom, setBookingRoom] = React.useState(false);
    const [bookedBooking, setBookedBooking] = React.useState({});

    const handleBookRoom = () => {
        setRoomBooked(false); //  false
        setBookingRoom(true); //  true
        setBookingRoomModal(true);

        const finalData = {
            room: selectedRoom?.id,
            client: uid,
            destination: finalDestination.id,
            rooms: finalGuests.NoRooms,
            adults: finalGuests.NoAdults,
            childs: finalGuests.NoChilds,
            infants: finalGuests.NoInfants,
            checkin_date: finalDatesDetail.checkin.toISOString().split('T')[0],
            checkout_date: finalDatesDetail.checkout.toISOString().split('T')[0]
        };
        BookRoom(finalData)
            .then(res => {
                setBookingRoom(false)
                setRoomBooked(res.data.booked)
                setBookedBooking(res.data.data)
                setTimeout(() => {
                    setBookingRoomModal(false);
                    setConfirmTransportModal(false);
                }, 3000);
            })
            .catch(err => {
                setBookingRoom(false)
                setRoomBooked(err?.response?.data?.booked)
                console.log('HotelErr', err?.response?.data);
                setTimeout(() => {
                    setBookingRoomModal(false);
                    setConfirmTransportModal(false);
                }, 3000);
            });
    }

    const fetchRoom = (id) => {
        console.log(finalGuests)

        GetRoomsToBookId(id)
            .then(res => {
                setSelectedRoom(res?.data?.data)
            })
            .catch(err => {
                console.log('RmErr', err?.response);
            });
    };
    React.useEffect(() => {
        if (!selectedRoom.name) {
            fetchRoom(selectedRoom.id);
        }
    }, []);


    const handleViewCompany = () => {
        setCompanyModal(true);
    };


    const handleLoginForwardQuery = () => {

        const finalData = {
            room: selectedRoom?.id,
            destination: finalDestination.id,
            rooms: finalGuests.NoRooms,
            adults: finalGuests.NoAdults,
            childs: finalGuests.NoChilds,
            infants: finalGuests.NoInfants,
            checkin_date: finalDatesDetail.checkin.toISOString().split('T')[0],
            checkout_date: finalDatesDetail.checkout.toISOString().split('T')[0]
        };

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { bookRoom: true, roomData: finalData } }],
        });
    }






    return (

        <View>



            <Modal
                animationType="slide"
                transparent={true}
                visible={bookingRoomModal}
                onRequestClose={() => {
                    if (!bookingRoom) {
                        setBookingRoomModal(!bookingRoomModal);
                        setConfirmTransportModal(false);
                    }
                }}>
                <View style={[styles.modalBookingOverlay, { paddingBottom: 30 }]}>
                    <View style={[styles.modalBooking, { paddingBottom: 30 }]}>
                        <View>
                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 20 }}>Query</Text>
                        </View>
                        <View>
                            {bookingRoom ?
                                <SkypeIndicator color={commonStylesSheet.darkBackground} count={6} size={50} />

                                :
                                roomBooked ?
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

                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Check in</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='clock-time-two' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{finalDatesDetail.checkin.toLocaleDateString('en-US', dateOptions)}</Text>
                                </View>

                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Check out</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='clock-time-two' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{finalDatesDetail.checkout.toLocaleDateString('en-US', dateOptions)}</Text>
                                </View>

                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Hotel</Text>
                                <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>{selectedRoom.hotel.name}</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='map-marker' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{selectedRoom.hotel.address.city}, {selectedRoom.hotel.address.country}</Text>
                                </View>


                                <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0, marginVertical: 5 }} >
                                    <View style={styles.inlineFeatures}>
                                        <Icon type='material-community' name='bed-single-outline' color={commonStylesSheet.modalsText} />
                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{selectedRoom.hotel.rooms} {selectedRoom.hotel.rooms > 1 ? 'Bedrooms' : 'Bedroom'}</Text>
                                    </View>
                                    {
                                        selectedRoom.hotel.features.filter(datum => { return datum.status }).map((hFeat, index) => (
                                            <View key={index} style={styles.inlineFeatures}>
                                                <Icon style={styles.inlineFeaturesIcon} type={hFeat.icon_type} name={hFeat.icon} color={commonStylesSheet.modalsText} />
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{hFeat.name}</Text>
                                            </View>
                                        ))
                                    }

                                </ScrollView>

                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Room</Text>
                                <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>{selectedRoom.name}</Text>
                                {/* <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='map-marker' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{selectedRoom.hotel.address.city}, {selectedRoom.hotel.address.country}</Text>
                                </View> */}

                                <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0, marginVertical: 5 }} >
                                    
                                    <View style={styles.inlineFeatures}>
                                        <Icon style={styles.inlineFeaturesIcon} type='material-community' color={commonStylesSheet.modalsText} name='bed-king-outline' />
                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{selectedRoom.beds} {selectedRoom.beds > 1 ? 'Beds' : 'Bed'}</Text>
                                    </View>
                                    
                                    {
                                        selectedRoom.features.filter(datum => { return datum.status }).map((hFeat, index) => (
                                            <View key={index} style={styles.inlineFeatures}>
                                                <Icon style={styles.inlineFeaturesIcon} type={hFeat.icon_type} name={hFeat.icon} color={commonStylesSheet.modalsText} />
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{hFeat.name}</Text>
                                            </View>
                                        ))
                                    }

                                </ScrollView>


                                {selectedRoom.charges_type === 'fixed' ?
                                    <Text style={[styles.textHeading, { marginTop: 15, marginBottom: 0 }]}>Total PKR {totalNights < 1 ? selectedRoom?.price_day.toLocaleString() : (selectedRoom?.price_day * totalNights).toLocaleString()}</Text>
                                    :
                                    <Text style={[styles.textHeading, { marginTop: 15, marginBottom: 0 }]}>Total PKR {totalNights < 1 ? selectedRoom?.price_adult.toLocaleString() : (selectedRoom?.price_adult * totalNights).toLocaleString()}</Text>
                                }
                                <Text style={{ fontSize: 13, color: 'black', }}>Nightly Average {selectedRoom.charges_type === 'fixed' ? selectedRoom?.price_day.toLocaleString() : selectedRoom?.price_adult.toLocaleString()}</Text>


                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <TouchableOpacity onPress={() => setConfirmTransportModal(false)} style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: commonStylesSheet.errorText, width: 'auto', paddingHorizontal: 20 }]} disabled={!(isLogged && uid > 0)} >
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleBookRoom()} style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: !(isLogged && uid > 0) ? commonStylesSheet.filtersStar : commonStylesSheet.darkBackground, width: 'auto', paddingHorizontal: 20 }]} disabled={!(isLogged && uid > 0)} >
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>



                            </ScrollView>

                        </View>
                    </View>


                </Modal >
            }


            {companyModal &&
                <AgencyDetails
                    selectedTour={selectedRoom}
                    companyModal={companyModal}
                    setCompanyModal={(value) => setCompanyModal(value)}

                />
            }


            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedRoomModal}
                onRequestClose={() => {
                    setSelectedRoomModal(!selectedRoomModal);
                }}>
                <View style={[styles.modalView, { paddingBottom: 30 }]}>
                    <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth }}>
                            <Icon type='ionicon' name='arrow-back' onPress={() => setSelectedRoomModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, marginLeft: 10, backgroundColor: commonStylesSheet.screenBackground } }} />
                            <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold', marginLeft: 10 }]}>Back</Text>
                        </View>

                        {selectedRoom.name ?
                            <ScrollView contentContainerStyle={{ marginTop: 10, paddingBottom: 40, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} >
                                <View style={{ left: -10 }}>
                                    <SliderBox
                                        images={selectedRoom?.images.map(img => `${base_url}${img}`)}
                                        resizeMode='contain'
                                        dotColor={commonStylesSheet.filtersStar}
                                        inactiveDotColor={'#D3D3D3'}
                                        ImageComponentStyle={{ height: 200, width: screenWidth, }}
                                    />
                                </View>
                                <Text style={styles.textHeading}>{selectedRoom?.name}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <Icon type='ionicon' name='business' color={commonStylesSheet.modalsText} iconProps={{ fontSize: 14, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginVertical: 3 }}>{selectedRoom.hotel?.name}</Text>
                                </View>
                                {selectedRoom?.hotel?.rating && selectedRoom?.hotel?.rating > 0 &&
                                    <View style={{ width: 50, marginTop: 5 }}>
                                        <StarRating
                                            fullStarColor={'#FFD700'}
                                            disabled
                                            maxStars={5}
                                            rating={selectedRoom?.hotel?.rating}
                                            starSize={18}
                                            buttonStyle={{ marginHorizontal: 4 }}

                                        />
                                    </View>
                                }
                                {/* <View style={{ width: 50, marginTop: 5 }}>

                                <Text style={{ color: 'black', fontSize: 13 }}>{selectedRoom.address?.city}</Text>

                            </View> */}
                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Room Facilities</Text>
                                <ScrollView horizontal contentContainerStyle={{ marginTop: 20, }} showsHorizontalScrollIndicator={false} >
                                    {
                                        selectedRoom?.features.filter(datum => { return datum.status }).map((hFeat, index) => (
                                            <View key={index} style={{ flexDirection: 'column', marginRight: 20 }}>
                                                <Icon iconProps={{ size: 35, color: commonStylesSheet.filtersStar }} type={hFeat.icon_type} name={hFeat.icon} />
                                                <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13 }}>{hFeat.name}</Text>
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Hotel Facilities</Text>
                                {
                                    selectedRoom?.hotel?.features.filter(datum => { return datum.status }).map((hFeat, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                            <Icon iconProps={{ size: 40, marginRight: 10, color: commonStylesSheet.filtersStar }} type={hFeat.icon_type} name={hFeat.icon} />
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 15, fontWeight: 'bold' }}>{hFeat.name}</Text>
                                        </View>
                                    ))
                                }
                                {/* <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 10 }]}>Some helpful facts</Text>
                                <Text style={[styles.textHeading, { color: commonStylesSheet.filtersStar, marginBottom: 10, fontSize: 18 }]}>Check-in/Check-out</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 14, color: commonStylesSheet.filtersStar }}>Check-in from: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: commonStylesSheet.filtersStar }}>12:00 PM</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 14, color: commonStylesSheet.filtersStar }}>Check-out untill: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: commonStylesSheet.filtersStar }}>12:00 PM</Text>
                                </View> */}

                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 2 }]}>Room Description</Text>
                                <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedRoom?.description} </div>` }}
                                
                                tagsStyles={htmlTagsStyles} />

                                <Text style={[styles.textHeading, { marginTop: 20, marginBottom: 2 }]}>Hotel Description</Text>

                                <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedRoom?.hotel?.description} </div>` }}
                                        tagsStyles={htmlTagsStyles} />

                                <Text style={[styles.textHeading, { marginTop: 10, marginBottom: 2 }]}>Hotel Policies</Text>
                                <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedRoom?.hotel?.terms_conditions} </div>` }}
                                        tagsStyles={htmlTagsStyles} />

                                <Text style={[styles.textHeading, { marginTop: 10, marginBottom: 0 }]}>Charges Type: {selectedRoom.charges_type === 'fixed' ? 'Fixed' : 'By Person'}</Text>
                                {selectedRoom.charges_type === 'fixed' ?
                                    <Text style={[styles.textHeading, { marginTop: 10, marginBottom: 0 }]}>Total PKR {totalNights < 1 ? selectedRoom?.price_day.toLocaleString() : (selectedRoom?.price_day * totalNights).toLocaleString()}</Text>
                                    :
                                    <Text style={[styles.textHeading, { marginTop: 10, marginBottom: 0 }]}>Total PKR {totalNights < 1 ? selectedRoom?.price_adult.toLocaleString() : (selectedRoom?.price_adult * totalNights).toLocaleString()}</Text>
                                }
                                <Text style={{ fontSize: 13, color: 'black', }}>Nightly Average PKR:  {selectedRoom.charges_type === 'fixed' ? selectedRoom?.price_day.toLocaleString() : selectedRoom?.price_adult.toLocaleString()}</Text>



                                <Text style={[styles.textHeading, { marginTop: 10 }]}>Company Details</Text>
                                <View style={{ width: (90 / 100) * screenWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minHeight: 80 }}>
                                        {selectedRoom?.agency?.logo ?
                                            <Image style={[styles.packageImage, { width: 50, height: 50, borderRadius: 100, }]} resizeMode='stretch' src={`${base_url}${selectedRoom?.agency?.logo}`} />
                                            :
                                            <Icon iconStyle={{ fontSize: 36 }} type='material-community' name='account-circle' />
                                        }
                                    </View>
                                    <View style={{ marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start', flex: 1, justifyContent: 'center', marginLeft: 8, minHeight: 80, }}>


                                        <TouchableOpacity onPress={() => handleViewCompany()} >
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 18, fontWeight: 'bold', marginRight: 20, }} numberOfLines={2} ellipsizeMode="tail">
                                                {selectedRoom?.agency?.first_name}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                            {selectedRoom?.agency?.license_verified ?
                                                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                    <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                                </View>
                                                : <></>}

                                            {selectedRoom?.agency?.iata_verified ?
                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                    <Image source={require('../../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                                </View>
                                                : <></>}
                                            {selectedRoom?.agency?.hajj_verified ?
                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                    <Image source={require('../../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                                </View>
                                                : <></>}

                                            {selectedRoom?.agency?.oep_verified ?
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
                                            Linking.openURL(`tel:${selectedRoom?.agency?.phone}`)
                                        }}>
                                        <Icon type='material-community' name='phone' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 18, fontWeight: 'bold' }}>Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1.5 }]}
                                        onPress={() => {
                                            Linking.openURL(`whatsapp://send?text=${roomWhatsappMessage(`${selectedRoom?.name} in ${selectedRoom.hotel?.name}`)}&phone=${selectedRoom?.agency?.phone}`)
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
                                    style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: commonStylesSheet.darkBackground }]}
                                >
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

export default SingleRoom;




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
    },


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

    },

    inlineFeatures: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    inlineFeaturesIcon: {
        marginRight: 2
    }

});
