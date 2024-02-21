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
    Linking,
    PanResponder,
    TextInput,
    FlatList,
    ImageBackground
} from 'react-native';

import { ActivityIndicator } from "@react-native-material/core";

import { base_url, tripWhatsappMessage } from '../../APIs/constants';
import { Icon, BottomSheet } from '@rneui/themed';
import { GetToursToBook, GetTransportsToBook } from '../../APIs/AppAPIs';

import StarRating from 'react-native-star-rating';
import SingleTour from './TourBookingModals/SingleTour';
import FiltersModal from './TourBookingModals/FiltersModal';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



function TourBooking({ resultsModal, setResultsModal, finalDatesDetail, finalTimesDetail, finalPickup, finalDestination }) {
    let startY = 0;
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const [loadingTransportsToBook, setLoadingTransportsToBook] = React.useState(false);

    const [transportsToBook, setTransportsToBook] = React.useState([]);
    const [filteredTransportsToBook, setFilteredTransportsToBook] = React.useState([]);

    const [searchTour, setSearchTour] = React.useState('');

    const [filtersData, setFiltersData] = React.useState({});

    const [selectedTour, setSelectedTransport] = React.useState(null);
    const [selectedTourModal, setSelectedTransportModal] = React.useState(false);

    const [filtersModal, setFiltersModal] = React.useState(false);

    const [sortBottom, setSortBottom] = React.useState(false);
    const [currentSort, setCurrentSort] = React.useState('recent_first');
    const sortOptions = [
        { key: 'recent_first', value: 'Recent First' }, { key: 'oldest_first', value: 'Oldest First' },
        { key: 'lowest_price', value: 'Price (low to high)' }, { key: 'heighest_price', value: 'Price (high to low)' },
    ];

    const sortTransports = (a, b) => {
        if (currentSort === 'lowest_price') {
            return a.minimum_price - b.minimum_price;
        } else if (currentSort === 'heighest_price') {
            return b.minimum_price - a.minimum_price;
        } else if (currentSort === 'recent_first') {
            return b.id - a.id;
        } else if (currentSort === 'oldest_first') {
            return a.id - b.id;
        } else {
            return b.id - a.id;
        }
    };


    const fetchTourToBook = () => {
        setLoadingTransportsToBook(true);
        GetToursToBook()
            .then(res => {
                setTransportsToBook(res.data.data)
                setFilteredTransportsToBook(res.data.data)
                setFiltersData(res.data.filters_data)
                setAppliedFilters({
                    ...appliedFilters,
                    priceFilter: [res.data.filters_data.price_range.minimum, res.data.filters_data.price_range.maximum]

                })
                setLoadingTransportsToBook(false);
            })
            .catch(err => {
                setLoadingTransportsToBook(false);
                console.log('TranssportErr', err?.response);
            });
    };
    React.useEffect(() => {
        fetchTourToBook();
    }, []);

    function formatDate(inputDate) {
        return new Date(inputDate).toLocaleDateString(undefined, dateOptions);
    }

    const [appliedFilters, setAppliedFilters] = React.useState({
        priceFilter: [0, 0],
        transportFeatures: [],
        transportTypes: []

    });
    const [applyingFilters, setApplyingFilters] = React.useState(false);
    const applyFilters = (priceFilter, transportFeatures, transportTypes, reset) => {
        if (!reset) {
            // setApplyingFilters(true);
            setFiltersModal(false);
        }
        setAppliedFilters({
            priceFilter: priceFilter,
            transportFeatures: transportFeatures,
            transportTypes: transportTypes,
        });

        const filteredTransports = transportsToBook.filter(transport => {
            return (
                transport.minimum_price >= priceFilter[0] && transport.minimum_price <= priceFilter[1] &&

                (transportFeatures.length === 0 ||
                    transportFeatures.some(transportFeatureId =>
                        transport.features.some(feature =>
                            feature.status === true && feature.id === transportFeatureId
                        )
                    )
                ) &&
                (transportTypes.length === 0 ||
                    transportTypes.includes(transport.type)
                )

            )
        });
        setFilteredTransportsToBook(filteredTransports);

    };




    return (
        <View>
            {selectedTourModal &&
                <SingleTour selectedTourx={selectedTour}
                    selectedTourModal={selectedTourModal}
                    setSelectedTransportModal={(value) => setSelectedTransportModal(value)}
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
                    <View style={[styles.modalViewOne, { height: 280 }]}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} onTouchStart={(evt) => startY = evt.nativeEvent.pageY} onTouchEnd={(evt) => { const deltaY = evt.nativeEvent.pageY - startY; if (deltaY > 2) { setSortBottom(false) } }}>
                            <View style={{ height: 4, width: 40, backgroundColor: commonStylesSheet.modalsText, borderRadius: 8, marginVertical: 20, marginTop: 25 }} />
                        </View>
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

            <View style={{
                flexDirection: 'column',
                marginTop: -27,
                alignItems: 'center', width: (95 / 100) * screenWidth, backgroundColor: commonStylesSheet.screenBackground
            }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5, width: (90 / 100) * screenWidth }}>
                    <TouchableOpacity onPress={() => setSortBottom(true)} style={styles.headerButtons}>
                        <Icon type='material-community' name='sort-alphabetical-variant' iconProps={{ style: { color: commonStylesSheet.modalsText, fontSize: 22 } }} />
                        <Text style={{ color: 'black', fontSize: 15, marginLeft: 7, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>Sort</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFiltersModal(true)} disabled={transportsToBook.length === 0} style={styles.headerButtons}>
                        <Icon type='material-community' name='filter-outline' iconProps={{ style: { color: commonStylesSheet.modalsText, fontSize: 22 } }} />
                        <Text style={{ color: 'black', fontSize: 15, marginLeft: 7, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>Filter</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder='Search'
                    variant='outlined'
                    style={[{ width: (90 / 100) * screenWidth, borderWidth: 0, backgroundColor: commonStylesSheet.darkForeground, borderRadius: 12, padding: 10, paddingHorizontal: 20, ...commonStylesSheet.ThreeD, marginTop: 2, marginBottom: 10 }]}
                    inlineImageLeft='search_icon'
                    value={searchTour}
                    onChangeText={setSearchTour}
                />

                {(loadingTransportsToBook || applyingFilters) ?
                    <View style={{ height: 300, flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <ActivityIndicator size={60} color={commonStylesSheet.darkBackground} />
                    </View>
                    :
                    <FlatList


                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 680,
                            backgroundColor: commonStylesSheet.screenBackground
                        }}

                        data={
                            filteredTransportsToBook
                                .filter(datum => { return (searchTour && searchTour.trim() !== '') ? datum.name.toLowerCase().includes(searchTour.toLowerCase()) : true })
                                .sort(sortTransports)

                        }


                        renderItem={({ item: tour }) =>

                            <View style={styles.packageOuter}>
                                <TouchableOpacity onPress={() => { setSelectedTransport({ id: tour.id }); setSelectedTransportModal(true); }} style={[styles.package, { position: 'relative' }]}>
                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${tour.images[0]}`} />
                                    <View style={{ position: 'absolute', backgroundColor: 'white', right: 0, top: 130 }}>
                                        <Text style={{ padding: 10, color: 'black', fontSize: 20, fontWeight: 'bold' }}>PKR {tour.minimum_price.toLocaleString()}</Text>
                                    </View>
                                    {tour?.rating > 0 &&
                                        <View style={{ position: 'absolute', backgroundColor: 'white', paddingVertical: 5, right: 0, top: 4 }}>
                                            <View style={{}}>
                                                <StarRating
                                                    fullStarColor={'#FFD700'}
                                                    disabled
                                                    maxStars={5}
                                                    rating={tour?.rating}
                                                    starSize={18}
                                                    buttonStyle={{ marginHorizontal: 4 }}

                                                />
                                            </View>
                                        </View>
                                    }
                                    <View style={styles.packageBottom} >
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsHeadings, fontSize: 20, fontWeight: 'bold' }}>{tour.name}</Text>
                                    </View>

                                </TouchableOpacity>
                                <View style={{ width: (90 / 100) * screenWidth, marginVertical: 0, flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: 0 }}>
                                    <View style={{ width: '100%', marginVertical: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.filtersStar, fontSize: 14, flex: 1 }}>{tour.total_days} Days & {tour.total_nights} Nights</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.filtersStar, fontSize: 14, flex: 1 }}>{formatDate(tour.departure_date)} - {formatDate(tour.arrival_date)}</Text>
                                    </View>

                                    {tour.is_umrah &&
                                        <View style={{ width: '100%', marginTop: 10, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                            <View style={{ flexDirection: 'column', flex: 1, marginRight: 1, paddingRight: 5 }}>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, fontWeight: 'bold' }}>Makkah</Text>

                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{tour.makkah_hotel}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>{tour.makkah_km}M distance</Text>
                                                </View>
                                                {tour.makkah_shuttle &&
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                        <Icon type='material-community' name='bus' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>Shuttle Service</Text>
                                                    </View>
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, fontWeight: 'bold' }}>Madinah</Text>

                                                <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{tour.madinah_hotel}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>{tour.madinah_km}M distance</Text>
                                                </View>
                                                {tour.madinah_shuttle &&
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                        <Icon type='material-community' name='bus' iconStyle={{ color: commonStylesSheet.modalsText }} />
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginLeft: 5 }}>Shuttle Service</Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    }



                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginVertical: 10, justifyContent: tour?.features?.length > 3 ? 'space-between' : 'flex-start', }} >

                                        {
                                            tour?.features?.filter(datum => { return datum.status }).map((hFeat, index) => (
                                                <View key={index} style={[styles.inlineFeatures, { marginBottom: 2 }]}>
                                                    <Icon style={styles.inlineFeaturesIcon} type={hFeat.icon_type} name={hFeat.icon} color={commonStylesSheet.modalsText} />
                                                    <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{hFeat.name}</Text>
                                                </View>
                                            ))
                                        }

                                    </View>

                                    <View style={{ width: (90 / 100) * screenWidth, marginTop: 0, marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', }}>
                                            {tour?.agency?.logo ?
                                                <Image style={[styles.packageImage, { width: 50, height: 50, borderRadius: 100, }]} resizeMode='stretch' src={`${base_url}${tour?.agency?.logo}`} />
                                                : <Icon iconStyle={{ fontSize: 36 }} type='material-community' name='account-circle' />
                                            }
                                        </View>
                                        <View style={{ marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start', flex: 1, justifyContent: 'center', marginLeft: 8, }}>

                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14, fontWeight: 'bold', marginRight: 20, }} numberOfLines={2} ellipsizeMode="tail">
                                                {tour?.agency?.first_name}
                                            </Text>
                                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                {tour?.agency?.license_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        <Image source={require('../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                                    </View>
                                                    : <></>}

                                                {tour?.agency?.iata_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                        <Image source={require('../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                                    </View>
                                                    : <></>}
                                                {tour?.agency?.hajj_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                        <Image source={require('../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                                    </View>
                                                    : <></>}

                                                {tour?.agency?.oep_verified ?
                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 2 }}>
                                                        <Image source={require('../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>OEP</Text>
                                                    </View>
                                                    : <></>}

                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, marginTop: 2, marginBottom: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 0, marginHorizontal: 0 }}>
                                        <TouchableOpacity
                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.callButton, borderBottomLeftRadius: 12 }]}
                                            onPress={() => { setSelectedTransport({ id: tour.id }); setSelectedTransportModal(true); }}>
                                            <Icon type='material-community' name='information-variant' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12, }} numberOfLines={2}>Detail</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1 }]}
                                            onPress={() => {
                                                Linking.openURL(`tel:${tour?.agency?.phone}`)
                                            }}>
                                            <Icon type='material-community' name='phone' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12 }}>Call</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1 }]}
                                            onPress={() => {
                                                Linking.openURL(`whatsapp://send?text=${(tripWhatsappMessage(tour?.name))}&phone=${tour?.agency?.phone}`)
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


                            </View>

                        }
                        keyExtractor={(item) => item.id.toString()}



                        ListEmptyComponent={() =>
                            <View style={{ height: 200, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Text style={{ color: 'black' }}>No match for your search</Text>
                                <Text style={{ color: 'black', marginTop: 10 }}>Try other search parameters</Text>
                            </View>
                        }

                    />

                }


            </View>

        </View>
    );
}



export default TourBooking;



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
        marginVertical: 5,
        paddingHorizontal: 10,
    },

    inlineFeatures: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
        // borderWidth: 0.5,
        padding: 2,
        paddingHorizontal: 5
    },
    inlineFeaturesIcon: {
        marginRight: 2
    }
});
