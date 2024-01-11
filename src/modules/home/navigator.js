import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, PermissionsAndroid, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Polyline from '@mapbox/polyline';
import LaunchNavigator from 'react-native-launch-navigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons//Ionicons';

import { ILoader } from '../../components';
import { ACTIONS, AUTH_TOKEN_KEY, COMMON_ERROR_MESSAGE, EVENTS, ORDER_STATUSES, ORDER_STATUSES_STRING, SPETROL_RED } from '../../utils/constants';
import { errorHandler } from '../../utils/helper-functions';
import { setOnlineStatus } from '../../actions/home';
import { closeSocket, emit, initSocket } from '../../sockets/init';
import Order from './order';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_API_KEY = 'AIzaSyAZLdMTweRDT3oOEssJniENagOc5NezVe4';
LaunchNavigator.setGoogleApiKey(GOOGLE_API_KEY);

const initialBottomSheetHeightInPercent = 40;
const REFRESH_LOCATION_MS = 30000; //20000;

const Navigator = ({ navigation }) => {
  const [bottom, setBottom] = useState(0);
  const [origin, setOrigin] = useState({ latitude: 17.4326, longitude: 78.4071 });
  const [destination, setDestination] = useState(null);
  const [coords, setCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef();
  const dispatch = useDispatch();
  const { homeReducer, authReducer, orderReducer } = useSelector(state => state);

  useMemo(() => getUserLocation(), []);
  useMemo(() => setBottom(height * 0.4), [])
  useEffect(() => createRoute(), [origin]);
  useEffect(() => createRoute(), [destination]);

  useEffect(async () => {
    try {
      // Update fuelling vehicle's online status in the backend.
      dispatch({
        type: ACTIONS.HOME.UPDATE_FUELLING_VEHICLE_ASYNC, payload: {
          VehicleId: authReducer.user?.Vehicles,
          Serviceable: homeReducer.onlineStatus,
        }
      });
      if (homeReducer.onlineStatus) {
        let token;
        if (!authReducer.token) {
          token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        }

        initSocket(authReducer.token || token, dispatch);

        // Subscribe to google map position api
        // NOTE: https://github.com/software-mansion/react-native-reanimated/pull/2316/files. Add the 2 lines to avoid warnings.
        subscribeLocation();
      } else {
        setDestination(null);
        setCoords(null);
        closeSocket();
      }
    } catch (error) {
    }
  }, [homeReducer.onlineStatus]);

  useEffect(() => {
    if (homeReducer.socketConnected) {
      getUserLocation();
      const timer = setInterval(() => {
        getUserLocation();
      }, REFRESH_LOCATION_MS);
      return () => {
        clearInterval(timer);
      };
    }
  }, [homeReducer.socketConnected]);

  useEffect(() => {
    if (orderReducer.ongoingOrder) {
      const location = orderReducer.ongoingOrder?.Location?.Location?.coordinates;
      if (location) {
        setDestination({ latitude: location[1], longitude: location[0] });
      }
    } else {
      setDestination(null);
    }
  }, [orderReducer.ongoingOrder]);

  useEffect(() => {
    dispatch({ type: ACTIONS.HOME.CURRENT_LOCATION, payload: origin });
  }, [origin]);

  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Spetrol (Driver)',
        message: 'Spetrol App wants to access your location.',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getUserLocation();
        return true;
      } else {
        await getPermission();
      }
    } catch (error) {
      errorHandler(COMMON_ERROR_MESSAGE, JSON.stringify(error));
    }
  };

  const onPressGo = () => dispatch(setOnlineStatus());

  const getDirections = async (startLoc, destinationLoc) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_API_KEY}&mode=driving`);
      const responseJson = await response.json();

      const _routeInfo = responseJson.routes?.[0]?.legs?.[0];
      setRouteInfo({ distance: _routeInfo?.distance?.text, duration: _routeInfo?.duration?.text });

      const points = Polyline.decode(responseJson.routes[0].overview_polyline.points);
      const coords = points.map(point => { return { latitude: point[0], longitude: point[1] }; });
      setCoords(coords);
      return coords;
    } catch (error) {
      console.log('error[getDirections]', error);
      errorHandler(COMMON_ERROR_MESSAGE, JSON.stringify(error));
    }
  };

  function getUserLocation() {
    Geolocation.getCurrentPosition(
      position => {
        // Getting longitude and latitude from the location
        const _origin = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        if (homeReducer.socketConnected) {
          emit(EVENTS.SEND_DRIVER_LOCATION, {
            VehicleId: authReducer.user?.Vehicles,
            Location: { Longitude: _origin?.longitude, Latitude: _origin?.latitude },
          });
        }
        setOrigin(_origin);
      },
      async error => {
        console.log('error [getUserLocation]', error);
        if (error.PERMISSION_DENIED) {
          await getPermission();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  function subscribeLocation() {
    let watchId = Geolocation.watchPosition(
      async position => {
        // Will give you location on location
        const _origin = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setOrigin(_origin);

        emit(EVENTS.SEND_DRIVER_LOCATION, {
          VehicleId: authReducer.user?.Vehicles,
          Location: { Longitude: _origin.longitude, Latitude: _origin.latitude }
        });
      },
      async error => {
        console.log('error [subscribeLocation]', error);
        if (error.PERMISSION_DENIED) {
          await getPermission();
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 20000,
      },
    );
  };

  const createRoute = async () => {
    try {
      if (mapRef) {
        mapRef.current?.fitToCoordinates([origin, destination], { animated: true });
      }
      if (destination) {
        await getDirections(`${origin.latitude},${origin.longitude}`, `${destination.latitude},${destination.longitude}`);
      }
    } catch (error) {
      console.log('createRoute[error]', error);
      errorHandler(COMMON_ERROR_MESSAGE, JSON.stringify(error));
    }
  };

  const onPressNavigate = async () => {
    try {
      await LaunchNavigator.navigate([destination.latitude, destination.longitude], {
        start: `${origin.latitude},${origin.longitude}`
      });
    } catch (error) {
      errorHandler(COMMON_ERROR_MESSAGE);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {
        !origin ?
          (<ILoader size='large' />) :
          (
            <View style={{ flex: 1 }}>
              <MapView
                ref={mapRef}
                style={{ flex: 1, paddingBottom: 500 }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                followsUserLocation
                zoomEnabled={true}
                initialRegion={{
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                }}
                showsMyLocationButton={true}
                showsTraffic={true}
                showsCompass={true}
                mapPadding={{ top: 50, right: 50, bottom, left: 50 }}>
                {coords ?
                  (
                    <>
                      <Marker.Animated coordinate={origin} />
                      {destination ? (<Marker coordinate={destination} />) : null}
                      <MapView.Polyline
                        coordinates={coords}
                        strokeWidth={4}
                        strokeColor={SPETROL_RED}
                      />
                    </>
                  )
                  : null}
              </MapView>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: `${initialBottomSheetHeightInPercent + 1}%`,
                  alignSelf: 'center'
                }}
                onPress={onPressGo} >
                <Icon name={homeReducer.onlineStatus ? 'stop-circle' : 'play-circle'} size={70} color={SPETROL_RED} />
              </TouchableOpacity>

              {destination && [ORDER_STATUSES_STRING.ACCEPTED, ORDER_STATUSES_STRING.ON_WAY].includes(orderReducer.ongoingOrder?.OrderStatus) ?
                (<TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: `${initialBottomSheetHeightInPercent + 1}%`,
                    right: '3%',
                    alignSelf: 'center'
                  }}
                  onPress={onPressNavigate} >
                  <IonIcons name={'ios-navigate-circle'} size={50} color={'#276EF1'} />
                </TouchableOpacity>) : null}

              <Order
                navigation={navigation}
                snapPointsProp={[`${initialBottomSheetHeightInPercent}%`, `${initialBottomSheetHeightInPercent + 10}%`, '70%']}
                title={`You're ${homeReducer.onlineStatus ? 'online' : 'offline'}`}
                online={homeReducer.onlineStatus}
                orderCardHeight={height * 0.25}
                routeInfo={routeInfo} />
            </View>
          )
      }
    </View>

  );
};

export default Navigator;
