import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { ACTIONS, SCREENS, APP_STATES } from './src/utils/constants';
import Phone from './src/modules/auth/phone';
import Otp from './src/modules/auth/otp';
import Details from './src/modules/profile/details';
import Document from './src/modules/profile/document';
import Media from './src/modules/profile/media';
import Home from './src/modules/home/home';
import Start from './src/modules/auth/start';
import { ILoader } from './src/components';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  messaging().setBackgroundMessageHandler(async () => {
    dispatch({ type: ACTIONS.AUTH.FETCH_APP_STATE });
  });

  const { authReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authReducer.appStateFetching) {
      dispatch({ type: ACTIONS.AUTH.FETCH_APP_STATE });
    }
  });

  const Loader = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ILoader size='large' />
      </View>
    );
  };

  const loginStack = () => {
    return (
      <>
        <Stack.Screen name={SCREENS.START} component={Start} />
        <Stack.Screen name={SCREENS.PHONE} component={Phone} />
        <Stack.Screen name={SCREENS.OTP} component={Otp} />
      </>
    );
  };

  const renderStack = () => {
    const { appState } = authReducer;
    if (authReducer.appStateFetching) {
      return (
        <>
          <Stack.Screen name={'Loader'} component={Loader} />
        </>
      );
    }
    switch (appState) {
      case APP_STATES.LOGIN:
        return loginStack();
      case APP_STATES.DOCUMENT_PENDING:
        return (
          <>
            <Stack.Screen name={SCREENS.DETAILS} component={Details} />
            <Stack.Screen name={SCREENS.DOCUMENT} component={Document} />
            <Stack.Screen name={SCREENS.MEDIA} component={Media} />
          </>
        );
      case APP_STATES.READY:
        return (
          <>
            <Stack.Screen name={SCREENS.HOME} component={Home} />
          </>
        );
      default:
        return loginStack();
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={authReducer.initialScreen}>
        {renderStack()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
