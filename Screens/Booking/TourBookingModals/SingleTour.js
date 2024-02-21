




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

import { base_url, tripWhatsappMessage } from '../../../APIs/constants';
import { SliderBox } from "react-native-image-slider-box";
import StarRating from 'react-native-star-rating';
import { Icon } from '@rneui/themed';
import { BookTour, GetAgencyDetailsId, GetToursToBookId } from '../../../APIs/AppAPIs';

import RenderHtml from 'react-native-render-html';



import {
    SkypeIndicator,
} from 'react-native-indicators';
import { commonStylesSheet, htmlTagsStyles } from '../../../StyleSheets/CommonStylesheet';

import { useSelector, } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import AgencyDetails from './AgencyDetails';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function SingleTour({ selectedTourx, selectedTourModal, setSelectedTransportModal }) {

    const navigation = useNavigation();

    const isLogged = useSelector((state) => state.user.isLogged)
    const uid = useSelector((state) => state.user.uid)


    const [selectedTour, setSelectedTour] = React.useState(selectedTourx);

    const [companyModal, setCompanyModal] = React.useState(false);

    const [selectedChildPrice, setSelectedChildPrice] = React.useState(false);
    const [selectedInfantPrice, setSelectedInfantPrice] = React.useState(false);

    const [selectedUmrahPrice, setSelectedUmrahPrice] = React.useState('sharing');
    const [umrahPassengers, setUmrahPassengers] = React.useState(1);
    const [umrahPassengersChild, setUmrahPassengersChild] = React.useState(0);
    const [umrahPassengersInfant, setUmrahPassengersInfant] = React.useState(0);

    const [confirmTransportModal, setConfirmTransportModal] = React.useState(false);
    const [bookingRoomModal, setBookingRoomModal] = React.useState(false);
    const [roomBooked, setRoomBooked] = React.useState(false);
    const [bookingRoom, setBookingRoom] = React.useState(false);
    const [bookedBooking, setBookedBooking] = React.useState({});


    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    function formatDate(inputDate) {
        return new Date(inputDate).toLocaleDateString(undefined, dateOptions);
    }


    const handleBookTour = () => {
        setRoomBooked(false);
        setBookingRoom(true); //  true
        setBookingRoomModal(true);

        const finalData = {
            tour: selectedTour?.id,
            client: uid,
            room_type: selectedUmrahPrice,
            passengers: selectedUmrahPrice === 'sharing' ? umrahPassengers : selectedUmrahPrice === 'quad' ? 4 : selectedUmrahPrice === 'triple' ? 3 : selectedUmrahPrice === 'double' ? 2 : 1,
            passenger_childs: umrahPassengersChild,
            passenger_infants: umrahPassengersInfant,
        };
        BookTour(finalData)
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


    const handleLoginForwardQuery = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login', params: { bookTour: true, tourID: selectedTour?.id } }],
        });
    }


    const fetchTour = (id) => {

        GetToursToBookId(id)
            .then(res => {
                console.log(res?.data?.data)
                setSelectedTour(res?.data?.data)
                if (res?.data?.data?.price_adult) {
                    setSelectedUmrahPrice('sharing')
                }
                else if (res?.data?.data?.price_quad) {
                    setSelectedUmrahPrice('quad')
                }
                else if (res?.data?.data?.price_triple) {
                    setSelectedUmrahPrice('triple')
                }
                else if (res?.data?.data?.price_double) {
                    setSelectedUmrahPrice('double')
                }
            })
            .catch(err => {
                console.log('TranssportErr', err);
            });
    };
    React.useEffect(() => {
        if (!selectedTour.name) {
            fetchTour(selectedTour.id);
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

                                <Text style={styles.textHeading}>Departure</Text>

                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='map-marker' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{selectedTour.origin.city}, {selectedTour.origin.country}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='clock-time-two' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{formatDate(selectedTour.departure_date)} </Text>
                                </View>

                                <Text style={styles.textHeading}>Arrival</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='map-marker' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{selectedTour.destination.city}, {selectedTour.destination.country}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon type='material-community' name='clock-time-two' iconStyle={{ fontSize: 18, color: commonStylesSheet.filtersStar, marginRight: 5 }} />
                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14 }}>{formatDate(selectedTour.arrival_date)} </Text>
                                </View>



                                <Text style={styles.textHeading}>Tour</Text>
                                <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{selectedTour.name}</Text>

                                <View style={{ paddingHorizontal: 5 }}>
                                    {
                                        selectedUmrahPrice === 'sharing' ?
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.textHeading, { marginTop: 2 }]}>Total Adults: {selectedTour.price_adult?.toLocaleString()} x {umrahPassengers}</Text>
                                                </View>
                                                <Text style={[styles.textHeading, { marginTop: 2 }]}>PKR {(selectedTour.price_adult * umrahPassengers)?.toLocaleString()}</Text>
                                            </View>
                                            : selectedUmrahPrice === 'quad' ?
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={[styles.textHeading, { marginTop: 2 }]}>Total Adults: {selectedTour.price_quad?.toLocaleString()} x 4</Text>
                                                    <Text style={[styles.textHeading, { marginTop: 2 }]}>PKR {(selectedTour.price_quad * 4)?.toLocaleString()}</Text>
                                                </View>
                                                : selectedUmrahPrice === 'triple' ?
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={[styles.textHeading, { marginTop: 2 }]}>Total Adults: {selectedTour.price_triple?.toLocaleString()} x 3</Text>
                                                        <Text style={[styles.textHeading, { marginTop: 2 }]}>PKR {(selectedTour.price_triple * 3)?.toLocaleString()}</Text>
                                                    </View>
                                                    : selectedUmrahPrice === 'double' ?
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={[styles.textHeading, { marginTop: 2 }]}>Total Adults: {selectedTour.price_double?.toLocaleString()} x 2</Text>
                                                            <Text style={[styles.textHeading, { marginTop: 2 }]}>PKR {(selectedTour.price_double * 2)?.toLocaleString()}</Text>
                                                        </View>

                                                        :
                                                        <></>
                                    }

                                    {selectedChildPrice &&
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textHeading, { marginTop: 2 }]}>Total Childs: {selectedTour.price_child?.toLocaleString()} x {umrahPassengersChild}</Text>
                                            </View>
                                            <Text style={[styles.textHeading, { marginTop: 2 }]}>PKR {(selectedTour.price_child * umrahPassengersChild)?.toLocaleString()}</Text>
                                        </View>
                                    }
                                    {selectedInfantPrice &&
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textHeading, { marginTop: 2 }]}>Total Infants: {selectedTour.price_infant?.toLocaleString()} x {umrahPassengersInfant}</Text>
                                            </View>
                                            <Text style={[styles.textHeading, { marginTop: 2 }]}>PKR {(selectedTour.price_infant * umrahPassengersInfant)?.toLocaleString()}</Text>
                                        </View>
                                    }

                                </View>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <TouchableOpacity onPress={() => setConfirmTransportModal(false)} style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: commonStylesSheet.errorText, width: 'auto', paddingHorizontal: 20 }]} disabled={!(isLogged && uid > 0)} >
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15, fontWeight: 'bold', ...commonStylesSheet.ThreeD }}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleBookTour()} style={[styles.modalSearchButton, { marginTop: 30, backgroundColor: !(isLogged && uid > 0) ? commonStylesSheet.filtersStar : commonStylesSheet.darkBackground, width: 'auto', paddingHorizontal: 20 }]} disabled={!(isLogged && uid > 0)} >
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
                    selectedTour={selectedTour}
                    companyModal={companyModal}
                    setCompanyModal={(value) => setCompanyModal(value)}

                />
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedTourModal}
                onRequestClose={() => {
                    setSelectedTransportModal(!selectedTourModal);
                }}>
                <View style={[styles.modalView, { paddingBottom: 30 }]}>
                    <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth }}>
                            <Icon type='ionicon' name='arrow-back' onPress={() => setSelectedTransportModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, marginLeft: 10, backgroundColor: commonStylesSheet.screenBackground } }} />
                            <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold', marginLeft: 10 }]}>Back</Text>
                        </View>

                        {selectedTour.name ?

                            <ScrollView contentContainerStyle={{ marginTop: 10, paddingBottom: 40, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} >
                                <View style={{ left: -10 }}>
                                    <SliderBox
                                        images={selectedTour?.images.map(img => `${base_url}${img}`)}
                                        resizeMode='contain'
                                        dotColor={commonStylesSheet.filtersStar}
                                        inactiveDotColor={'#D3D3D3'}
                                        ImageComponentStyle={{ height: 200, width: screenWidth, }}
                                    />
                                </View>

                                <View style={{ position: 'absolute', backgroundColor: 'white', right: 0, top: 150 }}>
                                </View>

                                {selectedTour?.rating > 0 &&
                                    <View style={{ position: 'absolute', backgroundColor: 'white', right: 0, top: 2, width: 140, flexDirection: 'row', }}>
                                        <Text style={{ padding: 10, color: 'black', fontSize: 20, fontWeight: 'bold', }}>
                                            <View style={{}}>
                                                <StarRating
                                                    fullStarColor={'#FFD700'}
                                                    disabled
                                                    maxStars={5}
                                                    rating={selectedTour?.rating}
                                                    starSize={18}
                                                    buttonStyle={{ marginHorizontal: 4 }}

                                                />
                                            </View>
                                        </Text>
                                    </View>
                                }
                                <Text style={styles.textHeading}>{selectedTour?.name}</Text>

                                <View style={{ flexDirection: 'row', width: (95 / 100) * screenWidth, marginVertical: 1, alignItems: 'center' }} >
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, color: commonStylesSheet.filtersStar, fontSize: 14, }}>{selectedTour.total_days} Days & {selectedTour.total_nights} Nights</Text>
                                </View>

                                {selectedTour.is_umrah &&
                                    <View style={{ flexDirection: 'row', }} >
                                        <View style={{ flex: 1 }} >
                                            <Text style={[styles.textHeading]}>Makkah</Text>
                                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{selectedTour.makkah_hotel}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>{selectedTour.makkah_km}M distance</Text>
                                            </View>
                                            {selectedTour.makkah_shuttle &&
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon type='material-community' name='bus' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>Shuttle Service</Text>
                                                </View>
                                            }
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textHeading}>Madinah</Text>
                                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{selectedTour.madinah_hotel}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>{selectedTour.madinah_km}M distance</Text>
                                            </View>
                                            {selectedTour.madinah_shuttle &&
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon type='material-community' name='bus' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>Shuttle Service</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                }


                                <View style={{ flexDirection: 'row', marginTop: 0 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.textHeading}>Departure</Text>

                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                            {selectedTour?.origin?.city}
                                        </Text>
                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                            {selectedTour?.origin?.country}
                                        </Text>
                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                            {formatDate(selectedTour.departure_date)}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>

                                        <Text style={styles.textHeading}>Arrival</Text>

                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                            {selectedTour?.destination?.city}
                                        </Text>
                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                            {selectedTour?.destination?.country}
                                        </Text>
                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13, }} >
                                            {formatDate(selectedTour.arrival_date)}
                                        </Text>
                                    </View>
                                </View>
                                {selectedTour.have_ticket && (selectedTour.flight_name || selectedTour.baggage || selectedTour.flight_type) &&
                                    <View style={{ flexDirection: 'column', marginTop: 0 }}>
                                        <Text style={[styles.textHeading, { marginTop: 15 }]}>Airline</Text>
                                        {selectedTour.flight_name &&
                                            <View style={{}}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon type='material-community' name='airplane' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14, marginLeft: 4 }} >
                                                        {selectedTour?.flight_name}
                                                    </Text>
                                                </View>
                                            </View>
                                        }
                                        {selectedTour.baggage &&
                                            <View style={{ marginTop: 4 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon type='material-community' name='bag-carry-on' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14, marginLeft: 4 }} >
                                                        Baggage Capacity: {selectedTour?.baggage} KG
                                                    </Text>
                                                </View>
                                            </View>
                                        }
                                        {selectedTour.flight_type &&
                                            <View style={{ marginTop: 4 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon type='material-community' name='airplane-takeoff' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                    <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14, marginLeft: 4 }} >
                                                        Flight Type: {selectedTour?.flight_type}
                                                    </Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                }
                                {selectedTour?.features.filter(datum => { return datum.status }).length > 0 &&
                                    <View>
                                        <Text style={styles.textHeading}>Package Includes</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap', paddingHorizontal: 5, justifyContent: selectedTour?.features?.length > 3 ? 'space-between' : 'flex-start', }} >
                                            {
                                                selectedTour?.features.filter(datum => { return datum.status }).map((hFeat, index) => (
                                                    <View key={index} style={{ flexDirection: 'column', marginHorizontal: 10, marginBottom: 10 }}>
                                                        <Icon iconProps={{ size: 24, color: commonStylesSheet.filtersStar }} type={hFeat.icon_type} name={hFeat.icon} />
                                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 13 }}>{hFeat.name}</Text>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    </View>
                                }

                                <View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }} >
                                        {selectedTour?.price_adult > 0 &&
                                            <TouchableOpacity style={[styles.umrahPrices, selectedUmrahPrice === 'sharing' ? styles.selectedUmrahPrice : {}]} onPress={() => setSelectedUmrahPrice('sharing')} >
                                                <Text style={[styles.textHeading, { marginTop: 0 }]}>Sharing Per Adult</Text>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {selectedTour.price_adult?.toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        }
                                        {selectedTour.price_quad > 0 &&
                                            <TouchableOpacity style={[styles.umrahPrices, selectedUmrahPrice === 'quad' ? styles.selectedUmrahPrice : {}]} onPress={() => setSelectedUmrahPrice('quad')} >
                                                <Text style={[styles.textHeading, , { marginTop: 0 }]}>Quad Per Adult</Text>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {selectedTour.price_quad?.toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        }
                                        {selectedTour.price_triple > 0 &&
                                            <TouchableOpacity style={[styles.umrahPrices, selectedUmrahPrice === 'triple' ? styles.selectedUmrahPrice : {}]} onPress={() => setSelectedUmrahPrice('triple')} >
                                                <Text style={[styles.textHeading, { marginTop: 0 }]}>Triple Per Adult</Text>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {selectedTour.price_triple?.toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        }
                                        {selectedTour.price_double > 0 &&
                                            <TouchableOpacity style={[styles.umrahPrices, selectedUmrahPrice === 'double' ? styles.selectedUmrahPrice : {}]} onPress={() => setSelectedUmrahPrice('double')} >
                                                <Text style={[styles.textHeading, , { marginTop: 0 }]}>Double Per Adult</Text>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {selectedTour.price_double?.toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: commonStylesSheet.darkForeground, borderRadius: 8, borderBottomWidth: 0.5 }} >
                                        <View style={[styles.umrahPrices,]}  >
                                            <Text style={[styles.textHeading, , { marginTop: 0 }]}>Total Adults:</Text>
                                            {selectedUmrahPrice === 'sharing' ?
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {(selectedTour.price_adult * umrahPassengers)?.toLocaleString()}</Text>
                                                : selectedUmrahPrice === 'quad' ?
                                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {(selectedTour.price_quad * 4)?.toLocaleString()}</Text>
                                                    : selectedUmrahPrice === 'triple' ?
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {(selectedTour.price_triple * 3)?.toLocaleString()}</Text>
                                                        :
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {(selectedTour.price_double * 2)?.toLocaleString()}</Text>
                                            }
                                        </View>
                                        <View style={[styles.umrahPrices,]}  >
                                            {
                                                selectedUmrahPrice === 'sharing' ?
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={[styles.textHeading, { marginTop: 0, }]}>{selectedTour.price_adult?.toLocaleString()} x  </Text>
                                                        <View style={[styles.counterContainer, { position: 'relative' }]}>
                                                            <View style={styles.counterButtons}>
                                                                <Icon type='material-community' name='minus' iconStyle={styles.counterIcons}
                                                                    disabled={umrahPassengers <= 1}
                                                                    onPress={() => setUmrahPassengers(umrahPassengers - 1)}
                                                                />
                                                                <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginHorizontal: 2 }}>{umrahPassengers}</Text>
                                                                <Icon type='material-community' name='plus' iconStyle={styles.counterIcons}
                                                                    disabled={umrahPassengers >= 6}
                                                                    onPress={() => setUmrahPassengers(umrahPassengers + 1)}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    : selectedUmrahPrice === 'quad' ?
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={[styles.textHeading, { marginTop: 0, }]}>{selectedTour.price_quad?.toLocaleString()} x 4 </Text>
                                                        </View>
                                                        : selectedUmrahPrice === 'triple' ?
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={[styles.textHeading, { marginTop: 0, }]}>{selectedTour.price_triple?.toLocaleString()} x 3 </Text>
                                                            </View>
                                                            :
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={[styles.textHeading, { marginTop: 0, }]}>{selectedTour.price_double?.toLocaleString()} x 2 </Text>
                                                            </View>

                                            }
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginVertical: 5 }} >
                                        {selectedTour.price_child > 0 &&
                                            <TouchableOpacity style={[styles.umrahPrices, selectedChildPrice ? styles.selectedUmrahPrice : {}]} onPress={() => setSelectedChildPrice(!selectedChildPrice)} >
                                                <Text style={[styles.textHeading, { marginTop: 0 }]}>Price Per Child</Text>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {selectedTour.price_child?.toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        }
                                        {selectedTour.price_infant > 0 &&
                                            <TouchableOpacity style={[styles.umrahPrices, selectedInfantPrice ? styles.selectedUmrahPrice : {}]} onPress={() => setSelectedInfantPrice(!selectedInfantPrice)} >
                                                <Text style={[styles.textHeading, , { marginTop: 0 }]}>Price Per Infant</Text>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {selectedTour.price_infant?.toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    {(selectedInfantPrice || selectedChildPrice) &&
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: commonStylesSheet.darkForeground, borderRadius: 8, borderBottomWidth: 0.5, marginBottom: 0 }} >
                                            {selectedChildPrice &&
                                                <>
                                                    <View style={[styles.umrahPrices, {paddingVertical: 10}]}  >
                                                        <Text style={[styles.textHeading, , { marginTop: 0 }]}>Total Childs:</Text>
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {(selectedTour.price_child * umrahPassengersChild)?.toLocaleString()}</Text>
                                                    </View>
                                                    <View style={[styles.umrahPrices, {paddingVertical: 10}]}  >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={[styles.textHeading, { marginTop: 0, }]}>{selectedTour.price_child?.toLocaleString()} x  </Text>
                                                            <View style={[styles.counterContainer, { position: 'relative' }]}>
                                                                <View style={styles.counterButtons}>
                                                                    <Icon type='material-community' name='minus' iconStyle={styles.counterIcons}
                                                                        disabled={umrahPassengersChild <= 0}
                                                                        onPress={() => setUmrahPassengersChild(umrahPassengersChild - 1)}
                                                                    />
                                                                    <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginHorizontal: 2 }}>{umrahPassengersChild}</Text>
                                                                    <Icon type='material-community' name='plus' iconStyle={styles.counterIcons}
                                                                        disabled={umrahPassengersChild >= 6}
                                                                        onPress={() => setUmrahPassengersChild(umrahPassengersChild + 1)}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </>
                                            }

                                            {selectedInfantPrice &&
                                                <>
                                                    <View style={[styles.umrahPrices, {paddingVertical: 10}]}  >
                                                        <Text style={[styles.textHeading, { marginTop: 0 }]}>Total Infants:</Text>
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 15, }}>PKR {(selectedTour.price_infant * umrahPassengersInfant)?.toLocaleString()}</Text>
                                                    </View>
                                                    <View style={[styles.umrahPrices, {paddingVertical: 10}]}  >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={[styles.textHeading, { marginTop: 0, }]}>{selectedTour.price_infant?.toLocaleString()} x  </Text>
                                                            <View style={[styles.counterContainer, { position: 'relative' }]}>
                                                                <View style={styles.counterButtons}>
                                                                    <Icon type='material-community' name='minus' iconStyle={styles.counterIcons}
                                                                        disabled={umrahPassengersInfant <= 0}
                                                                        onPress={() => setUmrahPassengersInfant(umrahPassengersInfant - 1)}
                                                                    />
                                                                    <Text style={{ fontSize: 14, fontWeight: '500', color: commonStylesSheet.modalsText, marginHorizontal: 2 }}>{umrahPassengersInfant}</Text>
                                                                    <Icon type='material-community' name='plus' iconStyle={styles.counterIcons}
                                                                        disabled={umrahPassengersInfant >= 6}
                                                                        onPress={() => setUmrahPassengersInfant(umrahPassengersInfant + 1)}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </>
                                            }

                                        </View>
                                    }




                                </View>


                                <Text style={[styles.textHeading, { marginBottom: 0 }]}>Description</Text>
                                <View style={{ flexDirection: 'column', marginVertical: 0 }}>
                                    <RenderHtml contentWidth={screenWidth} source={{
                                        html: `
                                    <div style="color: ${commonStylesSheet.filtersStar}; background-color: ${commonStylesSheet.screenBackground}; "> ${selectedTour.description} </div>`
                                    }}
                                        tagsStyles={htmlTagsStyles}
                                    />

                                </View>




                                <Text style={[styles.textHeading, { marginTop: 5, marginBottom: 0 }]}>Terms & Conditions</Text>
                                <View style={{ flexDirection: 'column', }}>
                                    <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedTour.terms_conditions} </div>` }}

                                        tagsStyles={htmlTagsStyles} />
                                </View>



                                <Text style={styles.textHeading}>Company Details</Text>
                                <View style={{ width: (90 / 100) * screenWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minHeight: 80 }}>
                                        {selectedTour?.agency?.logo ?
                                            <Image style={[styles.packageImage, { width: 50, height: 50, borderRadius: 100, }]} resizeMode='stretch' src={`${base_url}${selectedTour?.agency?.logo}`} />
                                            :
                                            <Icon iconStyle={{ fontSize: 36 }} type='material-community' name='account-circle' />
                                        }
                                    </View>
                                    <View style={{ marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start', flex: 1, justifyContent: 'center', marginLeft: 8, minHeight: 80, }}>

                                        <TouchableOpacity onPress={() => handleViewCompany()} >
                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 18, fontWeight: 'bold', marginRight: 20, }} numberOfLines={2} ellipsizeMode="tail">
                                                {selectedTour?.agency?.first_name}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                            {selectedTour?.agency?.license_verified ?
                                                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                    <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                                </View>
                                                : <></>}

                                            {selectedTour?.agency?.iata_verified ?
                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                    <Image source={require('../../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                                </View>
                                                : <></>}
                                            {selectedTour?.agency?.hajj_verified ?
                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                    <Image source={require('../../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                                </View>
                                                : <></>}

                                            {selectedTour?.agency?.oep_verified ?
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
                                            Linking.openURL(`tel:${selectedTour?.agency?.phone}`)
                                        }}>
                                        <Icon type='material-community' name='phone' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 18, fontWeight: 'bold' }}>Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1.5 }]}
                                        onPress={() => {
                                            Linking.openURL(`whatsapp://send?text=${tripWhatsappMessage(selectedTour?.name)}&phone=${selectedTour?.agency?.phone}`)
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

export default SingleTour;




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



    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: commonStylesSheet.darkForeground,
    },
    counterButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: commonStylesSheet.muteText,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginHorizontal: 1

    },


    counterIcons: {
        fontSize: 24, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground
    },



    umrahPrices: {
        width: '48%',
        padding: 15,
        margin: 0,
        marginBottom: 3,

        borderWidth: 2,
        borderColor: '#FFFFFF00',
    },

    selectedUmrahPrice: {
        backgroundColor: commonStylesSheet.darkForeground,
        borderRadius: 12,

        ...commonStylesSheet.ThreeD,
        elevation: 10,

        borderWidth: 2,
        borderColor: commonStylesSheet.darkBackground,
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
