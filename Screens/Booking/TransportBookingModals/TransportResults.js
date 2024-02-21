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
    ActivityIndicator,
    Linking
} from 'react-native';

// import { ActivityIndicator } from "@react-native-material/core";

import { base_url } from '../../../APIs/constants';
import { transportWhatsappMessage } from '../../../APIs/constants';
import { Icon, BottomSheet } from '@rneui/themed';
import { GetTransportsToBook } from '../../../APIs/AppAPIs';

import SingleTransport from './SingleTransport';
import FiltersModal from './FiltersModal';
import { commonStylesSheet } from '../../../StyleSheets/CommonStylesheet';
import { TextInput } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



function TransportResults({ resultsModal, setResultsModal, finalDatesDetail, finalTimesDetail, finalPickup, finalDestination, finalPassengers, finalCarType }) {
    let startY = 0;
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const [loadingTransportsToBook, setLoadingTransportsToBook] = React.useState(false);

    const [transportsToBook, setTransportsToBook] = React.useState([]);
    const [filteredTransportsToBook, setFilteredTransportsToBook] = React.useState([]);

    const [filtersData, setFiltersData] = React.useState({});

    const [selectedTransport, setSelectedTransport] = React.useState(null);
    const [selectedTransportModal, setSelectedTransportModal] = React.useState(false);

    const [filtersModal, setFiltersModal] = React.useState(false);
    const [searchTour, setSearchTour] = React.useState('');

    const [sortBottom, setSortBottom] = React.useState(false);
    const [currentSort, setCurrentSort] = React.useState('recent_first');
    const sortOptions = [
        { key: 'recent_first', value: 'Recent First' }, { key: 'oldest_first', value: 'Oldest First' },
        { key: 'lowest_price', value: 'Price (low to high)' }, { key: 'heighest_price', value: 'Price (high to low)' }, { key: 'less_passengers', value: 'Passengers (less to more)' }, { key: 'more_passengers', value: 'Passengers (more to less)' }];

    const sortTransports = (a, b) => {
        if (currentSort === 'lowest_price') {
            return a.price_day - b.price_day;
        } else if (currentSort === 'heighest_price') {
            return b.price_day - a.price_day;
        } else if (currentSort === 'less_passengers') {
            return a.sitting_capacity - b.sitting_capacity;
        } else if (currentSort === 'more_passengers') {
            return b.sitting_capacity - a.sitting_capacity;
        } else if (currentSort === 'recent_first') {
            return b.id - a.id;
        } else if (currentSort === 'oldest_first') {
            return a.id - b.id;
        } else {
            return a.price_day - b.price_day;
        }
    };


    const fetchTransportToBook = () => {
        setLoadingTransportsToBook(true); 2
        const finalData = {
            pickup_city: finalPickup.city,
            destination_city: finalDestination.city,
            passengers: finalPassengers,
            car_type: finalCarType.id

        };
        GetTransportsToBook(finalData)
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
        fetchTransportToBook();
    }, []);



    const [appliedFilters, setAppliedFilters] = React.useState({
        priceFilter: [0, 0],
        transportFeatures: [],
        transportTypes: [],
        transportBrands: [],
        transportYears: []

    });
    const [applyingFilters, setApplyingFilters] = React.useState(false);
    const applyFilters = (priceFilter, transportFeatures, transportTypes, transportBrands, transportYears, reset) => {
        if (!reset) {
            // setApplyingFilters(true);
            setFiltersModal(false);
        }
        setAppliedFilters({
            priceFilter: priceFilter,
            transportFeatures: transportFeatures,
            transportTypes: transportTypes,
            transportBrands: transportBrands,
            transportYears: transportYears
        });

        const filteredTransports = transportsToBook.filter(transport => {
            return (
                transport.price_day >= priceFilter[0] && transport.price_day <= priceFilter[1] &&

                (transportFeatures.length === 0 ||
                    transportFeatures.some(transportFeatureId =>
                        transport.features.some(feature =>
                            feature.status === true && feature.id === transportFeatureId
                        )
                    )
                ) &&
                (transportTypes.length === 0 ||
                    transportTypes.includes(transport.type)
                ) &&
                (transportBrands.length === 0 ||
                    transportBrands.includes(transport.brand.toLowerCase())
                ) &&
                (transportYears.length === 0 ||
                    transportYears.includes(transport.model_year)
                )

            )
        });
        setFilteredTransportsToBook(filteredTransports);

    };



    return (
        <View>
            {selectedTransportModal &&
                <SingleTransport selectedTransportx={selectedTransport}
                    selectedTransportModal={selectedTransportModal}
                    setSelectedTransportModal={(value) => setSelectedTransportModal(value)}
                    finalPickup={finalPickup}
                    finalDestination={finalDestination}
                    finalPassengers={finalPassengers}
                    finalDatesDetail={finalDatesDetail}
                    finalTimesDetail={finalTimesDetail}
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
                    <View style={[styles.modalViewOne, { height: 350 }]}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} onTouchStart={(evt) => startY = evt.nativeEvent.pageY} onTouchEnd={(evt) => { const deltaY = evt.nativeEvent.pageY - startY; if (deltaY > 2) { setSortBottom(false) } }}>
                            <View style={{ height: 4, width: 40, backgroundColor: commonStylesSheet.modalsText, borderRadius: 8, marginVertical: 20, marginTop: 25 }} />
                        </View>
                        <ScrollView contentContainerStyle={[{ paddingHorizontal: 5 }]} showsVerticalScrollIndicator={false} onPress={(e) => { }}>

                            {
                                sortOptions.map((sort, index) => (
                                    currentSort === sort.key ?
                                        <View key={index} style={{ marginVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15, color: commonStylesSheet.modalsText }}>{sort.value}</Text>
                                            <Icon type='material-community' name='check' iconProps={{ style: { color: commonStylesSheet.darkBackground } }} />
                                        </View> :
                                        <TouchableOpacity onPress={() => { setCurrentSort(sort.key); setSortBottom(false) }} key={index} style={{ marginVertical: 12 }}>
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
                                <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold' }]}>{finalPickup?.city !== undefined ? `${finalPickup?.city} to ${finalDestination?.city}` : ''}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: commonStylesSheet.modalsText }}>{`${finalDatesDetail?.checkin.toLocaleDateString('en-US', dateOptions)} - ${finalDatesDetail?.checkout.toLocaleDateString('en-US', dateOptions)} / ${finalTimesDetail.checkin.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${finalTimesDetail.checkout.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalBoody}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 0, marginBottom: 10 }}>
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
                            style={[{ borderWidth: 0, backgroundColor: commonStylesSheet.darkForeground, borderRadius: 12, padding: 10, paddingHorizontal: 20, ...commonStylesSheet.ThreeD, marginTop: -5, marginBottom: 10 }]}
                            inlineImageLeft='search_icon'
                            value={searchTour}
                            onChangeText={setSearchTour}
                        />
                        <ScrollView nestedScrollEnabled contentContainerStyle={{ marginTop: 0, paddingBottom: 140, alignItems: 'center' }} showsVerticalScrollIndicator={false} >
                            {(loadingTransportsToBook || applyingFilters) ?
                                <View style={{ height: 300, flexDirection: 'column', justifyContent: 'flex-end' }}>
                                    <ActivityIndicator size={60} color={commonStylesSheet.darkBackground} />
                                </View>
                                :
                                <View>
                                    {filteredTransportsToBook
                                        .filter(datum => { return (searchTour && searchTour.trim() !== '') ? datum.name.toLowerCase().includes(searchTour.toLowerCase()) : true })
                                        .length > 0 ?
                                        filteredTransportsToBook
                                            .filter(datum => { return (searchTour && searchTour.trim() !== '') ? datum.name.toLowerCase().includes(searchTour.toLowerCase()) : true })
                                            .sort(sortTransports).map((transport, index) => (
                                                <View key={index} style={styles.packageOuter}>
                                                    <TouchableOpacity onPress={() => { setSelectedTransport({ id: transport.id }); setSelectedTransportModal(true); }} style={[styles.package, { position: 'relative' }]}>
                                                        <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${transport.images[0]}`} />
                                                        <View style={styles.packageBottom} >
                                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsHeadings, fontSize: 20, fontWeight: 'bold' }}>{transport.name}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: (90 / 100) * screenWidth, marginVertical: 10, marginTop: 5, paddingHorizontal: 10 }} >
                                                            <View style={{ flexDirection: 'column' }}>
                                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.filtersStar, fontSize: 16, fontWeight: 'bold' }}>PKR {transport.price_day.toLocaleString()}/day</Text>
                                                                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{transport.km_day} KM</Text>
                                                                </View> */}
                                                            </View>
                                                            <View style={{ flexDirection: 'column' }}>
                                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.filtersStar, fontSize: 16, fontWeight: 'bold' }}>PKR {transport.price_week.toLocaleString()}/week</Text>
                                                                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.modalsText, fontSize: 14, }}>{transport.km_week} KM</Text>
                                                                </View> */}
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10, marginBottom: 15 }} >
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{transport.type_name}</Text>
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 6, marginHorizontal: 10 }}>{'\u2B24'}</Text>
                                                        <View style={styles.inlineFeatures}>
                                                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{transport.doors} {transport.doors > 1 ? 'doors' : 'door'}</Text>
                                                        </View>
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 6, marginHorizontal: 10, }}>{'\u2B24'}</Text>
                                                        <View style={styles.inlineFeatures}>
                                                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{transport.sitting_capacity} {transport.sitting_capacity > 1 ? 'seats' : 'seat'}</Text>
                                                        </View>
                                                        <Text style={{ color: commonStylesSheet.modalsText, fontSize: 6, marginHorizontal: 10, }}>{'\u2B24'}</Text>
                                                        <View style={styles.inlineFeatures}>
                                                            <Text style={{ color: commonStylesSheet.modalsText, fontSize: 13 }}>{transport.bags}x small {transport.bags > 1 ? 'bags' : 'bag'}</Text>
                                                        </View>
                                                    </ScrollView>


                                                    <View style={{ width: (90 / 100) * screenWidth, marginTop: 0, marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
                                                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', }}>
                                                            {transport?.agency?.logo ?
                                                                <Image style={[styles.packageImage, { width: 50, height: 50, borderRadius: 100, }]} resizeMode='stretch' src={`${base_url}${transport?.agency?.logo}`} />
                                                                : <Icon iconStyle={{ fontSize: 36 }} type='material-community' name='account-circle' />
                                                            }
                                                        </View>
                                                        <View style={{ marginLeft: 5, flexDirection: 'column', alignItems: 'flex-start', flex: 1, justifyContent: 'center', marginLeft: 8, }}>

                                                            <Text style={{ color: commonStylesSheet.filtersStar, fontSize: 14, fontWeight: 'bold', marginRight: 20, }} numberOfLines={2} ellipsizeMode="tail">
                                                                {transport?.agency?.first_name}
                                                            </Text>
                                                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                                {transport?.agency?.license_verified ?
                                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                                        <Image source={require('../../../Images/dts_licensed.png')} style={{ width: 25, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>DTS</Text>
                                                                    </View>
                                                                    : <></>}

                                                                {transport?.agency?.iata_verified ?
                                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                                        <Image source={require('../../../Images/iata_licensed.png')} style={{ width: 44, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>IATA</Text>
                                                                    </View>
                                                                    : <></>}
                                                                {transport?.agency?.hajj_verified ?
                                                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 2 }}>
                                                                        <Image source={require('../../../Images/hajj_licensed.png')} style={{ width: 30, marginHorizontal: 2, height: 27, resizeMode: 'contain' }} resizeMethod='resize' />
                                                                        <Text style={{ fontSize: 12, fontWeight: 800, color: commonStylesSheet.modalsText }}>HAJJ Enr.</Text>
                                                                    </View>
                                                                    : <></>}

                                                                {transport?.agency?.oep_verified ?
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
                                                            onPress={() => { setSelectedTransport({ id: transport.id }); setSelectedTransportModal(true); }}>
                                                            <Icon type='material-community' name='information-variant' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12, }} numberOfLines={2}>Detail</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1 }]}
                                                            onPress={() => {
                                                                Linking.openURL(`tel:${transport?.agency?.phone}`)
                                                            }}>
                                                            <Icon type='material-community' name='phone' iconStyle={{ color: commonStylesSheet.darkForeground, marginRight: 5 }} />
                                                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 12 }}>Call</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[styles.shareButton, { backgroundColor: commonStylesSheet.whatsappButton, flex: 1 }]}
                                                            onPress={() => {
                                                                Linking.openURL(`whatsapp://send?text=${transportWhatsappMessage(transport?.name)}&phone=${transport?.agency?.phone}`)
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
                                        <View style={{ height: 250, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
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



export default TransportResults;



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
        borderColor: commonStylesSheet.darkForeground,
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

        // borderWidth: 1

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
