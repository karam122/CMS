
import React from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


import SplashScreen from 'react-native-splash-screen';


import MainNavigator from './Screens/Navigator/MainNavigator';


import { store } from './Redux/store';
import { Provider } from 'react-redux';

function App() {

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>

  );
}


export default App;
