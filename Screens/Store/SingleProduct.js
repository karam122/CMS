




import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
    ScrollView,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';

import { base_url } from '../../APIs/constants';
import { SliderBox } from "react-native-image-slider-box";
import StarRating from 'react-native-star-rating';
import { Icon } from '@rneui/themed';


import RenderHtml from 'react-native-render-html';
import {
    SkypeIndicator,
} from 'react-native-indicators';

import { commonStylesSheet, htmlTagsStyles } from '../../StyleSheets/CommonStylesheet';

import SelectDropdown from 'react-native-select-dropdown';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, loadCartData, selectCart } from '../../Redux/cartSlice';

import { useNavigation } from '@react-navigation/native';
import { GetStoreProductId } from '../../APIs/AppAPIs';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function SingleProduct({ selectedProductx, selectedProductModal, setSelectedProductModal }) {


    const navigation = useNavigation();

    const dispatch = useDispatch();
    const oldCart = useSelector((state) => state.cart.cart);

    const [selectedProduct, setSelectedProduct] = React.useState(selectedProductx);


    const [selectedVariants, setSelectedVariants] = React.useState(
        []
    );
    const [finalQuantity, setfinalQuantity] = React.useState(1);



    const handleVariantSelection = (selectedItem, variantId) => {
        const newSelectedVariants = selectedVariants.map((variant) =>
            variant.variantId === variantId ? { ...variant, id: selectedItem.id, name: selectedItem.name, extra_price: selectedItem.extra_price } : variant
        );
        return newSelectedVariants;
    };

    const handleAddProductToCart = () => {

        const existingProductIndex = oldCart.findIndex((item) => item.id === selectedProduct.id && item.variant === selectedVariants.reduce((accumulator, currentValue) => accumulator + currentValue.variantName + ': ' + currentValue.name + ', ', ''));

        if (existingProductIndex !== -1) {
            let updatedCart = JSON.parse(JSON.stringify(oldCart));
            updatedCart[existingProductIndex].quantity += finalQuantity;

            dispatch(addToCart(updatedCart));
            ToastAndroid.show('Product Quantity Updated', ToastAndroid.SHORT);

        } else {
            const vrttxt = selectedVariants.reduce((accumulator, currentValue) => accumulator + currentValue.variantName + ': ' + currentValue.name + ', ', '');
            // console.log(vrttxt.slice(0, -2))
            const newProduct = {
                id: selectedProduct.id,
                name: selectedProduct.name,
                variant: vrttxt.slice(0, -2),
                price: parseFloat(selectedProduct.price) + selectedVariants.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.extra_price), 0),
                quantity: finalQuantity,
                image: `${base_url}${selectedProduct.images[0]}`,
                sales_tax: selectedProduct.sales_tax
            }

            dispatch(addToCart([...oldCart, newProduct]));
            ToastAndroid.show('Product Added to Cart', ToastAndroid.SHORT);
        }

    };

    const handleBuyNow = () => {

        const existingProductIndex = oldCart.findIndex((item) => item.id === selectedProduct.id && item.variant === selectedVariants.reduce((accumulator, currentValue) => accumulator + currentValue.variantName + ': ' + currentValue.name + ', ', ''));

        if (existingProductIndex !== -1) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Cart' }],
            });
        } else {
            const vrttxt = selectedVariants.reduce((accumulator, currentValue) => accumulator + currentValue.variantName + ': ' + currentValue.name + ', ', '');
            // console.log(vrttxt.slice(0, -2))
            const newProduct = {
                id: selectedProduct.id,
                name: selectedProduct.name,
                variant: vrttxt.slice(0, -2),
                price: parseFloat(selectedProduct.price) + selectedVariants.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.extra_price), 0),
                quantity: finalQuantity,
                image: `${base_url}${selectedProduct.images[0]}`,
                sales_tax: selectedProduct.sales_tax
            }
            
            dispatch(addToCart([...oldCart, newProduct]));
            ToastAndroid.show('Product Added to Cart', ToastAndroid.SHORT);
            
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Cart' }],
                });
            }, 100);
        }


    };


    const fetchProduct = (id) => {

        GetStoreProductId(id)
            .then(res => {
                setSelectedProduct(res?.data?.data)
                setSelectedVariants(
                    res?.data?.data.variants?.map((vart) => ({
                        ...vart.options.sort((varA, varB) => varA.extra_price - varB.extra_price)[0],
                        variantId: vart.id,
                        variantName: vart.name,
                    }))
                )
            })
            .catch(err => {
                console.log('TranssportErr', err?.response);
            });
    };


    React.useEffect(() => {
        if (!selectedProduct.name) {
            fetchProduct(selectedProduct.id);
        }
    }, []);



    return (

        <View>


            <Modal
                animationType="slide"
                transparent={true}
                visible={selectedProductModal}
                onRequestClose={() => {
                    setSelectedProductModal(!selectedProductModal);
                }}>
                <View style={[styles.modalView, { paddingBottom: 30 }]}>
                    <View style={{ backgroundColor: commonStylesSheet.screenBackground }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth }}>
                            <Icon type='ionicon' name='arrow-back' onPress={() => setSelectedProductModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, marginLeft: 10, backgroundColor: commonStylesSheet.screenBackground } }} />
                            <Text style={[{ marginBottom: 1, fontSize: 20, color: commonStylesSheet.modalsText, fontWeight: 'bold', marginLeft: 10 }]}>Back</Text>
                        </View>
                        {
                            selectedProduct.name ?


                                <ScrollView contentContainerStyle={{ marginTop: 10, paddingBottom: 40, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false} >
                                    <View style={{ left: -10 }}>
                                        <SliderBox
                                            images={selectedProduct?.images?.map(img => `${base_url}${img}`)}
                                            resizeMode='contain'
                                            dotColor={commonStylesSheet.filtersStar}
                                            inactiveDotColor={'#D3D3D3'}
                                            ImageComponentStyle={{ height: 200, width: screenWidth, }}
                                        />
                                    </View>
                                    <Text style={[styles.textHeading, { marginTop: 2, marginBottom: 5, fontSize: 20 }]}>PKR {(parseFloat(selectedProduct.price) + selectedVariants.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.extra_price), 0)).toLocaleString()}</Text>
                                    <Text style={[{ fontWeight: 'bold', fontSize: 17, color: commonStylesSheet.filtersStar }]}>{selectedProduct?.name}</Text>

                                    <Text style={styles.textHeading}>Product Category</Text>
                                    <Text style={{ fontSize: 14, color: commonStylesSheet.filtersStar }}>{selectedProduct?.category_name}</Text>

                                    <Text style={styles.textHeading}>Description</Text>
                                    <RenderHtml contentWidth={screenWidth} source={{ html: `<div style="color: ${commonStylesSheet.filtersStar};"> ${selectedProduct.description} </div>` }}
                                    
                                    tagsStyles={htmlTagsStyles}
                                    />

                                    {
                                        selectedProduct.variants.map((variant, index) => (
                                            <View key={index}>

                                                <Text style={[styles.textHeading, { marginBottom: 5 }]}>Select {variant.name}</Text>

                                                <SelectDropdown
                                                    data={variant.options.sort((varA, varB) => varA.extra_price - varB.extra_price)}
                                                    defaultButtonText={variant.name}
                                                    defaultValue={variant.options[0]}
                                                    buttonStyle={styles.dropDownButton}
                                                    buttonTextStyle={{ textAlign: 'left', fontSize: 18 }}
                                                    selectedRowStyle={{ backgroundColor: '#D3D3D3' }}
                                                    rowTextStyle={{ textAlign: 'left' }}
                                                    renderSearchInputLeftIcon={() => <Icon type='ionicon' name='search-outline' />}
                                                    renderDropdownIcon={() => <Icon type='ionicon' name='chevron-forward' />}
                                                    onSelect={(selectedItem, index) => { setSelectedVariants(handleVariantSelection(selectedItem, variant.id)); }}
                                                    buttonTextAfterSelection={(selectedItem, index) => { return selectedItem.name }}
                                                    rowTextForSelection={(item, index) => { return `${item.name} ${parseFloat(item.extra_price) !== 0 ? ' (PKR ' + item.extra_price.toLocaleString() + ' extra)' : ''}` }}
                                                />
                                            </View>
                                        ))
                                    }


                                    <View style={[styles.counterContainer, { marginTop: 30 }]}>
                                        <View style={styles.counterButtons}>
                                            <Icon type='material-community' name='minus' iconStyle={styles.counterIcons} disabled={finalQuantity <= 1}
                                                onPress={() => setfinalQuantity(finalQuantity - 1)}
                                            />
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: commonStylesSheet.modalsText, marginHorizontal: 5 }}>{finalQuantity}</Text>
                                            <Icon type='material-community' name='plus' iconStyle={styles.counterIcons} disabled={finalQuantity >= 30}
                                                onPress={() => setfinalQuantity(finalQuantity + 1)}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => handleAddProductToCart()} style={[styles.cartButton, { backgroundColor: commonStylesSheet.darkForeground }]} >
                                                <Text style={{ color: commonStylesSheet.darkBackground, fontSize: 15, fontWeight: 'bold' }}>Add to Cart</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleBuyNow()
                                                }} style={[styles.cartButton, { marginLeft: 10 }]} >
                                                <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Buy Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>



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

export default SingleProduct;




const styles = StyleSheet.create({
    textHeading: {
        fontSize: 16,
        // color: commonStylesSheet.modalsText, 
        color: 'black',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 3
    },

    cartButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 4,
        width: 'fit-content',
        backgroundColor: commonStylesSheet.darkBackground,
        alignSelf: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: commonStylesSheet.darkBackground,


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

    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: commonStylesSheet.darkForeground,
        padding: 15,
        paddingVertical: 10,
        borderRadius: 8,
        marginVertical: 7
    },
    counterButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: commonStylesSheet.muteText,
        borderRadius: 4,
        padding: 4

    },

    counterIcons: {

        fontSize: 25, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground

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
    },


    dropDownButton: {
        width: '100%',
        borderWidth: 0,
        borderBottomWidth: 1.4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: commonStylesSheet.darkForeground,
        borderColor: commonStylesSheet.muteText,
        paddingLeft: 10,
        marginVertical: 5,

        ...commonStylesSheet.ThreeD
    },

});
