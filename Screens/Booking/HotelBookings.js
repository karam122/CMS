



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
import { GetDistHotelLocs, GetRoomTypes,  } from '../../APIs/AppAPIs';

import RoomResults from './HotelBookingModals/RoomResults';
import RoomAdultsChilds from './HotelBookingModals/RoomAdultsChilds';
import DatesModal from './HotelBookingModals/DatesModal';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


function HotelBookings() {

    const [destinationModal, setDestinationModal] = React.useState(false);
    const [guestModal, setGuestModal] = React.useState(false);
    const [dateModal, setDateModal] = React.useState(false);
    const [resultsModal, setResultsModal] = React.useState(false);

    const [distLocations, setDistLocations] = React.useState([]);
    const [roomTypes, setRoomTypes] = React.useState([]);


    const [searchDestination, setSearchDestination] = React.useState('');
    const [finalDestination, setFinalDestination] = React.useState({});

    const [guestDetails, setGuestDetails] = React.useState({ roomType: { id: -1, name: 'Any' }, NoRooms: 1, NoAdults: 2, NoChilds: 0, NoInfants: 0, });
    const [finalGuests, setFinalGuests] = React.useState({ roomType: { id: -1, name: 'Any' }, NoRooms: 1, NoAdults: 2, NoChilds: 0, NoInfants: 0, });

    const [checkinDate, setCheckinDate] = React.useState(new Date());
    const [checkoutDate, setCheckoutDate] = React.useState(new Date());

    const [finalDatesDetail, setFinalDatesDetail] = React.useState({ checkin: new Date(), checkout: new Date(), });
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };

    const fetchDistLocations = () => {
        GetDistHotelLocs()
            .then(res => {
                setDistLocations(res.data.data)
            })
            .catch(err => {
                console.log('HotelErr', err?.response?.data);
            });
    };
    const fetchRoomTypes = () => {
        GetRoomTypes()
            .then(res => {
                let rTypes = res.data.data;
                rTypes.unshift({ id: -1, name: 'Any' })
                setRoomTypes(rTypes)
            })
            .catch(err => {
                console.log('HotelErr', err?.response);
            });
    };

    React.useEffect(() => {
        fetchDistLocations();
        fetchRoomTypes();
    }, []);

    const [filtersBottom, setFiltersBottom] = React.useState(false);


    return (




        <View contentContainerStyle={{}} style={styles.container}>
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
                                data={distLocations.filter(datum => { return (searchDestination && searchDestination.trim() !== '') ? datum.city.toLowerCase().includes(searchDestination.toLowerCase()) || datum.country.toLowerCase().includes(searchDestination.toLowerCase()) : true })}
                                renderItem={({ item: loc }) => (

                                    <TouchableOpacity onPress={() => { setFinalDestination(loc); setDestinationModal(false); }} style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 20, color: commonStylesSheet.modalsText }}>{loc.city}</Text>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>{loc.country}</Text>
                                        </View>
                                        {finalDestination.id === loc.id &&
                                            <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                        }
                                    </TouchableOpacity>
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

            {guestModal &&
                <RoomAdultsChilds guestModal={guestModal}
                    setGuestModal={(value) => setGuestModal(value)}
                    roomTypes={roomTypes}
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
                    headerValues={['Check-in', 'Check-out']}
                />

            }


            {resultsModal &&
                <RoomResults resultsModal={resultsModal}
                    setResultsModal={(value) => setResultsModal(value)}
                    finalDatesDetail={finalDatesDetail}
                    finalGuests={finalGuests}
                    finalDestination={finalDestination}
                />
            }



            <TouchableOpacity onPress={() => setDestinationModal(true)} style={styles.sBarContainer}>
                <View style={styles.sBar}>
                    <Text style={styles.sBarText}>Destination</Text>
                    <Icon type='ionicon' name='chevron-forward' iconProps={{ style: styles.sBarIcon }} />
                </View>
                {
                    finalDestination.city && <Text style={styles.sBarResultText}>{`${finalDestination.city}, ${finalDestination.country}`}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setGuestDetails({ ...finalGuests }); setGuestModal(true); }} style={styles.sBarContainer}>
                <View style={styles.sBar}>
                    <Text style={styles.sBarText}>Rooms, Adult, Children</Text>
                    <Icon type='ionicon' name='chevron-forward' iconProps={{ style: styles.sBarIcon }} />
                </View>
                <Text style={styles.sBarResultText}>{`${finalGuests.NoRooms}, ${finalGuests.NoAdults}, ${finalGuests.NoChilds}, ${finalGuests.roomType.name}`}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { setCheckinDate(finalDatesDetail.checkin); setCheckoutDate(finalDatesDetail.checkout); setDateModal(true); }} style={styles.sBarContainerDate}>
                    <View style={styles.sBar}>
                        <Text style={styles.sBarText}>Check-in Date</Text>
                    </View>
                    <Text style={styles.sBarResultTextDates}>{finalDatesDetail.checkin.toLocaleDateString('en-US', dateOptions)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setCheckinDate(finalDatesDetail.checkin); setCheckoutDate(finalDatesDetail.checkout); setDateModal(true); }} style={styles.sBarContainerDate}>
                    <View style={styles.sBar}>
                        <Text style={styles.sBarText}>Check-out Date</Text>
                    </View>
                    <Text style={styles.sBarResultTextDates}>{finalDatesDetail.checkout.toLocaleDateString('en-US', dateOptions)}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setResultsModal(true); }} style={[styles.modalSearchButton, { alignSelf: 'center', width: (90 / 100) * screenWidth, position: 'absolute', bottom: 50 }]}>
                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Search</Text>
            </TouchableOpacity>


        </View >
    );

}


export default HotelBookings;



const styles = StyleSheet.create({


    container: {
        height: screenHeight - 220,

    },
    sBarContainer: {
        borderBottomWidth: 1.4,
        borderColor: commonStylesSheet.muteText,
        backgroundColor: commonStylesSheet.darkForeground,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginVertical: 15,
        paddingHorizontal: 10,
        paddingVertical: 20
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
        paddingVertical: 20
    },


    modalSearchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        width: (screenWidth * 90) / 100,
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center'


    },
    counterButtons: {
        flexDirection: 'row',
        alignItems: 'center'

    },
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
