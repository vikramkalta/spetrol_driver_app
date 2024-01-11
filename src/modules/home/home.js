import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Navigator from './navigator';
import Document from '../profile/document';
import { errorHandler } from '../../utils/helper-functions';
import { ACTIONS, AUTH_TOKEN_KEY, COMMON_ERROR_MESSAGE, COMMON_TEXT_COLOR, SCREENS, SPETROL_RED } from '../../utils/constants';
import Media from '../profile/media';
import OrderSuccessful from './order-successful';
import PastOngoing from './past-ongoing';
import AdhocOrders from './adhoc-order';
import SelfConsumption from './self-consumption/self-consumption';
import SelectUnit from './select-unit/select-unit';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DocumentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={SCREENS.DOCUMENT}>
      <Stack.Screen name={SCREENS.DOCUMENT} component={Document} initialParams={{ verified: 1 }} />
      <Stack.Screen name={SCREENS.MEDIA} component={Media} />
    </Stack.Navigator>
  );
};

const NavigatorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={SCREENS.DRIVER_NAVIGATOR}>
      <Stack.Screen name={SCREENS.DRIVER_NAVIGATOR} component={Navigator} />
      <Stack.Screen name={SCREENS.ORDER_SUCCESSFUL} component={OrderSuccessful} />
    </Stack.Navigator>
  );
};

const Profile = () => {
  const { authReducer } = useSelector(state => state);

  return (
    <View
      style={{
        height: 100,
        backgroundColor: '#111111',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
      }}>
      <View
        style={{
          marginLeft: 10,
          width: 70,
          height: 70,
          borderRadius: 35,
          borderColor: 'grey',
          shadowColor: '#000',
          overflow: 'hidden'
        }}>
        <Image
          resizeMode={'cover'}
          source={{ uri: authReducer.user?.ImageUrl }}
          style={{ width: '100%', height: '100%', alignSelf: 'center' }}
        />
      </View>
      <View style={{ marginLeft: '3%' }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{`${authReducer.user?.FirstName} ${authReducer.user?.LastName}`}</Text>
        <Text style={{ color: '#fff', fontSize: 14 }}>{authReducer.user?.Mobile}</Text>
      </View>
    </View>
  );
};

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const prompt = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        },
        { text: 'OK', onPress: () => logout() }
      ]
    );
  };

  const logout = async () => {
    try {
      dispatch({ type: ACTIONS.AUTH.SET_DEVICE_TOKEN_INACTIVE });
      await sleep(200);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, '');
      // This action needs token, so call it before setting auth token to null.
      dispatch({ type: ACTIONS.AUTH.SET_TOKEN, payload: null });
      dispatch({ type: ACTIONS.AUTH.LOG_OUT, payload: null });
    } catch (error) {
      errorHandler(COMMON_ERROR_MESSAGE);
    }
  };

  const sleep = ms => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }; 

  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', width: '100%', }} {...props}>
      <DrawerItem
        style={{
          width: '120%',
          padding: 0,
          marginTop: -20,
          marginLeft: -10,
        }}
        label={Profile}
      />
      <DrawerItemList {...props} />
      <DrawerItem
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%'
        }}
        label={() => (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='lock-outline' size={20} color={SPETROL_RED} />
            <Text style={{
              marginLeft: 10,
              color: SPETROL_RED,
              fontSize: 15
            }}>{'Log out'}</Text>
          </View>
        )}
        onPress={prompt}
      />
    </DrawerContentScrollView>
  );
};

const Header = ({ navigation }) => {
  const onPress = () => {
    navigation.openDrawer();
  };

  return (
    <View style={{ height: 40, width: 40, borderRadius: 20, marginLeft: 10, marginTop: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Icon name='menu' size={30} color={COMMON_TEXT_COLOR} onPress={onPress} />
    </View>
  );
};

const Home = () => {
  const [screenOptions, setScreenOptions] = useState({ lazy: true })
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator screenOptions={screenOptions}
        screenListeners={{
          state: event => {
            if (event?.data?.state?.index === 0) {
              setScreenOptions({
                lazy: true,
                header: Header,
                headerTitle: '',
                headerTransparent: true,
                headerStyle: { height: 40 }
              })
            } else {
              setScreenOptions({ lazy: true });
            }
          }
        }}
        initialRouteName='Navigator'
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name='Navigator' component={NavigatorStack} />
        <Drawer.Screen name='Documents' component={DocumentStack} />
        <Drawer.Screen name='Orders' component={PastOngoing} />
        <Drawer.Screen name='Ad-hoc Orders' component={AdhocOrders} />
        <Drawer.Screen name='Self Consumption' component={SelfConsumption} />
        <Drawer.Screen name='Select Unit' component={SelectUnit} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Home;