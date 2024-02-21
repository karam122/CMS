import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Modal,
    View,
    ScrollView,
    Pressable,
    PanResponder,
    Linking
} from 'react-native';

import { ActivityIndicator } from "@react-native-material/core";

import { base_url, roomWhatsappMessage } from '../../../APIs/constants';
import { Icon, BottomSheet } from '@rneui/themed';
import { GetRoomsToBook } from '../../../APIs/AppAPIs';

import SingleRoom from './SingleRoom';
import FiltersModal from './FiltersModal';
import { commonStylesSheet } from '../../../StyleSheets/CommonStylesheet';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



function RoomResults({ resultsModal, setResultsModal, finalDatesDetail, finalGuests, finalDestination, }) {
    let startY = 0;
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const [loadingRoomsToBook, setLoadingRoomsToBook] = React.useState(false);

    const [roomsToBook, setRoomsToBook] = React.useState([]);
    const [filteredRoomsToBook, setFilteredRoomsToBook] = React.useState([]);
    // const [roomFeatures, setRoomFeatures] = React.useState([]);
    // const [hotelFeatures, setHotelFeatures] = React.useState([]);
    // const [allTypes, setAllTypes] = React.useState([]);
    const [filtersData, setFiltersData] = React.useState({});

    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [selectedRoomModal, setSelectedRoomModal] = React.useState(false);
    const [totalNights, setTotalNights] = React.useState(0);

    const [filtersModal, setFiltersModal] = React.useState(false);

    const [sortBottom, setSortBottom] = React.useState(false);
    const [currentSort, setCurrentSort] = React.useState('recent_first');
    const sortOptions = [
        { key: 'recent_first', value: 'Recent First' }, { key: 'oldest_first', value: 'Oldest First' },
        { key: 'lowest_price', value: 'Lowest Price' }, { key: 'heighest_price', value: 'Highest Price' }, { key: 'rating', value: 'Rating Stars (5 to 0)' }, { key: 'inv_rating', value: 'Rating Stars (0 to 5)' }, { key: 'popularity', value: 'Most Featured' },];
    const sortRooms = (a, b) => {
        if (currentSort === 'lowest_price') {
            return a.lowest_price - b.lowest_price;
        } else if (currentSort === 'heighest_price') {
            return b.lowest_price - a.lowest_price;
        } else if (currentSort === 'rating') {
            return b.hotel.rating - a.hotel.rating;
        } else if (currentSort === 'inv_rating') {
            return a.hotel.rating - b.hotel.rating;
        } else if (currentSort === 'popularity') {
            return b.features.length - a.features.length;
        } else if (currentSort === 'recent_first') {
            return b.id - a.id;
        } else if (currentSort === 'oldest_first') {
            return a.id - b.id;
        }  
        
        else {
            return a.lowest_price - b.lowest_price;
        }
    };


    const fetchRoomsToBook = () => {
        setLoadingRoomsToBook(true);
        const finalData = {
            adults: finalGuests.NoAdults,
            childs: finalGuests.NoChilds,
            destination_city: finalDestination.city ? finalDestination.city : '',
            destination_country: finalDestination.country ? finalDestination.country : '',
            type_id: finalGuests.roomType.id
        };
        GetRoomsToBook(finalData)
            .then(res => {
                setRoomsToBook(res.data.data)
                setFilteredRoomsToBook(res.data.data)
                setFiltersData(res.data.filters_data)
                setAppliedFilters({
                    ...appliedFilters,
                    priceFilter: [res.data.filters_data.price_range.minimum, res.data.filters_data.price_range.maximum]

                })
                setLoadingRoomsToBook(false);
            })
            .catch(err => {
                setLoadingRoomsToBook(false);
                console.log('RoomErr', err?.response);
            });
    };
    React.useEffect(() => {
        setTotalNights(Math.ceil((finalDatesDetail?.checkout - finalDatesDetail?.checkin) / (1000 * 60 * 60 * 24)))
        fetchRoomsToBook();
    }, []);



    const [appliedFilters, setAppliedFilters] = React.useState({
        priceFilter: [0, 0],
        starsFilter: 0,
        roomFeatures: [],
        roomTypes: [],
        hotelAmenities: [],
        hotelChains: []

    });
    const [applyingFilters, setApplyingFilters] = React.useState(false);
    const applyFilters = (priceFilter, starsFilter, roomFeatures, roomTypes, hotelAmenities, hotelChains, reset) => {
        if (!reset) {
            // setApplyingFilters(true);
            setFiltersModal(false);
        }
        setAppliedFilters({
            priceFilter: priceFilter,
            starsFilter: starsFilter,
            roomFeatures: roomFeatures,
            roomTypes: roomTypes,
            hotelAmenities: hotelAmenities,
            hotelChains: hotelChains
        });

        const filteredRooms = roomsToBook.filter(room => {
            return (
                room.lowest_price >= priceFilter[0] && room.lowest_price <= priceFilter[1] &&
                (starsFilter === 0 || room.hotel.rating === starsFilter) &&
                (roomFeatures.length === 0 ||
                    roomFeatures.some(roomFeatureId =>
                        room.features.some(feature =>
                            feature.status === true && feature.id === roomFeatureId
                        )
                    )
                ) &&
                (roomTypes.length === 0 ||
                    roomTypes.includes(room.type)
                ) &&
                (hotelAmenities.length === 0 ||
                    hotelAmenities.some(hotelFeatureId =>
                        room.hotel.features.some(feature =>
                            feature.status === true && feature.id === hotelFeatureId
                        )
                    )
                ) &&
                (hotelChains.length === 0 ||
                    hotelChains.includes(room.hotel.id)
                )

            )
        });
        setFilteredRoomsToBook(filteredRooms);

    };



    return (
        <View>
            {selectedRoomModal &&
                <SingleRoom selectedRoomx={selectedRoom}
                    selectedRoomModal={selectedRoomModal}
                    setSelectedRoomModal={(value) => setSelectedRoomModal(value)}
                    totalNights={totalNights}
                    finalDatesDetail={finalDatesDetail}
                    finalDestination={finalDestination}
                    finalGuests={finalGuests}
                />
            }
            {filtersModal &&
                <FiltersModal filtersModal={filtersModal}
                    setFiltersModal={(value) => setFiltersModal(value)}
                    filtersData={filtersData}
                    appliedFilters={appliedFilters}
                    applyFilters={applyFilters}
                />
            }

            <Modal
                animationType="slide"
                transparent
                visible={sortBottom}
                onRequestClose={() => {
                    setSortBottom(!sortBottom);
                }}
            >
                <View style={[styles.modalOverlay]}>
                    <Pressable style={styles.noneModal} onPress={() => { setSortBottom(false) }} />
                    <View style={styles.modalViewOne}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} onTouchStart={(evt) => startY = evt.nativeEvent.pageY} onTouchEnd={(evt) => { const deltaY = evt.nativeEvent.pageY - startY; if (deltaY > 2) { setSortBottom(false) } }}>
                            <View style={{ height: 4, width: 40, backgroundColor: commonStylesSheet.modalsText, borderRadius: 8, marginVertical: 20, marginTop: 25 }} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', paddingHorizontal: 5, marginBottom: 10 }}>Sort by</Text>
                        <ScrollView contentContainerStyle={[{ paddingHorizontal: 5 }]} showsVerticalScrollIndicator={false} onPress={(e) => { }}>

                            {
                                sortOptions.map((sort, index) => (
                                    currentSort === sort.key ?
                                        <View key={index} style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{sort.value}</Text>
                                            <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                        </View> :
                                        <TouchableOpacity onPress={() => { setCurrentSort(sort.key); setSortBottom(false) }} key={index} style={{ marginVertical: 15 }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{sort.value}</Text>
                                        </TouchableOpacity>
                                ))
                            }

                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={resultsModal}
                onRequestClose={() => {
                    setResultsModal(!resultsModal);
                }
                }>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Icon type='ionicon' name='arrow-back' onPress={() => setResultsModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalDestination?.city}</Text>
                                <Text style={[{ marginBottom: 1, marginLeft: 10, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalGuests?.NoRooms}</Text>

                                <Icon type='material-community' name='bed-king-outline' iconProps={{ style: { fontSize: 25, marginLeft: 2 } }} />
                                <Text style={[{ marginBottom: 1, marginLeft: 10, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalGuests?.NoAdults}</Text>
                                <Icon type='material-community' name='account-multiple-outline' iconProps={{ style: { fontSize: 27, marginLeft: 2 } }} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>{`${finalDatesDetail?.checkin.toLocaleDateString('en-US', dateOptions)}  -  ${finalDatesDetail?.checkout.toLocaleDateString('en-US', dateOptions)}  /   ${totalNights} nights`}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalBoody}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 0, marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => setSortBottom(true)} style={styles.headerButtons}  disabled={roomsToBook.length === 0}>
                                <Icon type='material-community' name='sort-alphabetical-variant' iconProps={{ style: { color: commonStylesSheet.modalsText, fontSize: 22 } }} />
                                <Text style={{ color: 'black', fontSize: 15, marginLeft: 7, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>Sort</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFiltersModal(true)} style={styles.headerButtons}  disabled={roomsToBook.length === 0}>
                                <Icon type='material-community' name='filter-outline' iconProps={{ style: { color: commonStylesSheet.modalsText, fontSize: 22 } }} />
                                <Text style={{ color: 'black', fontSize: 15, marginLeft: 7, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>Filter</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.headerButtons}  disabled={roomsToBook.length === 0}>
                                <Icon type='material-community' name='map-outline' iconProps={{ style: { color: commonStylesSheet.modalsText, fontSize: 22 } }} />
                                <Text style={{ color: 'black', fontSize: 15, marginLeft: 7, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>Map</Text>
                            </TouchableOpacity> */}
                        </View>
                        <ScrollView nestedScrollEnabled contentContainerStyle={{ marginTop: 0, paddingBottom: 80, alignItems: 'center' }} showsVerticalScrollIndicator={false} >
                            {(loadingRoomsToBook || applyingFilters) ?
                                <View style={{ height: 300, flexDirection: 'column', justifyContent: 'flex-end' }}>
                                    <ActivityIndicator size={60} color={commonStylesSheet.darkBackground} />
                                </View>
                                :
                                <View >
                                    {filteredRoomsToBook.length > 0 ?
                                        filteredRoomsToBook.sort(sortRooms).map((room, index) => (
                                            <View key={index} style={styles.packageOuter}>
                                                <TouchableOpacity onPress={() => { setSelectedRoom({id: room.id}); setSelectedRoomModal(true); }} style={[styles.package, { position: 'relative' }]}>
                                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${room.images[0]}`} />
                                                    <View style={{ position: 'absolute', backgroundColor: 'white', right: 0, bottom: 75 }}>
                                                        <Text style={{ padding: 10, color: 'black', fontSize: 20, fontWeight: 'bold' }}>Rs. {room.lowest_price.toLocaleString()}</Text>
                                                    </View>
                                                    <View style={styles.packageBottom} >
                                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsHeadings, fontSize: 20, fontWeight: 'bold' }}>{room.name}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                            <Icon type='ionicon' name='business' color={commonStylesSheet.modalsText} iconProps={{ fontSize: 14, marginRight: 5 }} />
                                                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginVertical: 3 }}>{room.hotel?.name}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>

                                                <View style={{ maxWidth: '100%', minWidth: '100%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginVertical: 10, justifyContent: 'space-between', paddingHorizontal: 5, }} >
                                                    <View style={[styles.inlineFeatures, { marginBottom: 2 }]}>
                                                        <Icon style={styles.inlineFeaturesIcon} type='material-community' name='bed-single-outline' color={commonStylesSheet.modalsText} />
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{room.hotel.rooms} {room.hotel.rooms > 1 ? 'Bedrooms' : 'Bedroom'}</Text>
                                                    </View>
                                                    <View style={[styles.inlineFeatures, { marginBottom: 2 }]}>
                                                        <Icon style={styles.inlineFeaturesIcon} type='material-community' name='bed-king-outline' color={commonStylesSheet.modalsText} />
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{room.beds} {room.beds > 1 ? 'Beds' : 'Bed'}</Text>
                                                    </View>
                                                    {
                                                        room?.hotel?.features?.filter(datum => { return datum.status }).map((hFeat, index) => (
                                                            <View key={index} style={[styles.inlineFeatures, { marginBottom: 2 }]}>
                                                                <Icon style={styles.inlineFeaturesIcon} type={hFeat.icon_type} name={hFeat.icon} color={commonStylesSheet.modalsText} />
                                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{hFeat.name}</Text>
                                                            </View>
                                                        ))
                                                    }
                                                    {
                                                        room?.features?.filter(datum => { return datum.status }).map((hFeat, index) => (
                                                            <View key={index} style={[styles.inlineFeatures, { marginBottom: 2 }]}>
                                                                <Icon style={styles.inlineFeaturesIcon} type={hFeat.icon_type} name={hFeat.icon} color={commonStylesSheet.modalsText} />
                                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{hFeat.name}</Text>
                                                            </View>
                                                        ))
                                                    }

                                                </View>

                                                <View style={{ width: (90 / 100) * screenWidth, marginTop: 0, marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', }}>
                                                        {room?.agency?.logo ?
                                                            <Image style={[styles.packageImage, { width: 50, height: 50, borderRadius: 100, }]} resizeMode='stretch' src={`${base_url}${room?.agency?.logo}`} />
                                                            : <Icon iconStyle={{ fontSize: 36 }} type='material-community' name='account-circle' />
                                                        }
                                                    </View>
                                                    <View style={{ marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start', flex: 1, justifyContent: 'center', marginLeft: 8, }}>

                                                        <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14, fontWeight: 'bold', marginRight: 20, }} numberOfLines={2} ellipsizeMode="tail">
                                                            {room?.agency?.first_name}
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                            {room?.agency?.license_verified ?
                                                                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                                    <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                                                </View>
                                                                : <></>}

                                                            {room?.agency?.iata_verified ?
                                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                                    <Image source={require('../../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                                                </View>
                                                                : <></>}
                                                            {room?.agency?.hajj_verified ?
                                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                                    <Image source={require('../../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                                                </View>
                                                                : <></>}

                                                            {room?.agency?.oep_verified ?
                                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 2 }}>
                                                                    <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                    <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>OEP</Text>
                                                                </View>
                                                                : <></>}

                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={{ flex: 1, marginTop: 2, marginBottom: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 0, marginHorizontal: 0 }}>
                                                    <TouchableOpacity
                                                        style={[styles.shareButton, { backgroundColor: commonStylesSheet.callButton, borderBottomLeftRadius: 12 }]}
                                                        onPress={() => { setSelectedRoom({id: room.id}); setSelectedRoomModal(true); }}>
                                                        <Icon type='material-community' name='information-variant' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12, }} numberOfLines={2}>Detail</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1 }]}
                                                        onPress={() => {
                                                            Linking.openURL(`tel:${room?.agency?.phone}`)
                                                        }}>
                                                        <Icon type='material-community' name='phone' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12 }}>Call</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1 }]}
                                                        onPress={() => {
                                                            Linking.openURL(`whatsapp://send?text=${(roomWhatsappMessage(`${room?.name} in ${room.hotel?.name}`))}&phone=${room?.agency?.phone}`)
                                                        }}>
                                                        <Icon type='material-community' name='whatsapp' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12, }} numberOfLines={2}>WhatsApp</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.shareButton, { backgroundColor: commonStylesSheet.callButton, flex: 1, borderBottomRightRadius: 12 }]}
                                                        onPress={() => { }}>
                                                        <Icon type='material-community' name='share-variant' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12 }}>Share</Text>
                                                    </TouchableOpacity>
                                                </View>


                                            </View>
                                        ))
                                        :
                                        <View style={{ height: 300, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Text style={{ color: 'black' }}>No match for your search</Text>
                                            <Text style={{ color: 'black', marginTop: 10 }}>Try other search parameters</Text>
                                        </View>
                                    }

                                </View>
                            }


                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </View>
    );
}



export default RoomResults;



const styles = StyleSheet.create({
    shareButton: {
        flex: 1,
        // marginHorizontal: 3,
        flexDirection: 'column',
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: commonStylesSheet.darkForeground

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


    headerButtons: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: commonStylesSheet.darkForeground,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,

        ...commonStylesSheet.ThreeD

    },


    modalView: {
        paddingBottom: 100,
        backgroundColor: commonStylesSheet.screenBackground,
        height: screenHeight,
        width: screenWidth,

    },
    modalBoody: {
        flexDirection: 'column',
        paddingHorizontal: 15,
        marginVertical: 15,
        // alignItems: 'center'
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


    package: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    packageOuter: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 4,
        width: '100%',
        backgroundColor: commonStylesSheet.darkForeground,

        ...commonStylesSheet.ThreeD
    },
    packageImage: {
        // borderWidth: 1,
        backgroundColor: commonStylesSheet.darkForeground,
        height: 180,
        width: '100%',
    },

    packageBottom: {
        width: '100%',
        marginVertical: 10,
        paddingHorizontal: 10,

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
