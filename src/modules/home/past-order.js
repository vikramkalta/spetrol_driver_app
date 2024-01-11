import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ILoader } from '../../components';
import { ACTIONS, COMMON_TEXT_COLOR, COMMON_TEXT_HEIGHT, MONTHS } from '../../utils/constants';
import { formatDate, formatHour } from '../../utils/helper-functions';

const PastOrders = ({ navigation }) => {
  const { orderReducer } = useSelector(state => state);
  const [pastOrders, setPastOrders] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch({
        type: ACTIONS.ORDER.FETCH_ORDERS_ASYNC, payload: {
          Page: 1, PageSize: 50, Type: 'Past'
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (orderReducer.pastOrders?.length && !pastOrders) {
      setPastOrders(orderReducer.pastOrders);
    }
  });

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
    const createdDate = new Date(item.AuditInfo?.CreatedTime || null);
    const hour = formatHour(createdDate.getHours(), createdDate.getMinutes());
    const date = formatDate(createdDate.getDate());
    const month = MONTHS[createdDate.getMonth()];
    const year = createdDate.getFullYear();
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'transparent',
        borderBottomWidth: 1,
        position: 'relative',
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        padding: 10,
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 8,
      }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: COMMON_TEXT_COLOR }}>{`${item.FuelAmount}L Diesel`}</Text>
          <Text style={{ fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{vehicles.join(',')}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: COMMON_TEXT_COLOR }}>{`${date} ${month} (${year})`}</Text>
          <Text style={{ fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{`${hour}`}</Text>
        </View>
      </View>
    );
  };

  const renderPastOrders = () => {
    if (!pastOrders?.length) {
      return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Icon name='shopping-bag' size={50} color='lightgrey' />
          <Text style={{ marginTop: '3%', color: COMMON_TEXT_COLOR, fontSize: 16, fontWeight: 'bold' }}>{'No past deliveries'}</Text>
          <Text style={{ marginTop: '3%', color: COMMON_TEXT_COLOR, fontSize: COMMON_TEXT_HEIGHT }}>{'See your past orders by completing assigned orders.'}</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          data={[...pastOrders]}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      </View>
    )
  };

  return (
    <View style={{ flex: 1, marginTop: '2%' }}>
      {
        orderReducer.isLoading ? (
          <ILoader size='large' />
        ) : (
            renderPastOrders()
          )
      }
    </View>
  );
};

export default PastOrders;