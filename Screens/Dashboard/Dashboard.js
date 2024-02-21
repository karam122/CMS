import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
    ScrollView,
    Dimensions,
    RefreshControl
} from 'react-native';



import DashboardTabs from './DashboardTabs';
import DashboardNav from './DashboardNav';
import DashboardPackages from './DashboardPackages';
import { commonStylesSheet } from '../../StyleSheets/CommonStylesheet';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



function Dashboard() {

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // setTimeout(() => {
        //     setRefreshing(false);
        // }, 4000);
    }, []);


    return (
        <View style={styles.dashboardContainer} >

            <DashboardTabs />
            <ScrollView contentContainerStyle={{ backgroundColor: commonStylesSheet.screenBackground, paddingBottom: 250 }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <DashboardPackages refreshing={refreshing} setRefreshing={(value) => setRefreshing(value)} />

            </ScrollView>
        </View>
    );
}



export default Dashboard;




const styles = StyleSheet.create({
    dashboardContainer: {
        backgroundColor: commonStylesSheet.screenBackground,
        minHeight: screenHeight - 90
        // backgroundColor: 'red',
        // minHeight: screenHeight
        // paddingHorizontal: 10
    },

});
