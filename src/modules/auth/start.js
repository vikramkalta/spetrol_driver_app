import React, { useEffect, useState } from 'react';
import { View, Text, Image, PermissionsAndroid, Modal, Platform, } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';

import { IButton } from '../../components';
import layoutStyles from '../../styles/layout';
import { SCREENS, SPETROL_RED } from '../../utils/constants';
import { errorHandler } from '../../utils/helper-functions';

const TITLE = 'Welcome to Driver App';
const LOCATION_DISCLOSURE_TEXT = 'This app (spetrol_driver_app) collects location data to enable our customers to track driver\'s location even when the app is closed or not in use.'

const Start = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getPermissionStatus();
  }, []);

  const getPermissionStatus = () => {
    request(Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    })).then(res => {
      if (res === 'denied') {
        setModalVisible(true);
      }
    });
  };

  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Spetrol (Driver)',
        message: 'Spetrol App wants to access your location.',
        buttonPositive: 'OK',
      });
      console.log('PermissionsAndroid.RESULTS [granted]', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setModalVisible(false);
        // getPermissionStatus();
      } else {
        errorHandler(null, 'You denied the location permission. You will be again prompted in the home screen to when you will receive orders.');
      }
    } catch (error) {
      errorHandler(null, COMMON_ERROR_MESSAGE);
    }
  };

  const accept = () => {
    getPermission();
    setModalVisible(false);
  };

  const deny = () => {
    setModalVisible(false);
    errorHandler(null, 'You denied the location permission. You will be again prompted in the home screen to continue receiving customer orders.');
  };

  const disclosureModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={{
          width: '100%',
          height: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} onPress={() => setModalVisible(false)}>{'SPETROL '}</Text>
          <Text style={{ color: 'white', marginRight: '10%', marginLeft: '10%' }}>{LOCATION_DISCLOSURE_TEXT}</Text>
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', width: '50%', height: 100, alignItems: 'center' }}>
            <IButton
              style={[
                { ...layoutStyles.defaultButton, backgroundColor: '#483D8B' },
              ]}
              title={'Accept'}
              onPressHandler={accept}
            />
            <IButton
              style={[
                { ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED },
              ]}
              title={'Deny'}
              onPressHandler={deny}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const onPress = () => navigation.navigate(SCREENS.PHONE);
  return (
    <View style={[layoutStyles.defaultContainer]}>
      <View style={{ flex: 1 }}>
        <Text style={[layoutStyles.defaultTextColor, {
          fontWeight: 'bold',
          fontSize: 20
        }]}>
          {TITLE}
        </Text>
      </View>

      <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Image
          resizeMode={'stretch'}
          source={require('../../../assets/intro.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View style={{ flex: 2, width: '100%', justifyContent: 'space-evenly', }}>
        <IButton
          style={[
            { ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED },
            { alignSelf: 'stretch' }
          ]}
          title={'Create Account'}
          onPressHandler={onPress}
        />
        <IButton
          style={[
            { ...layoutStyles.defaultButton, backgroundColor: 'grey' },
            { alignSelf: 'stretch', }
          ]}
          title={'Sign In'}
          onPressHandler={onPress}
        />
      </View>
      {disclosureModal()}
    </View>
  );
};

export default Start;