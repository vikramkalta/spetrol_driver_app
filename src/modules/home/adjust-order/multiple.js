import React, { useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { IButton, ITextInput } from '../../../components';
import { ACTIONS, COMMON_TEXT_COLOR, SPETROL_RED } from '../../../utils/constants';

const Multiple = () => {
  const { orderReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const [vehicleWiseData, setVehicleWiseData] = useState(orderReducer?.ongoingOrder?.Customer);

  const adjustFuelQuantity = (item, value) => {
    for (let i = 0; i < vehicleWiseData.length; i++) {
      const vehicle = vehicleWiseData[i];
      if (item.Vehicles?._id === vehicle.Vehicles?._id) {
        vehicle.FuelQuantity = value;
        break;
      }
    }
    setVehicleWiseData([...vehicleWiseData]);
  };

  const setDisabled = () => {
    for (const vehicle of vehicleWiseData) {
      if (Number(vehicle.FuelQuantity) > 0) {
        return false;
      }
    }
    return true;
  };

  const updateFuelQuantity = () => {
    const vehicleFuelDetails = [];
    for (const item of vehicleWiseData) {
      if (item.FuelQuantity) {
        vehicleFuelDetails.push({
          CustomerVehicleId: item.Vehicles._id,
          FuelQuantity: item.FuelQuantity,
        });
      }
    }
    dispatch({
      type: ACTIONS.ORDER.ADJUST_ORDER_ASYNC,
      payload: {
        OrderId: orderReducer?.ongoingOrder?._id,
        VehicleFuelDetails: vehicleFuelDetails,
      },
      callback: () => {
        Alert.alert(
          'Success',
          'Order adjusted successfully',
          [{ text: 'OK', onPress: () => {} }]
        );
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: '2%' }}>

        <View style={{ width: '50%', justifyContent: 'center', }}>
          <Text style={{ marginBottom: '2%', fontSize: 16, fontWeight: 'bold', color: COMMON_TEXT_COLOR }}>
            {`Plate number: ${item.Vehicles.PlateNumber}`}
          </Text>
        </View>

        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
          <ITextInput
            style={{ padding: 10, borderColor: '#555', borderWidth: 1, borderRadius: 8, height: 50, width: 150 }}
            maxLength={7}
            textChangeHandler={(value) => adjustFuelQuantity(item, value)}
            placeholder={'Fuel quantity'}
            defaultValue={'0'} />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        contentContainerStyle={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: '4%'
        }}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        data={[...orderReducer?.ongoingOrder?.Customer]}
        renderItem={renderItem}
        keyExtractor={item => item?.Vehicles?._id}
      />
      <View style={{ padding: '3%', justifyContent: 'center', alignItems: 'center' }}>
        <IButton
          style={[{ backgroundColor: SPETROL_RED, borderRadius: 4 }, { width: '90%' }]}
          title={'Update order'}
          onPressHandler={updateFuelQuantity}
          disabled={setDisabled()}
        />
      </View>
    </View>
  );
};

export default Multiple;