



import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';


import { Icon, Skeleton } from '@rneui/themed';
import { GetFeaturedHotels, GetFeaturedProducts, GetFeaturedTours, GetFeaturedTransports } from '../../APIs/AppAPIs';
import { base_url } from '../../APIs/constants';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';



import { useNavigation } from '@react-navigation/native';
import TransportResults from '../Booking/TransportBookingModals/TransportResults';
import TransportListing from '../Booking/TransportBookingModals/TransportListing';
import SingleTransport from '../Booking/TransportBookingModals/SingleTransport';
import SingleTour from '../Booking/TourBookingModals/SingleTour';
import SingleProduct from '../Store/SingleProduct';
import SingleRoom from '../Booking/HotelBookingModals/SingleRoom';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
function DashboardPackages({ refreshing, setRefreshing }) {

    const [loadingTours, setLoadingTours] = React.useState(false);
    const [loadingTransports, setLoadingTransports] = React.useState(false);
    const [loadingHotels, setLoadingHotels] = React.useState(false);
    const [loadingProducts, setLoadingProducts] = React.useState(false);

    const [resultsModal, setResultsModal] = React.useState(false);
    const [finalDatesDetail, setFinalDatesDetail] = React.useState({ checkin: new Date(), checkout: new Date(), });
    const [finalTimesDetail, setFinalTimesDetail] = React.useState({ checkin: new Date(), checkout: new Date(), });
    const [finalPickup, setFinalPickup] = React.useState({});
    const [finalDestination, setFinalDestination] = React.useState({});
    const [finalCarType, setFinalCarType] = React.useState({ id: -1, name: 'Any' });
    const [finalPassengers, setFinalPassengers] = React.useState(2);


    const navigation = useNavigation();


    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [selectedRoomModal, setSelectedRoomModal] = React.useState(false);
    const [finalGuests, setFinalGuests] = React.useState({ roomType: { id: -1, name: 'Any' }, NoRooms: 1, NoAdults: 2, NoChilds: 0, NoInfants: 0, });

    const [finalDestinationRm, setFinalDestinationRm] = React.useState({});

    const [selectedTransport, setSelectedTransport] = React.useState(null);
    const [selectedTransportModal, setSelectedTransportModal] = React.useState(false);


    const [selectedTour, setSelectedTour] = React.useState(null);
    const [selectedTourModal, setSelectedTourModal] = React.useState(false);

    const [allTours, setAllTours] = React.useState([]);
    const [allTransports, setAllTransports] = React.useState([]);
    const [allHotels, setAllHotels] = React.useState([]);
    const [allProducts, setAllProducts] = React.useState([]);


    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [selectedProductModal, setSelectedProductModal] = React.useState(false);

    const fetchTours = () => {
        setLoadingTours(true);
        GetFeaturedTours()
            .then(res => {
                setAllTours(res.data.data)
                setLoadingTours(false);
                setRefreshing(false)
            })
            .catch(err => {
                setLoadingTours(false);
                console.log('TourError', err?.response?.data);

            });

    };
    const fetchTransports = () => {
        setLoadingTransports(true)
        GetFeaturedTransports()
            .then(res => {
                setAllTransports(res.data.data)
                setLoadingTransports(false)
                setRefreshing(false)
            })
            .catch(err => {
                setLoadingTransports(false)
                console.log('HotelErr', err?.response?.data);

            });
    };

    const fetchHotels = () => {
        setLoadingHotels(true)
        GetFeaturedHotels()
            .then(res => {
                setAllHotels(res.data.data)
                setLoadingHotels(false)
                setRefreshing(false)
            })
            .catch(err => {
                setLoadingHotels(false)
                console.log('HotelErr', err?.response?.data);

            });
    };

    const fetchProducts = () => {
        setLoadingProducts(true)
        GetFeaturedProducts()
            .then(res => {
                setAllProducts(res.data.data)
                setLoadingProducts(false)
                setRefreshing(false)
            })
            .catch(err => {
                setLoadingProducts(false)
                console.log('HotelErr', err?.response?.data);

            });

    };

    React.useEffect(() => {
        fetchTours();
        fetchHotels();
        fetchTransports();
        fetchProducts();

    }, []);

    React.useEffect(() => {
        if (refreshing) {
            fetchTours();
            fetchHotels();
            fetchTransports();
            fetchProducts();
        }
    }, [refreshing]);


    return (


        <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>







            {resultsModal &&
                <TransportListing resultsModal={resultsModal}
                    setResultsModal={(value) => setResultsModal(value)}
                    finalDatesDetail={{ checkin: new Date(), checkout: new Date(), }}
                    finalTimesDetail={finalTimesDetail}
                    finalPickup={finalPickup}
                    finalDestination={finalDestination}
                    finalPassengers={finalPassengers}
                    finalCarType={finalCarType}
                />
            }

            {selectedTransportModal &&
                <SingleTransport
                    selectedTransportx={selectedTransport}
                    selectedTransportModal={selectedTransportModal}
                    setSelectedTransportModal={(value) => setSelectedTransportModal(value)}
                    finalPickup={finalPickup}
                    finalDestination={{}}
                    finalPassengers={finalPassengers}
                    finalDatesDetail={{ checkin: new Date(), checkout: new Date(), }}
                    finalTimesDetail={finalTimesDetail}
                />
            }

            {selectedRoomModal &&
                <SingleRoom
                    selectedRoomx={selectedRoom}
                    selectedRoomModal={selectedRoomModal}
                    setSelectedRoomModal={(value) => setSelectedRoomModal(value)}
                    totalNights={1}
                    finalDatesDetail={{ checkin: new Date(), checkout: new Date(), }}
                    finalDestination={finalDestination}
                    finalGuests={finalGuests}
                />
            }

            {selectedTourModal &&
                <SingleTour
                    selectedTourx={selectedTour}
                    selectedTourModal={selectedTourModal}
                    setSelectedTransportModal={(value) => setSelectedTourModal(value)}
                />
            }




            {selectedProductModal &&
                <SingleProduct
                    selectedProductx={selectedProduct}
                    selectedProductModal={selectedProductModal}
                    setSelectedProductModal={(value) => setSelectedProductModal(value)}
                />
            }




            <View style={styles.packageHeader}>
                <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Popular travel points</Text>
                <Icon type='ionicon' name='chevron-forward' onPress={() => { navigation.navigate('Booking', { currentBooking: 'trip' }) }} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packageContainer}>
                {
                    loadingTours ?
                        <View style={{ flexDirection: 'row' }}>
                            {
                                [0, 1, 2].map((item) => (
                                    <View key={item} style={styles.package}>
                                        <Skeleton height={110} width={'100%'} />
                                        <View style={styles.packageBottom} >
                                            <Skeleton height={15} width={'80%'} style={{ marginTop: 5 }} />
                                            <Skeleton height={10} width={'95%'} style={{ marginTop: 10 }} />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        :
                        allTours.length > 0 ?
                            allTours.map(({ id, name, minimum_price, images, destination }) => (
                                <TouchableOpacity onPress={() => {
                                    setSelectedTour({ id: id })
                                    setSelectedTourModal(true)
                                }} key={id} style={styles.package}>
                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${images[0]}`} />
                                    <View style={{ position: 'absolute', marginHorizontal: 10 }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.darkForeground, fontSize: 18, fontWeight: 'bold' }}>{destination.city}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.darkForeground, fontSize: 14, fontWeight: 'bold' }}>{destination.country}</Text>
                                    </View>
                                    <View style={styles.packageBottom} >
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>PKR {minimum_price.toLocaleString()}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.muteText, fontSize: 12, marginTop: 2, fontWeight: 'bold' }}>{name}</Text>

                                    </View>
                                </TouchableOpacity>
                            ))
                            : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>Not any (for today)</Text>
                            </View>
                }
            </ScrollView>


            <View style={styles.packageHeader}>
                <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Popular transports</Text>
                <Icon type='ionicon' name='chevron-forward'
                    // onPress={() => { navigation.navigate('Booking', { currentBooking: 'transport' }) }}
                    onPress={() => { setResultsModal(true) }}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packageContainer}>
                {
                    loadingTransports ?
                        <View style={{ flexDirection: 'row' }}>
                            {
                                [3, 4, 5
                                ].map((item) => (
                                    <View key={item} style={styles.package}>
                                        <Skeleton height={110} width={'100%'} />
                                        <View style={styles.packageBottom} >
                                            <Skeleton height={15} width={'80%'} style={{ marginTop: 5 }} />
                                            <Skeleton height={10} width={'95%'} style={{ marginTop: 10 }} />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        :
                        allTransports.length > 0 ?
                            allTransports.map(({ id, name, price_day, images, sitting_capacity }) => (
                                <TouchableOpacity onPress={() => {
                                    setFinalPassengers(sitting_capacity)
                                    setSelectedTransport({ id: id })
                                    setSelectedTransportModal(true)
                                }} key={id} style={styles.package}>
                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${images[0]}`} />
                                    <View style={styles.packageBottom} >
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>PKR {price_day.toLocaleString()}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.muteText, fontSize: 12, marginTop: 2, fontWeight: 'bold' }}>{name}</Text>

                                    </View>
                                </TouchableOpacity>
                            ))
                            : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>Not any (for today)</Text>
                            </View>
                }
            </ScrollView>


            <View style={styles.packageHeader}>
                <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Popular hotels</Text>
                <Icon type='ionicon' name='chevron-forward'
                    // onPress={() => { navigation.navigate('Booking', { currentBooking: 'transport' }) }}
                    onPress={() => {
                        navigation.navigate('Booking', { currentBooking: 'hotel' })
                    }}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packageContainer}>
                {
                    loadingHotels ?
                        <View style={{ flexDirection: 'row' }}>
                            {
                                [3, 4, 5
                                ].map((item) => (
                                    <View key={item} style={styles.package}>
                                        <Skeleton height={110} width={'100%'} />
                                        <View style={styles.packageBottom} >
                                            <Skeleton height={15} width={'80%'} style={{ marginTop: 5 }} />
                                            <Skeleton height={10} width={'95%'} style={{ marginTop: 10 }} />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        :
                        allHotels.length > 0 ?
                            allHotels.map(({ id, name, price, hotel, images, destination }) => (
                                <TouchableOpacity onPress={() => {
                                    setSelectedRoom({ id: id })
                                    setFinalDestination({ id: destination })
                                    setSelectedRoomModal(true)
                                }} key={id} style={styles.package}>
                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${images[0]}`} />
                                    <View style={styles.packageBottom} >
                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                            <Icon type='ionicon' name='business' color={commonStylesSheet.modalsText} iconStyle={{ fontSize: 18, marginRight: 5 }} />
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>{hotel}</Text>
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.muteText, fontSize: 12, marginTop: 2, fontWeight: 'bold' }}>{name} - PKR {price}</Text>
                                        {/* <Text style={{ color: commonStylesSheet.modalsText, fontSize: 14, marginVertical: 3 }}>{hotel}</Text> */}
                                    </View>
                                </TouchableOpacity>
                            ))
                            : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>Not any (for today)</Text>
                            </View>
                }
            </ScrollView>


            <View style={styles.packageHeader}>
                <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Popular Products</Text>
                <Icon type='ionicon' name='chevron-forward'
                    onPress={() => { navigation.navigate('CMS Store') }}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.packageContainer}>
                {
                    loadingProducts ?
                        <View style={{ flexDirection: 'row' }}>
                            {
                                [3, 4, 5
                                ].map((item) => (
                                    <View key={item} style={styles.package}>
                                        <Skeleton height={110} width={'100%'} />
                                        <View style={styles.packageBottom} >
                                            <Skeleton height={15} width={'80%'} style={{ marginTop: 5 }} />
                                            <Skeleton height={10} width={'95%'} style={{ marginTop: 10 }} />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        :
                        allProducts.length > 0 ?
                            allProducts.map(({ id, name, price, images, }) => (
                                <TouchableOpacity onPress={() => {
                                    setSelectedProduct({ id: id });
                                    setSelectedProductModal(true)

                                }} key={id} style={styles.package}>
                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${images[0]}`} />
                                    <View style={styles.packageBottom} >
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>PKR {price.toLocaleString()}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: commonStylesSheet.muteText, fontSize: 12, marginTop: 2, fontWeight: 'bold' }}>{name}</Text>

                                    </View>
                                </TouchableOpacity>
                            ))
                            : <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>Not any (for today)</Text>
                            </View>
                }
            </ScrollView>

        </View>
    );

}


export default DashboardPackages;



const styles = StyleSheet.create({
    packageHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        // paddingRight: 10,
        paddingHorizontal: 20
    },
    packageContainer: {
        minWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 20,
        paddingHorizontal: 5,
        height: 'auto',
    },
    package: {
        // width: 220,
        width: (45 / 100) * screenWidth,
        marginHorizontal: 4,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        borderRadius: 15,

        ...commonStylesSheet.ThreeD
        // paddingVertical: 5,
        // backgroundColor: '#D3D3D3'


    },
    packageImage: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: commonStylesSheet.darkForeground,
        height: 110,
        width: '100%'
    },
    packageBottom: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        height: 60,
        backgroundColor: commonStylesSheet.darkForeground,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5

    },
    tabIcon: {
        style: {
            fontSize: 35,
        }

    },
    tabText: {
        fontSize: 20,
        color: 'black'

    }
});
