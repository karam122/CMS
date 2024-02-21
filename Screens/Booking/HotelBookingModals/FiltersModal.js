




import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    View,
    ScrollView,
} from 'react-native';
import { CheckBox, Button } from '@rneui/base';

import { Icon } from '@rneui/themed';

import RangeSlider from '../../../SelfComponents/RangeSlider';

import StarRating from 'react-native-star-rating';
import { commonStylesSheet } from '../../../StyleSheets/CommonStylesheet';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;




function FiltersModal({ filtersModal, setFiltersModal, filtersData, applyFilters, appliedFilters }) {

    const [priceFilter, setPriceFilter] = React.useState(appliedFilters.priceFilter);
    const [starsFilter, setStarsFilter] = React.useState(appliedFilters.starsFilter);

    const [roomFeatures, setRoomFeatures] = React.useState(appliedFilters.roomFeatures);
    const [roomTypes, setRoomTypes] = React.useState(appliedFilters.roomTypes);
    const [hotelAmenities, setHotelAmenities] = React.useState(appliedFilters.hotelAmenities);
    const [hotelChains, setHotelChains] = React.useState(appliedFilters.hotelChains);

    const handleResetFilters = () => {
        setPriceFilter([filtersData.price_range.minimum, filtersData.price_range.maximum])
        setStarsFilter(0)
        setRoomFeatures([])
        setRoomTypes([])
        setHotelAmenities([])
        setHotelChains([])

        applyFilters([filtersData.price_range.minimum, filtersData.price_range.maximum], 0, [], [], [], [], true);
    };

    const handleApplyFilters = () => {
        applyFilters(priceFilter, starsFilter, roomFeatures, roomTypes, hotelAmenities, hotelChains, false);
    };

    const handleRoomFeatureSelection = (featureId) => {
        if (roomFeatures.includes(featureId)) {
            setRoomFeatures(roomFeatures.filter(id => id !== featureId));
        } else {
            setRoomFeatures([...roomFeatures, featureId]);
        }
    }

    const handleRoomTypeSelection = (typeId) => {
        if (roomTypes.includes(typeId)) {
            setRoomTypes(roomTypes.filter(id => id !== typeId));
        } else {
            setRoomTypes([...roomTypes, typeId]);
        }
    }

    const handleAmenitySelection = (amenityId) => {
        if (hotelAmenities.includes(amenityId)) {
            setHotelAmenities(hotelAmenities.filter(id => id !== amenityId));
        } else {
            setHotelAmenities([...hotelAmenities, amenityId]);
        }
    }

    const handleHotelChainSelection = (chainId) => {
        if (hotelChains.includes(chainId)) {
            setHotelChains(hotelChains.filter(id => id !== chainId));
        } else {
            setHotelChains([...hotelChains, chainId]);
        }
    }








    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={filtersModal}
            onRequestClose={() => {
                setFiltersModal(!filtersModal);
            }}>
            <View style={[styles.modalView, { paddingBottom: 30 }]}>
                <View style={styles.modalHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon type='ionicon' name='arrow-back' onPress={() => setFiltersModal(false)} iconProps={{ style: { fontSize: 30, color: commonStylesSheet.modalsText, backgroundColor: commonStylesSheet.darkForeground } }} />
                        <Text style={[{ fontSize: 20, color: commonStylesSheet.modalsText, marginLeft: 10, }]}>My Filter</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleResetFilters()} style={{ backgroundColor: commonStylesSheet.darkBackground, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 4, ...commonStylesSheet.ThreeD }} >
                        <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Reset</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.modalBoody}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        <Text style={styles.filterHeading}>Price</Text>
                        <RangeSlider
                            min={filtersData.price_range.minimum}
                            max={filtersData.price_range.maximum}
                            currentValues={priceFilter}
                            setCurrentValues={(value) => setPriceFilter(value)}
                        />
                        <Text style={styles.filterHeading}>Stars</Text>
                        <View style={{ marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 0, paddingRight: 10, width: (90 / 100) * screenWidth }}>
                            <StarRating
                                fullStarColor={'#FFD700'}
                                emptyStarColor={commonStylesSheet.filtersStar}
                                rating={starsFilter}
                                selectedStar={(rating) => setStarsFilter(rating)}
                                maxStars={5}
                                starSize={17}
                                buttonStyle={{ borderWidth: 0.8, borderColor: commonStylesSheet.filtersStar, paddingVertical: 7, paddingHorizontal: 20, borderRadius: 4 }}

                            />
                        </View>
                        <Text style={styles.filterHeading}>Inclusions</Text>
                        <View style={{}}>
                            {
                                filtersData.room_features.map((feature, index) => (
                                    <View key={index} style={styles.checkContainer}>
                                        <Text style={styles.checkboxTitle}>{feature.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.checkboxCount}>{feature.rooms}</Text>
                                            <CheckBox
                                                // title={feature.name}
                                                // titleProps={{ style: styles.checkboxTitle }}
                                                checked={roomFeatures.includes(feature.id)}
                                                onPress={() => handleRoomFeatureSelection(feature.id)}
                                                iconType='material-community'
                                                checkedIcon='checkbox-marked'
                                                uncheckedIcon='checkbox-blank-outline'
                                                checkedColor={commonStylesSheet.darkBackground}
                                                size={25}
                                                wrapperStyle={styles.checkBoxWrapper}
                                            />
                                        </View>
                                    </View>
                                ))
                            }

                        </View>
                        <Text style={styles.filterHeading}>Room Type</Text>
                        <View style={{}}>
                            {
                                filtersData.all_types.map((type, index) => (
                                    <View key={index} style={styles.checkContainer}>

                                        <Text style={styles.checkboxTitle}>{type.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.checkboxCount}>{type.rooms}</Text>
                                            <CheckBox
                                                // title={type.name}
                                                // titleProps={{ style: styles.checkboxTitle }}
                                                checked={roomTypes.includes(type.id)}
                                                onPress={() => handleRoomTypeSelection(type.id)}
                                                iconType='material-community'
                                                checkedIcon='checkbox-marked'
                                                uncheckedIcon='checkbox-blank-outline'
                                                checkedColor={commonStylesSheet.darkBackground}
                                                size={25}
                                                wrapperStyle={styles.checkBoxWrapper}
                                            />
                                        </View>
                                    </View>
                                ))
                            }

                        </View>
                        <Text style={styles.filterHeading}>Hotel Amenities</Text>
                        <View style={{}}>
                            {
                                filtersData.hotel_features.map((feature, index) => (
                                    <View key={index} style={styles.checkContainer}>
                                        <Text style={styles.checkboxTitle}>{feature.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.checkboxCount}>{feature.rooms}</Text>
                                            <CheckBox
                                                // title={feature.name}
                                                // titleProps={{ style: styles.checkboxTitle }}
                                                checked={hotelAmenities.includes(feature.id)}
                                                onPress={() => handleAmenitySelection(feature.id)}
                                                iconType='material-community'
                                                checkedIcon='checkbox-marked'
                                                uncheckedIcon='checkbox-blank-outline'
                                                checkedColor={commonStylesSheet.darkBackground}
                                                size={25}
                                                wrapperStyle={styles.checkBoxWrapper}
                                            />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                        <Text style={styles.filterHeading}>Hotel Chains & Brands</Text>
                        <View style={{}}>
                            {
                                filtersData.hotels.map((hotel, index) => (
                                    <View key={index} style={styles.checkContainer}>
                                        <Text style={styles.checkboxTitle}>{hotel.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.checkboxCount}>{hotel.rooms}</Text>
                                            <CheckBox
                                                // title={hotel.name}
                                                // titleProps={{ style: styles.checkboxTitle }}
                                                checked={hotelChains.includes(hotel.id)}
                                                onPress={() => handleHotelChainSelection(hotel.id)}
                                                iconType='material-community'
                                                checkedIcon='checkbox-marked'
                                                uncheckedIcon='checkbox-blank-outline'
                                                checkedColor={commonStylesSheet.darkBackground}
                                                size={25}
                                                wrapperStyle={styles.checkBoxWrapper}
                                            />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>

                        <TouchableOpacity onPress={() => handleApplyFilters()} style={[styles.modalSearchButton, { marginTop: 30, ...commonStylesSheet.ThreeD }]}>
                            <Text style={{ color: commonStylesSheet.darkForeground, fontSize: 15 }}>Apply Filters</Text>
                        </TouchableOpacity>

                    </ScrollView>

                </View>

            </View>
        </Modal >
    );

}

export default FiltersModal;




const styles = StyleSheet.create({


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
        paddingBottom: 100,
        backgroundColor: commonStylesSheet.screenBackground,
        height: screenHeight,
        width: screenWidth,

    },
    modalBoody: {
        flexDirection: 'column',
        // paddingHorizontal: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingBottom: 80

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
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    checkBoxWrapper: {
        margin: -10,
        marginRight: -20,
        backgroundColor: commonStylesSheet.screenBackground
    },
    checkboxTitle: {
        color: commonStylesSheet.modalsText,
        // fontWeight: 'bold', 
        marginLeft: 8,
        fontSize: 15
    },
    checkboxCount: {
        color: commonStylesSheet.modalsText,
        fontSize: 15
    },

    filterHeading: {
        marginVertical: 5,
        color: commonStylesSheet.modalsText,
        fontSize: 20,
        fontWeight: 'bold'
    },

    checkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 0,
        marginVertical: 3
    }

});
