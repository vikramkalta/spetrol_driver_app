/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import AppNavigator from './AppNavigator';
import configureStore from './src/store/configureStore';

export const store = configureStore();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
