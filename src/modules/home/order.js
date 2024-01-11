import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, DeviceEventEmitter, Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SwipeButton from 'rn-swipe-button';

import { ILoader, OrderCard } from '../../components';
import { ACTIONS, COMMON_TEXT_COLOR, COMMON_TEXT_HEIGHT, NEXT_STATUS, ORDER_STATUSES, ORDER_STATUSES_STRING, SCREENS, SPETROL_RED } from '../../utils/constants';
import { errorHandler } from '../../utils/helper-functions';
import { ReposIOT } from '../../../NativeModules';
import IModal from '../../components/modal';
import AdjustOrder from './adjust-order';
import { store } from '../../../App';

const SWIPE_BUTTON_HEIGHT = 40;

const Order = ({ navigation, snapPointsProp, title, orderCardHeight, routeInfo }) => {
  const { orderReducer, authReducer, homeReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const [online, setOnline] = useState(homeReducer.onlineStatus);
  const [modalVisible, setModalVisible] = useState(false);
  const onlineRef = useRef(online);

  const _setOnline = (onlineStatus) => {
    onlineRef.current = onlineStatus;
    setOnline(onlineStatus);
  };

  const _handleOnFocus = () => {
    if (onlineRef.current) {
      dispatch({
        type: ACTIONS.ORDER.FETCH_ORDERS_QUEUE_ASYNC, payload: {
          UserId: authReducer.user?._id,
          FuellingVehicleId: store.getState()?.authReducer?.user?.Vehicles,
        }
      });
    }
    bottomSheetRef.current?.snapToIndex(0);
  };

  const reBluetoothEventHandler = data => {
    // errorHandler(null, JSON.stringify(data));
    let orderDetails;
    try {
      orderDetails = JSON.parse(data.orderDetails);
      if (orderDetails.quantity) {
        dispatch({
          type: ACTIONS.ORDER.ON_ORDER_FINISHED_ASYNC,
          payload: {
            VehicleId: authReducer.user?.Vehicles,
            ...orderDetails,
          },
        });
      }
    } catch (error) {
      errorHandler(null, 'Something went wrong. Set DU manually.');
      orderDetails = {};
    }
    if (data.deviceFound) {
      errorHandler(null, JSON.stringify(data));
      ReposIOT.setFuelRate(parseFloat(orderDetails.SpotFuelPrice));
      ReposIOT.setOrder(orderDetails.FuelAmount, orderDetails.OrderId);
      // ReposIOT.setOrder(orderDetails.FuelAmount, 'alpha'); Does not parse
    }
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('ReBluetoothEvent', reBluetoothEventHandler);
    return () => {
      DeviceEventEmitter.removeAllListeners('ReBluetoothEvent', reBluetoothEventHandler);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', _handleOnFocus);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      _setOnline(homeReducer.onlineStatus);
      if (homeReducer.onlineStatus) {
        dispatch({
          type: ACTIONS.ORDER.FETCH_ORDERS_QUEUE_ASYNC, payload: {
            UserId: authReducer.user?._id,
            FuellingVehicleId: authReducer.user?.Vehicles,
          }
        });
      }
    }
    // Cancel subscription to useEffect
    return () => (isSubscribed = false);
  }, [homeReducer.onlineStatus]);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => snapPointsProp, []);

  const handleAccept = order => {
    dispatch({
      type: ACTIONS.ORDER.ACCEPT_REJECT_ASYNC, payload: {
        OrderId: order._id,
        Status: NEXT_STATUS[order?.OrderStatus],
      }
    });
  };

  const onPressAdjust = () => {
    setModalVisible(!modalVisible);
  };

  const onSwipeRight = () => {
    Alert.alert('Warning', 'Are you sure you want to do this?', [{
      text: 'Cancel',
      onPress: () => { },
      style: 'cancel'
    }, {
      text: 'OK',
      onPress: () => {
        const payload = {
          OrderId: orderReducer.ongoingOrder._id,
          Status: NEXT_STATUS[orderReducer.ongoingOrder?.OrderStatus],
        };
        if (NEXT_STATUS[orderReducer.ongoingOrder?.OrderStatus] === ORDER_STATUSES_STRING.DELIVERED) {
          payload.callback = navigation.navigate(SCREENS.ORDER_SUCCESSFUL);
        }
        dispatch({ type: ACTIONS.ORDER.ACCEPT_REJECT_ASYNC, payload });
      }
    }]);
  };

  const getVehicleSummary = item => {
    let vehicles = [];
    for (let i = 0; i < item.Customer?.length; i++) {
      const vehicle = item.Customer[i].Vehicles;
      if (vehicle.Make?.length) {
        vehicles.push(vehicle.Make[0].Make);
      } else {
        vehicles.push(vehicle.Vehicle.Name);
      }
    }
    return vehicles;
  };

  const renderOrders = () => {
    const item = orderReducer.ongoingOrder;
    if (!item) {
      return (
        <View style={{ height: 50, width: '100%', alignItems: 'center', }}>
          <Text style={{ fontSize: 14, color: COMMON_TEXT_COLOR, }}>{'No active orders.'}</Text>
        </View>
      );
    }

    let vehicles = getVehicleSummary(item);
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <View style={{ width: '100%' }}>
          <OrderCard
            quantity={`${item.FuelAmount}L Diesel`}
            status={item.OrderStatus}
            vehicleDetailsSummary={vehicles.join(',')}
            deliveryLocation={item.Location.Address1}
            deliveryType={item.DeliveryType}
            orderCardHeight={orderCardHeight + 20}
            order={item}
            onPressAdjust={onPressAdjust}
            showButtons={item.OrderStatus === 'CREATED'}
            handleAccept={handleAccept} />
        </View>


        <IModal modalVisible={modalVisible}>
          <View
            style={{
              width: '100%',
              height: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              flex: 1,
            }}>
            <AdjustOrder />
            <View style={{height: 40, width: '100%',backgroundColor:'#fff', justifyContent: 'center', alignItems:'center'}}>
              <Icon onPress={() => setModalVisible(false)} name='close' size={40} color={SPETROL_RED} />
            </View>
          </View>
        </IModal>
      </View>
    );
  };

  const SwipeThumb = () => {
    return (
      <View style={{ width: SWIPE_BUTTON_HEIGHT, height: SWIPE_BUTTON_HEIGHT, backgroundColor: SPETROL_RED, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ffffff' }}>
          <Icon name='arrow-right-alt' size={20} />
        </Text>
      </View>
    );
  };

  const renderOngoingOrderControls = () => {
    const { ongoingOrder } = orderReducer;
    if (!ongoingOrder) {
      return null;
    }
    if (ongoingOrder?.OrderStatus === 'CREATED') {
      return null;
    }
    return (
      <View>
        <View style={{ marginLeft: '2%', marginRight: '2%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: COMMON_TEXT_COLOR, fontWeight: 'bold' }}>{'Drive to Customer'}</Text>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: '2%' }}>
              <Text style={{ fontSize: 13, color: COMMON_TEXT_COLOR, }}>{routeInfo?.distance}</Text>
              <Text style={{ fontSize: 13, color: COMMON_TEXT_COLOR, marginLeft: '2%' }}>{routeInfo?.duration}</Text>
            </View>
          </View>
          <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: '#F8F0E3', justifyContent: 'center', alignItems: 'center' }}>
            <Icon name='phone' size={25} />
          </View>
        </View>

        {
          (
            // AccessibilityInfo.remove, if warnings show.
            <SwipeButton
              containerStyles={{ borderRadius: 5, margin: '2%', borderWidth: 0 }}
              height={SWIPE_BUTTON_HEIGHT}
              onSwipeSuccess={onSwipeRight}
              railBackgroundColor={'#FBE9EA'}
              railFillBackgroundColor={SPETROL_RED}
              railFillBorderColor={SPETROL_RED}
              railStyles={{ borderRadius: 5 }}
              thumbIconComponent={SwipeThumb}
              thumbIconStyles={{ borderRadius: 0, borderWidth: 0 }}
              title={orderReducer.ongoingOrder?.OrderStatus?.toUpperCase() === 'ACCEPTED' ? 'Start Delivery' : 'Finish Delivery'}
              titleColor={SPETROL_RED}
              titleFontSize={16}
              resetAfterSuccessAnimDelay={100}
              shouldResetAfterSuccess={true} />
          )
        }
      </View>
    );
  };

  const renderOffline = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: COMMON_TEXT_COLOR }}>{title}</Text>
        <Text style={{ fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{'Go online to accept delivery orders.'}</Text>
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints} >

      {homeReducer.onlineStatus ? renderOngoingOrderControls() : renderOffline()}

      {
        homeReducer.onlineStatus ? (
          <View style={{ margin: '2%' }}>
            {orderReducer.isLoading ? <ILoader size='large' /> : renderOrders()}
          </View>
        ) : null
      }
    </BottomSheet>
  );
};

export default Order;