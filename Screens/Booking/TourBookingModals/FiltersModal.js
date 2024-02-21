




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
    const [transportFeatures, setTransportFeatures] = React.useState(appliedFilters.transportFeatures);
    const [transportTypes, setTransportTypes] = React.useState(appliedFilters.transportTypes);

    const handleResetFilters = () => {
        setPriceFilter([filtersData.price_range.minimum, filtersData.price_range.maximum])
        setTransportFeatures([])
        setTransportTypes([])
        applyFilters([filtersData.price_range.minimum, filtersData.price_range.maximum], [], [], true);
    };

    const handleApplyFilters = () => {
        applyFilters(priceFilter, transportFeatures, transportTypes, false);
    };

    const handleTransportFeatureSelection = (featureId) => {
        if (transportFeatures.includes(featureId)) {
            setTransportFeatures(transportFeatures.filter(id => id !== featureId));
        } else {
            setTransportFeatures([...transportFeatures, featureId]);
        }
    }

    const handleTransportTypeSelection = (typeId) => {
        if (transportTypes.includes(typeId)) {
            setTransportTypes(transportTypes.filter(id => id !== typeId));
        } else {
            setTransportTypes([...transportTypes, typeId]);
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
                        <Text style={styles.filterHeading}>Price (Adult)</Text>
                        <RangeSlider
                            min={filtersData.price_range.minimum}
                            max={filtersData.price_range.maximum}
                            currentValues={priceFilter}
                            setCurrentValues={(value) => setPriceFilter(value)}
                        />
                        <Text style={styles.filterHeading}>Inclusions</Text>
                        <View style={{}}>
                            {
                                filtersData.tour_features.map((feature, index) => (
                                    <View key={index} style={styles.checkContainer}>

                                        <Text style={styles.checkboxTitle}>{feature.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.checkboxCount}>{feature.tours}</Text>
                                            <CheckBox
                                                // title={feature.name}
                                                checked={transportFeatures.includes(feature.id)}
                                                onPress={() => handleTransportFeatureSelection(feature.id)}
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
                        <Text style={styles.filterHeading}>Tour Type</Text>
                        <View style={{}}>
                            {
                                filtersData.all_types.map((type, index) => (
                                    <View key={index} style={styles.checkContainer}>

                                        <Text style={styles.checkboxTitle}>{type.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.checkboxCount}>{type.tours}</Text>
                                            <CheckBox
                                                // title={type.name}
                                                checked={transportTypes.includes(type.id)}
                                                onPress={() => handleTransportTypeSelection(type.id)}
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
                        <TouchableOpacity onPress={() => handleApplyFilters()} style={[styles.modalSearchButton, { marginTop: 30, }]}>
                            <Text style={{ color: 'white', fontSize: 15 }}>Apply Filters</Text>
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
        alignSelf: 'center',

        
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
