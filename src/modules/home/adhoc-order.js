import React, { useState, useEffect } from 'react';
import { View, Text, Picker } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ITextInput, IButton, ILoader } from '../../components';
import { ACTIONS, COMMON_TEXT_COLOR, SCREENS, SPETROL_RED } from '../../utils/constants';

const INITIAL_FORM_DATA = {
  CustomerName: null,
  VehicleNumber: null,
  FuellingVehicleId: null,
  FuelAmount: null,
  OrderStatus: 'CREATED',
  PaymentMode: 'CASH',
};

const AdhocOrders = ({ navigation }) => {
  const { orderReducer, authReducer, homeReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFormData({ ...INITIAL_FORM_DATA });
    });
    return unsubscribe;
  }, [navigation]);

  const createOrder = () => {
    const formDataCopy = {
      ...formData,
      FuellingVehicleId: authReducer.user?.Vehicles,
      Location: {
        Address1: 'NA',
        Location: {
          type: 'Point',
          coordinates: [homeReducer.origin?.longitude, homeReducer.origin?.latitude]
        }
      },
      PaymentDetails: { PaymentMode: formData.PaymentMode },
      Source: 'Driver',
    };
    delete formDataCopy.PaymentMode;
    dispatch({
      type: ACTIONS.ORDER.CREATE_OFFLINE_ORDER_ASYNC,
      payload: formDataCopy,
      callback: () => navigation.navigate('Navigator'),
    });
  };

  const updateFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const setDisabled = () => {
    return !(parseInt(formData.FuelAmount) && formData.VehicleNumber && formData.CustomerName);
  };

  return (
    <View style={{ flex: 1, padding: '3%', alignItems: 'center' }}>

      <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <View style={{ flex: 1, padding: '1%' }}>
          <Text style={{ marginBottom: '1%', fontSize: 16, fontWeight: 'bold', color: COMMON_TEXT_COLOR }}>{'Customer name'}</Text>
          <ITextInput
            style={{ padding: 10, borderColor: '#555', borderWidth: 1, borderRadius: 8, height: 50, }}
            maxLength={10}
            textChangeHandler={(value) => updateFormData('CustomerName', value)}
            value={formData.CustomerName} x
            placeholder={'Customer name'}
            keyboardDefault={'default'}
          />
        </View>

        <View style={{ flex: 1, padding: '1%' }}>
          <Text style={{ marginBottom: '1%', fontSize: 16, fontWeight: 'bold', color: COMMON_TEXT_COLOR }}>{'Fuel amount'}</Text>
          <ITextInput
            style={{ padding: 10, borderColor: '#555', borderWidth: 1, borderRadius: 8, height: 50, }}
            maxLength={7}
            textChangeHandler={(value) => updateFormData('FuelAmount', value)}
            value={formData.FuelAmount}
            placeholder={'Fuel quantity'}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: '2%' }}>
        <View style={{ flex: 1, padding: '1%' }}>
          <Text style={{ marginBottom: '1%', fontSize: 16, fontWeight: 'bold', color: COMMON_TEXT_COLOR }}>{'Vehicle number'}</Text>
          <ITextInput
            style={{ padding: 10, borderColor: '#555', borderWidth: 1, borderRadius: 8, height: 50, }}
            maxLength={10}
            textChangeHandler={(value) => updateFormData('VehicleNumber', value)}
            value={formData.VehicleNumber}
            placeholder={'Vehicle number'}
            keyboardDefault={'default'}
          />
        </View>

        <View style={{ width: '50%', padding: '1%', }}>
          <Text style={{ marginBottom: '1%', fontSize: 16, fontWeight: 'bold', color: COMMON_TEXT_COLOR }}>{'Payment mode'}</Text>
          <View style={{ borderColor: '#555', height: 50, borderWidth: 1, borderRadius: 8 }}>

            <Picker
              selectedValue={formData.PaymentMode}
              onValueChange={(value) => updateFormData('PaymentMode', value)}
            >
              <Picker.Item label="CASH" value="Cash" />
              <Picker.Item label="ONLINE" value="Online" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={{ padding: '3%', justifyContent: 'center', alignItems: 'center' }}>
        {
          orderReducer.isLoading ? <ILoader size='large' /> : <IButton
            style={[{ backgroundColor: SPETROL_RED, borderRadius: 4 }, { width: '90%' }]}
            title={'Create offline order'}
            onPressHandler={createOrder}
            disabled={setDisabled()}
          />
        }
      </View>

    </View>
  );
};

export default AdhocOrders;