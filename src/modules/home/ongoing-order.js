import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ILoader, OrderCard } from '../../components';
import { ACTIONS, COMMON_TEXT_COLOR, COMMON_TEXT_HEIGHT, NEXT_STATUS } from '../../utils/constants';
import { store } from '../../../App'

const OngoingOrders = ({ navigation }) => {
  const { orderReducer, authReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch({
        type: ACTIONS.ORDER.FETCH_ORDERS_QUEUE_ASYNC, payload: {
          UserId: authReducer.user?._id,
          FuellingVehicleId: store.getState()?.authReducer?.user?.Vehicles,
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  const handleAccept = order => {
    dispatch({
      type: ACTIONS.ORDER.ACCEPT_REJECT_ASYNC, payload: {
        OrderId: order._id,
        Status: NEXT_STATUS[order.OrderStatus],
        callback: () => navigation.navigate('Navigator'),
      }
    });
  };

  const handleOngoingOrder = order => {
    if (order._id === orderReducer.ongoingOrder._id) {
      return;
    }
    dispatch({ type: ACTIONS.ORDER.SET_ONGOING_ORDER, payload: order });
  };

  const noop = () => { };

  const renderItem = ({ item }) => {
    let vehicles = [];
    for (let i = 0; i < item.Customer?.length; i++) {
      const vehicle = item.Customer[i].Vehicles;
      if (vehicle.Make?.length) {
        vehicles.push(vehicle.Make[0].Make);
      } else {
        vehicles.push(vehicle.Vehicle.Name);
      }
    }
    return (<OrderCard
      quantity={`${item.FuelAmount}L Diesel`}
      status={item.OrderStatus}
      vehicleDetailsSummary={vehicles.join(',')}
      deliveryLocation={item.Location.Address1}
      deliveryType={item.DeliveryType}
      showButtons={false}
      order={item}
      onPressAdjust={noop}
      handleOngoingOrder={handleOngoingOrder}/>);
  };

  const renderOngoingOrder = () => {
    const { ongoingOrder: item } = orderReducer;

    if (!item) {
      return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Icon name='shopping-bag' size={50} color='lightgrey' />
          <Text style={{ marginTop: '3%', color: COMMON_TEXT_COLOR, fontSize: 16, fontWeight: 'bold' }}>{'No ongoing deliveries!'}</Text>
          <Text style={{ marginTop: '3%', color: COMMON_TEXT_COLOR, fontSize: COMMON_TEXT_HEIGHT }}>{'Go online or wait sometime for new orders to be assigned.'}</Text>
        </View>
      );
    }

    let vehicles = [];
    for (let i = 0; i < item.Customer?.length; i++) {
      const vehicle = item.Customer[i].Vehicles;
      if (vehicle.Make?.length) {
        vehicles.push(vehicle.Make[0].Make);
      } else {
        vehicles.push(vehicle.Vehicle.Name);
      }
    }
    return (
      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
        <View style={{ width: '95%' }}>
          <OrderCard
            quantity={`${item.FuelAmount}L Diesel`}
            status={item.OrderStatus}
            vehicleDetailsSummary={vehicles.join(',')}
            deliveryLocation={item.Location.Address1}
            deliveryType={item.DeliveryType}
            handleAccept={handleAccept}
            orderCardHeight={200}
            showButtons={item.OrderStatus === 'CREATED'}
            order={item}
            onPressAdjust={noop}
          />
        </View>

        <Text style={{ color: COMMON_TEXT_COLOR, fontSize: 14, fontWeight: 'bold', marginTop: '2%', marginBottom: '2%' }}>
          {orderReducer.upcomingOrders?.length ? 'Upcoming orders' : 'No upcoming orders.'}
        </Text>

        <FlatList
          style={{ width: '100%' }}
          contentContainerStyle={{
            paddingLeft: 15,
            paddingRight: 15,
          }}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          data={[...orderReducer.upcomingOrders]}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, margin: '2%' }}>
      {orderReducer.isLoading ? <ILoader size='large' /> : renderOngoingOrder()}
    </View>
  );
};

export default OngoingOrders;