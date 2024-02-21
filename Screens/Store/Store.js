import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Dimensions,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    Image,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    ToastAndroid,
    FlatList,
    SafeAreaView
} from 'react-native';

import { Icon } from '@rneui/themed';

import SingleProduct from './SingleProduct';

import { useRoute } from '@react-navigation/native';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';
import { GetStoreCats, GetStoreProducts } from '../../APIs/AppAPIs';

import { base_url } from '../../APIs/constants';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function EStore() {

    const [allCats, setAllCats] = React.useState([]);
    const [allProducts, setAllProducts] = React.useState([]);

    const [parentCat, setParentCat] = React.useState({});
    const [selectedCat, setSelectedCat] = React.useState({});
    const [catsToFilter, setCatsToFilter] = React.useState([]);

    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [selectedProductModal, setSelectedProductModal] = React.useState(false);

    const [refreshing, setRefreshing] = React.useState(false);

    const [loadingProducts, setLoadingProducts] = React.useState(false);

    const [searchTour, setSearchTour] = React.useState('');


    const fetchCats = () => {
        GetStoreCats()
            .then(res => {
                setAllCats(res.data.data)
                setRefreshing(false);
            })
            .catch(err => {
                setLoadingRoomsToBook(false);
                setRefreshing(false);
                console.log('CatsErr', err?.response);
            });

    }

    const fetchProducts = () => {
        GetStoreProducts()
            .then(res => {
                setAllProducts(res.data?.data)

                console.log(res.data)
                setRefreshing(false)
                setLoadingProducts(false);
            })
            .catch(err => {
                setLoadingRoomsToBook(false);
                setRefreshing(false);
                setLoadingProducts(false);
                console.log('CatsErr', err?.response);
            });

    }

    React.useEffect(() => {
        setLoadingProducts(true);
        fetchCats();
        fetchProducts();

    }, [])


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchCats()
        fetchProducts()

        setSelectedCat({})
        setParentCat({})
    }, []);




    return (
        <SafeAreaView style={{ paddingBottom: 70 }}>


            {selectedProductModal &&
                <SingleProduct
                    selectedProductx={selectedProduct}
                    selectedProductModal={selectedProductModal}
                    setSelectedProductModal={(value) => setSelectedProductModal(value)}
                />
            }


            {/* <Text style={[styles.tabText, { color: commonStylesSheet.filtersStar }]}>{selectedCat.name}</Text> */}
            <View style={{ flexDirection: 'row', width: screenWidth, justifyContent: 'center' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.tabContainer, {}]}  >
                    <View style={{ flexDirection: 'row', width: 'fit-content', }}>

                        {selectedCat.id &&
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Icon type='ionicon' name='arrow-back'
                                    onPress={() => {
                                        if (parentCat.id) {
                                            setSelectedCat(parentCat)
                                            setParentCat({})
                                        }
                                        else {
                                            setSelectedCat({})
                                        }
                                    }}
                                    iconProps={{ style: { fontSize: 25, color: commonStylesSheet.filtersStar, backgroundColor: commonStylesSheet.screenBackground } }} />

                                <TouchableOpacity style={styles.tabButton} disabled>
                                    <Text style={styles.tabText}>{selectedCat.name}</Text>
                                </TouchableOpacity>

                                {
                                    selectedCat.sub_categories.length > 0 &&
                                    <Icon type='ionicon' name='arrow-forward' iconProps={{ style: { fontSize: 15, color: commonStylesSheet.filtersStar, backgroundColor: commonStylesSheet.screenBackground } }} />
                                }


                            </View>

                        }
                        {
                            selectedCat.id ?
                                selectedCat.sub_categories?.map((categ, index) => (
                                    <TouchableOpacity key={index} style={styles.tabButton} onPress={() => {
                                        // if (categ.sub_categories.length > 0) {
                                        setParentCat(selectedCat);
                                        setSelectedCat(categ);
                                        // }
                                    }}>
                                        <Text style={styles.tabText}>{categ.name}</Text>
                                    </TouchableOpacity>
                                ))
                                :
                                allCats.map((categ, index) => (<TouchableOpacity key={index} style={styles.tabButton} onPress={() => {
                                    // if (categ.sub_categories.length > 0) {
                                    setSelectedCat(categ);
                                    setParentCat({});
                                    // }
                                }}>
                                    <Text style={styles.tabText}>{categ.name}</Text>
                                </TouchableOpacity>
                                ))

                        }

                    </View>
                </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', width: screenWidth, justifyContent: 'center' }}>

                <TextInput
                    placeholder='Search'
                    variant='outlined'
                    style={[{ width: (90 / 100) * screenWidth, borderWidth: 0, backgroundColor: commonStylesSheet.darkForeground, borderRadius: 12, padding: 10, paddingHorizontal: 20, ...commonStylesSheet.ThreeD, marginTop: 5, marginBottom: 10 }]}
                    inlineImageLeft='search_icon'
                    value={searchTour}
                    onChangeText={setSearchTour}
                />
            </View>

            <View>
                {
                    loadingProducts ?
                        <View style={{ height: 300, flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <ActivityIndicator size={60} color={commonStylesSheet.darkBackground} />
                        </View>
                        :
                        <FlatList
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }

                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 180 }}

                            data={
                                allProducts.filter((prd) => {

                                    if (selectedCat.id) {
                                        return prd.parent_categories.includes(selectedCat.id);
                                    }
                                    else {
                                        return true;
                                    }

                                })
                                    .filter(datum => { return (searchTour && searchTour.trim() !== '') ? datum.name.toLowerCase().includes(searchTour.toLowerCase()) : true })

                            }
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { setSelectedProduct({id: item.id}); setSelectedProductModal(true) }} style={styles.package}>
                                    <Image style={styles.packageImage} resizeMode='contain' src={`${base_url}${item.images[0]}`} />
                                    <View style={styles.packageBottom} >
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>{item.name}</Text>
                                        <Text style={{ color: 'black', fontSize: 12 }}>PKR {item.price.toLocaleString()}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={(item) => item.id.toString()}

                            ListEmptyComponent={() =>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>No product found</Text>
                                </View>
                            }
                        />

                }

            </View>

        </SafeAreaView>
    );
}



export default EStore;



const styles = StyleSheet.create({
    dashboardContainer: {
        backgroundColor: commonStylesSheet.screenBackground,
        // paddingHorizontal: 10,
    },
    tabContainer: {

        paddingTop: 10,
        paddingBottom: 5,
        height: 'auto',
        // maxHeight: 120,
        width: 'fit-content',
        backgroundColor: commonStylesSheet.screenBackground,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row'

    },
    tabButton: {
        // borderWidth: 1,
        // borderColor: commonStylesSheet.muteText,
        width: 'auto',
        height: 'auto',
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 7,
        paddingHorizontal: 15,
        backgroundColor: commonStylesSheet.darkBackground,


        ...commonStylesSheet.ThreeD
    },
    tabIcon: {
        fontSize: 20,
        marginHorizontal: 8,
        color: commonStylesSheet.muteText
    },
    tabText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },






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
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 5,
        height: 'auto',
    },
    package: {
        width: '100%',
        // marginHorizontal: 5,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        marginTop: 10,
        marginBottom: 15,



        ...commonStylesSheet.ThreeD,
        borderRadius: 15
        // paddingVertical: 5,
        // backgroundColor: '#D3D3D3'


    },
    packageImage: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: commonStylesSheet.darkForeground,
        height: 200,
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

});
