
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';



import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon } from '@rneui/themed';

import Dashboard from '../Dashboard/Dashboard';
import Booking from '../Booking/Booking';
import Login from '../Authentication/Login';
import CreateAccount from '../Authentication/CreateAccount';
import ForgetPassword from '../Authentication/ForgetPassword';

import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';

import MoreScreen from '../More/More';
import EStore from '../Store/Store';
import StoreCart from '../Store/Cart';

import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

function MainNavigator() {

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    // const navigation = useNavigation();

    function DetailsScreen({ route }) {

        const { params } = route;
        const routName = params ? params.routName : '';
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: commonStylesSheet.screenBackground }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: commonStylesSheet.filtersStar }}>{routName} Screen</Text>
            </View>
        );
    }

    const StoreHeaderButton = () => {
        const navigation = useNavigation();

        const handleCartButtonPress = () => {
            // navigation.navigate('Cart');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Cart' }],
            });
        };

        return (
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => handleCartButtonPress()}>
                <Icon type='material-community' name='cart' iconStyle={{ color: commonStylesSheet.modalsText, fontSize: 30 }} />
            </TouchableOpacity>
        );
    };

    return (

        <NavigationContainer >


            <Tab.Navigator

                screenOptions={({ route }) => ({
                    tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', paddingVertical: 0 },
                    tabBarActiveTintColor: commonStylesSheet.darkBackground,
                    tabBarInactiveTintColor: commonStylesSheet.muteText,

                    tabBarStyle: {
                        // backgroundColor: 'red',
                        // paddingVertical: 10,
                        height: 65,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderWidth: 0,
                        borderTopWidth: 0,
                        elevation: 0

                    },

                    tabBarIcon: ({ focused, }) => {
                        let iconName;
                        let iconType = 'material-community';
                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Packages') {
                            iconName = focused ? 'inbox-multiple' : 'inbox-multiple-outline';
                        } else if (route.name === 'Booking') {
                            iconName = 'playlist-check';
                        } else if (route.name === 'More') {
                            iconName = 'menu';
                        } else if (route.name === 'Me') {
                            iconName = focused ? 'account-circle' : 'account-circle-outline';
                        }
                        // else if (route.name === 'Deals') {
                        //     iconName = focused ? 'tag-multiple' : 'tag-multiple-outline';
                        // }
                        else if (route.name === 'CMS Store') {
                            iconName = focused ? 'storefront' : 'storefront-outline';
                        }
                        return <Icon name={iconName}
                            type={iconType}
                            iconProps={{ style: { color: focused ? commonStylesSheet.darkForeground : commonStylesSheet.muteText, fontSize: 22 } }}
                            containerStyle={{
                                backgroundColor: focused ? commonStylesSheet.darkBackground : commonStylesSheet.darkForeground,
                                paddingHorizontal: 17, paddingVertical: 3, borderTopRightRadius: 15, borderBottomEndRadius: 15, borderTopLeftRadius: 15, borderBottomLeftRadius: 15
                            }}

                        />;
                    },
                })}

            >

                <Tab.Screen
                    name="Home"
                    component={Dashboard}
                    options={{ headerShown: false }}
                />
                <Tab.Screen
                    name="Booking"
                    component={Booking}
                />
                {/* <Tab.Screen
                    name="Deals"
                    component={DetailsScreen}
                    initialParams={{ routName: 'Deals' }}
                /> */}


                <Tab.Screen
                    name="CMS Store"
                    component={EStore} x
                    options={{
                        headerRight: () => <StoreHeaderButton />
                    }}
                />

                <Tab.Screen
                    name="Cart"
                    component={StoreCart}

                    options={{
                        tabBarButton: () => {
                            return (<></>)
                        },
                        headerTitle: 'Shopping Cart',
                    }}
                />
                {/* <Tab.Screen
                    name="Packages"
                    component={DetailsScreen}
                    initialParams={{ routName: 'Packages' }}
                /> */}
                {/* <Tab.Screen
                    name="More"
                    component={MoreScreen}
                /> */}
                <Tab.Screen
                    name="Me"
                    component={MoreScreen}
                />

                <Tab.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false,
                        tabBarButton: () => {
                            return (<></>)
                        },
                        tabBarStyle: {
                            display: 'none'
                        }
                    }}
                />
                <Tab.Screen
                    name="CreateAccount"
                    component={CreateAccount}
                    options={{
                        headerShown: false,
                        tabBarButton: () => {
                            return (<></>)
                        },
                        tabBarStyle: {
                            display: 'none'
                        }
                    }}
                />
                <Tab.Screen
                    name="ForgetPassword"
                    component={ForgetPassword}
                    options={{
                        headerShown: false,
                        tabBarButton: () => {
                            return (<></>)
                        },
                        tabBarStyle: {
                            display: 'none'
                        }
                    }}
                />

            </Tab.Navigator>

        </NavigationContainer >
    );
}


export default MainNavigator;
