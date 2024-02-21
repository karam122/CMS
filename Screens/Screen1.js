
import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import { Icon } from '@rneui/themed';


function Screen1() {
    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Screen One</Text>


            <Icon name='lock' />

            {/* <Icon
                raised
                name='heartbeat'
                type='font-awesome'
                color='#f50'
                onPress={() => console.log('hello')} /> */}



        </View>
    )
}

export default Screen1;