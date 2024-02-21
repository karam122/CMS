



import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
    TextInput as TextInnput,
    ScrollView,
    TouchableWithoutFeedback,
    Pressable,
    FlatList
} from 'react-native';

import { TextInput, } from "@react-native-material/core";

import { Icon } from '@rneui/themed';
import { GetDistHotelLocs, GetDistTransportLocs, GetTransportTypes } from '../../APIs/AppAPIs';

import TransportResults from './TransportBookingModals/TransportResults';
import RoomAdultsChilds from './HotelBookingModals/RoomAdultsChilds';
import DatesModal from './HotelBookingModals/DatesModal';
import TimesModal from './HotelBookingModals/TimesModal';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


function TransportBookings() {

    const [destinationModal, setDestinationModal] = React.useState(false);
    const [destinationModalValue, setDestinationModalValue] = React.useState('origin');
    const [passengersBottom, setPassengersBottom] = React.useState(false);
    const [carTypeBottom, setCarTypeBottom] = React.useState(false);

    const [guestModal, setGuestModal] = React.useState(false);
    const [dateModal, setDateModal] = React.useState(false);
    const [timeModal, setTimeModal] = React.useState(false);
    const [resultsModal, setResultsModal] = React.useState(false);

    const [distLocations, setDistLocations] = React.useState([]);
    const [transportTypes, setTransportTypes] = React.useState([]);


    const [searchDestination, setSearchDestination] = React.useState('');
    const [finalPickup, setFinalPickup] = React.useState({});
    const [finalDestination, setFinalDestination] = React.useState({});
    const [finalCarType, setFinalCarType] = React.useState({ id: -1, name: 'Any' });
    const [finalPassengers, setFinalPassengers] = React.useState(2);

    const [guestDetails, setGuestDetails] = React.useState({ roomType: { id: -1, name: 'Any' }, NoRooms: 0, NoAdults: 0, NoChilds: 0, NoInfants: 0, });
    const [finalGuests, setFinalGuests] = React.useState({ roomType: { id: -1, name: 'Any' }, NoRooms: 0, NoAdults: 0, NoChilds: 0, NoInfants: 0, });

    const [checkinDate, setCheckinDate] = React.useState(new Date());
    const [checkoutDate, setCheckoutDate] = React.useState(new Date());

    const [checkinTime, setCheckinTime] = React.useState(new Date());
    const [checkoutTime, setCheckoutTime] = React.useState(new Date());

    const [finalDatesDetail, setFinalDatesDetail] = React.useState({ checkin: new Date(), checkout: new Date(), });
    const [finalTimesDetail, setFinalTimesDetail] = React.useState({ checkin: new Date(), checkout: new Date(), });
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };

    const fetchDistLocations = () => {
        GetDistTransportLocs()
            .then(res => {
                setDistLocations(res.data.data)
            })
            .catch(err => {
                console.log('HotelErr', err?.response?.data);
            });
    };
    const fetchTransportTypes = () => {
        GetTransportTypes()
            .then(res => {
                let rTypes = res.data.data;
                rTypes.unshift({ id: -1, name: 'Any' })
                setTransportTypes(rTypes)
            })
            .catch(err => {
                console.log('HotelErr', err?.response);
            });
    };

    React.useEffect(() => {
        fetchDistLocations();
        fetchTransportTypes();
    }, []);

    const [filtersBottom, setFiltersBottom] = React.useState(false);


    return (




        // <View contentContainerStyle={{}} style={styles.container}>


        <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: 180, marginTop: -20 }]} showsVerticalScrollIndicator={false}>

            {/* DESTINATION */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={destinationModal}
                onRequestClose={() => {
                    setDestinationModal(!destinationModal);
                }}>
                <View style={styles.modalView}>

                    <View style={styles.modalHeader}>
                        <Icon type='ionicon' name='arrow-back' onPress={() => setDestinationModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />

                        <TextInnput
                            placeholder='Search Destination'
                            variant='outlined'
                            style={[{ width: (80 / 100) * screenWidth, borderWidth: 0, paddingHorizontal: 15 }]}
                            value={searchDestination}
                            onChangeText={setSearchDestination}
                        />
                    </View>
                    <View>
                        <View style={styles.modalBoody}>
                            <Text style={{ fontSize: 20, color: 'black', paddingHorizontal: 15 }}>Popular Cities</Text>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={[styles.modalBodyResults, { paddingBottom: 70 }]}
                                data={
                                    destinationModalValue === 'origin' ?
                                        distLocations.origin?.filter(datum => { return (searchDestination && searchDestination.trim() !== '') ? datum.city.toLowerCase().includes(searchDestination.toLowerCase()) || datum.country.toLowerCase().includes(searchDestination.toLowerCase()) : true })
                                        :
                                        distLocations.destination?.filter(datum => { return (searchDestination && searchDestination.trim() !== '') ? datum.city.toLowerCase().includes(searchDestination.toLowerCase()) || datum.country.toLowerCase().includes(searchDestination.toLowerCase()) : true })
                                }
                                renderItem={({ item: loc }) => (
                                
                                    destinationModalValue === 'origin' ? 
                                        (<TouchableOpacity onPress={() => { setFinalPickup(loc); setDestinationModal(false); }} style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View>
                                                <Text style={{ fontSize: 20, color: commonStylesSheet.modalsText }}>{loc.city}</Text>
                                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>{loc.country}</Text>
                                            </View>
                                            {finalPickup.id === loc.id &&
                                                <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                            }
                                        </TouchableOpacity>)
                                        :
                                        (<TouchableOpacity onPress={() => { setFinalDestination(loc); setDestinationModal(false); }} style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View>
                                                <Text style={{ fontSize: 20, color: commonStylesSheet.modalsText }}>{loc.city}</Text>
                                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>{loc.country}</Text>
                                            </View>
                                            {finalDestination.id === loc.id &&
                                                <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                            }
                                        </TouchableOpacity>)
                                )

                                }
                                keyExtractor={(item) => item.id.toString()}
                                ListEmptyComponent={() =>
                                    <View style={{ height: 250, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Text style={{ color: 'black', marginTop: 10 }}>Not any for today</Text>
                                    </View>
                                }
                            />

                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent
                visible={passengersBottom}
                onRequestClose={() => {
                    setPassengersBottom(!passengersBottom);
                }}
            >
                <View style={[styles.modalOverlay]}>
                    <Pressable style={styles.noneModal} onPress={() => { setPassengersBottom(false) }} />
                    <View style={styles.modalViewOne}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} onTouchStart={(evt) => startY = evt.nativeEvent.pageY} onTouchEnd={(evt) => { const deltaY = evt.nativeEvent.pageY - startY; if (deltaY > 2) { setPassengersBottom(false) } }}>
                            <View style={{ height: 4, width: 40, backgroundColor: commonStylesSheet.modalsText, borderRadius: 8, marginVertical: 20, marginTop: 25 }} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', paddingHorizontal: 5 }}>Total Passengers</Text>
                        <ScrollView contentContainerStyle={[{ paddingHorizontal: 10 }]} showsVerticalScrollIndicator={false} onPress={(e) => { }}>
                            {
                                [1, 2, 3, 4, 5, 6, 8, 10].map((pd, index) => (
                                    finalPassengers === pd ?
                                        <View key={index} style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{pd}</Text>
                                            <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                        </View> :
                                        <TouchableOpacity onPress={() => { setFinalPassengers(pd); setPassengersBottom(false) }} key={index} style={{ marginVertical: 15 }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{pd}</Text>
                                        </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent
                visible={carTypeBottom}
                onRequestClose={() => {
                    setCarTypeBottom(!carTypeBottom);
                }}
            >
                <View style={[styles.modalOverlay]}>
                    <Pressable style={styles.noneModal} onPress={() => { setCarTypeBottom(false) }} />
                    <View style={styles.modalViewOne}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} onTouchStart={(evt) => startY = evt.nativeEvent.pageY} onTouchEnd={(evt) => { const deltaY = evt.nativeEvent.pageY - startY; if (deltaY > 2) { setCarTypeBottom(false) } }}>
                            <View style={{ height: 4, width: 40, backgroundColor: commonStylesSheet.modalsText, borderRadius: 8, marginVertical: 20, marginTop: 25 }} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', paddingHorizontal: 5 }}>Car Type</Text>
                        <ScrollView contentContainerStyle={[{ paddingHorizontal: 10 }]} showsVerticalScrollIndicator={false} onPress={(e) => { }}>
                            {
                                transportTypes.map((type, index) => (
                                    finalCarType?.name === type.name ?
                                        <View key={index} style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{type.name}</Text>
                                            <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                        </View> :
                                        <TouchableOpacity onPress={() => { setFinalCarType(type); setCarTypeBottom(false) }} key={index} style={{ marginVertical: 15 }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{type.name}</Text>
                                        </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>


            {guestModal &&
                <RoomAdultsChilds guestModal={guestModal}
                    setGuestModal={(value) => setGuestModal(value)}
                    transportTypes={transportTypes}
                    guestDetails={guestDetails}
                    setGuestDetails={(value) => setGuestDetails(value)}
                    setFinalGuests={(value) => setFinalGuests(value)}
                />
            }

            {dateModal &&
                <DatesModal
                    dateModal={dateModal}
                    setDateModal={(value) => setDateModal(value)}
                    checkinDate={checkinDate}
                    checkoutDate={checkoutDate}
                    finalDatesDetail={finalDatesDetail}
                    setCheckinDate={(value) => setCheckinDate(value)}
                    setCheckoutDate={(value) => setCheckoutDate(value)}
                    setFinalDatesDetail={(value) => setFinalDatesDetail(value)}
                    headerValues={['Pick-up', 'Return']}
                />
            }
            {timeModal &&
                <TimesModal
                    timeModal={timeModal}
                    setTimeModal={(value) => setTimeModal(value)}
                    checkinTime={checkinTime}
                    checkoutTime={checkoutTime}
                    finalTimesDetail={finalTimesDetail}
                    setCheckinTime={(value) => setCheckinTime(value)}
                    setCheckoutTime={(value) => setCheckoutTime(value)}
                    setFinalTimesDetail={(value) => setFinalTimesDetail(value)}
                    headerValues={['Pick-up', 'Return']}
                />
            }


            {resultsModal &&
                <TransportResults resultsModal={resultsModal}
                    setResultsModal={(value) => setResultsModal(value)}
                    finalDatesDetail={finalDatesDetail}
                    finalTimesDetail={finalTimesDetail}
                    finalPickup={finalPickup}
                    finalDestination={finalDestination}
                    finalPassengers={finalPassengers}
                    finalCarType={finalCarType}
                />
            }



            <TouchableOpacity onPress={() => { setDestinationModalValue('origin'); setDestinationModal(true); }} style={styles.sBarContainer}>
                <View style={styles.sBar}>
                    <Text style={styles.sBarText}>Pickup location</Text>
                    <Icon type='ionicon' name='chevron-forward' iconProps={{ style: styles.sBarIcon }} />
                </View>
                {
                    finalPickup.city && <Text style={styles.sBarResultText}>{`${finalPickup.city}, ${finalPickup.country}`}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setDestinationModalValue('destination'); setDestinationModal(true); }} style={styles.sBarContainer}>
                <View style={styles.sBar}>
                    <Text style={styles.sBarText}>Drop-off Location</Text>
                    <Icon type='ionicon' name='chevron-forward' iconProps={{ style: styles.sBarIcon }} />
                </View>
                {
                    finalDestination.city && <Text style={styles.sBarResultText}>{`${finalDestination.city}, ${finalDestination.country}`}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setPassengersBottom(true); }} style={styles.sBarContainer}>
                <View style={styles.sBar}>
                    <Text style={styles.sBarText}>Total Passengers</Text>
                    <Icon type='ionicon' name='chevron-forward' iconProps={{ style: styles.sBarIcon }} />
                </View>
                <Text style={styles.sBarResultText}>{finalPassengers}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCarTypeBottom(true)} style={styles.sBarContainer}>
                <View style={styles.sBar}>
                    <Text style={styles.sBarText}>Car Type</Text>
                    <Icon type='ionicon' name='chevron-forward' iconProps={{ style: styles.sBarIcon }} />
                </View>
                <Text style={styles.sBarResultText}>{finalCarType?.name}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { setCheckinDate(finalDatesDetail.checkin); setCheckoutDate(finalDatesDetail.checkout); setDateModal(true); }} style={styles.sBarContainerDate}>
                    <View style={styles.sBar}>
                        <Text style={styles.sBarText}>Pick-up Date</Text>
                    </View>
                    <Text style={styles.sBarResultTextDates}>{finalDatesDetail.checkin.toLocaleDateString('en-US', dateOptions)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setCheckinTime(finalTimesDetail.checkin); setCheckoutTime(finalTimesDetail.checkout); setTimeModal(true); }} style={styles.sBarContainerDate}>
                    <View style={styles.sBar}>
                        <Text style={styles.sBarText}>Pick-up Time</Text>
                    </View>
                    <Text style={styles.sBarResultTextDates}>{finalTimesDetail.checkin.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { setCheckinDate(finalDatesDetail.checkin); setCheckoutDate(finalDatesDetail.checkout); setDateModal(true); }} style={styles.sBarContainerDate}>
                    <View style={styles.sBar}>
                        <Text style={styles.sBarText}>Return Date</Text>
                    </View>
                    <Text style={styles.sBarResultTextDates}>{finalDatesDetail.checkout.toLocaleDateString('en-US', dateOptions)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setCheckinTime(finalTimesDetail.checkin); setCheckoutTime(finalTimesDetail.checkout); setTimeModal(true); }} style={styles.sBarContainerDate}>
                    <View style={styles.sBar}>
                        <Text style={styles.sBarText}>Return Time</Text>
                    </View>
                    <Text style={styles.sBarResultTextDates}>{finalTimesDetail.checkout.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setResultsModal(true); }} style={[styles.modalSearchButton, {}]}>
                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Search</Text>
            </TouchableOpacity>
        </ScrollView >
    );

}


export default TransportBookings;



const styles = StyleSheet.create({
    container: {
        // height: screenHeight - 220,

    },
    sBarContainer: {
        borderBottomWidth: 1.4,
        borderColor: commonStylesSheet.muteText,
        backgroundColor: commonStylesSheet.darkForeground,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginVertical: 15,
        paddingHorizontal: 10,
        paddingVertical: 20,

        ...commonStylesSheet.ThreeD
    },
    sBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sBarResultText: {

        marginTop: 3, marginBottom: -5, fontSize: 15, color: 'black'

    },
    sBarResultTextDates: {

        marginTop: 5, marginBottom: -5, fontSize: 15, color: 'black'

    },
    sBarText: {
        color: commonStylesSheet.muteText,
        fontSize: 15,
    },
    sBarIcon: {
        fontSize: 25,
        fontWeight: 'bold',


    },
    sBarContainerDate: {
        width: (45 / 100) * screenWidth,
        borderBottomWidth: 1.4,
        borderColor: commonStylesSheet.muteText,
        backgroundColor: commonStylesSheet.darkForeground,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginVertical: 15,
        paddingHorizontal: 10,
        paddingVertical: 20,


        ...commonStylesSheet.ThreeD
    },


    modalSearchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        width: (screenWidth * 90) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center',
        marginVertical: 10,



        ...commonStylesSheet.ThreeD


    },


    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-end', // Align at the bottom
    },
    noneModal: {
        height: (50 / 100) * screenHeight
    },
    modalViewOne: {
        height: (50 / 100) * screenHeight,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    // modalView: {
    //     flexDirection: 'column',
    //     justifyContent: 'space-between',
    //     // paddingBottom: 50,
    //     backgroundColor: 'white',
    //     padding: 35,
    //     height: screenHeight,
    //     width: screenWidth,
    //     alignItems: 'center',

    // },




    modalView: {
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
        backgroundColor: commonStylesSheet.darkForeground,
        // flexDirection: 'column',
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





    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },


    package: {
        // borderWidth: 0.7,
        width: (90 / 100) * screenWidth,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // paddingVertical: 5,
        // backgroundColor: '#D3D3D3'


    },
    packageOuter: {
        // borderWidth: 0.7,
        marginVertical: 5,
        borderRadius: 4,
        // paddingVertical: 5,
        // backgroundColor: '#D3D3D3'



    },
    packageBottom: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
    },

    inlineFeatures: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    inlineFeaturesIcon: {
        marginRight: 1
    }
});
