import React from 'react';
import {
    Text,
    Dimensions,
    View,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { commonStylesSheet } from '../StyleSheets/CommonStylesheet';

const screenWidth = Dimensions.get('window').width;
const RangeSlider = ({ min, max, step=100, currentValues, setCurrentValues, width=((90 / 100) * screenWidth) -20 }) => {
    // const [currentValues, setCurrentValues] = React.useState([min, max]);
    return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: width }}>
                <View>
                    <Text style={[ { fontStyle: "italic" }, { textAlign: "left", fontSize: 14, color: commonStylesSheet.muteText } ]}>Min</Text>
                    <Text style={[{ fontWeight: "bold" }, { fontSize: 15, color: commonStylesSheet.modalsText}]}>{currentValues[0].toLocaleString()} PKR </Text>
                </View>
                <View>
                    <Text style={[ { fontStyle: "italic" }, { textAlign: "right", fontSize: 14, color: commonStylesSheet.muteText } ]}>Max</Text>
                    <Text style={[{ fontWeight: "bold" }, { fontSize: 15, color: commonStylesSheet.modalsText }]}>{currentValues[1].toLocaleString()} PKR</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <MultiSlider
                    values={[currentValues[0], currentValues[1]]}
                    sliderLength={width}
                    onValuesChange={setCurrentValues}
                    trackStyle={{ height: 4, borderRadius: 4, }}
                    markerStyle={{ height: 10, width: 10, borderRadius: 10, marginTop: 3, backgroundColor: commonStylesSheet.darkBackground }}
                    pressedMarkerStyle={{ height: 15, width: 15, borderRadius: 10, backgroundColor: commonStylesSheet.darkBackground }}
                    selectedStyle={{ backgroundColor: commonStylesSheet.darkBackground }}
                    min={min}
                    max={max}
                    step={step}
                />
            </View>
        </View>
    );
};

export default RangeSlider;