import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { IButton, ITextInput } from '../../../components';
import { COMMON_TEXT_COLOR, SPETROL_RED } from '../../../utils/constants';

const Single = () => {
  const { orderReducer } = useSelector(state => state);
  const [adjustedFuelQuantity, setAdjustedFuelQuantity] = useState(orderReducer?.ongoingOrder?.FuelAmount || 0);

  const adjustFuelQuantity = (value) => {
    setAdjustedFuelQuantity(value);
  };

  const updateFuelQuantity = () => { };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

      <View style={{ flex: 1, paddingTop: '5%', alignItems: 'center' }}>
        <Text style={{ marginBottom: '2%', fontSize: 16, fontWeight: 'bold', color: COMMON_TEXT_COLOR }}>{'Enter Adjusted Fuel Quantity'}</Text>
        <ITextInput
          style={{ padding: 10, borderColor: '#555', borderWidth: 1, borderRadius: 8, height: 50, width: 150 }}
          maxLength={4}
          textChangeHandler={(value) => adjustFuelQuantity(value)}
          value={adjustedFuelQuantity}
          placeholder={'Fuel quantity'}
          defaultValue={adjustedFuelQuantity.toString()}
        />
      </View>

      <View style={{ padding: '3%', justifyContent: 'center', alignItems: 'center' }}>
        <IButton
          style={[{ backgroundColor: SPETROL_RED, borderRadius: 4 }, { width: '90%' }]}
          title={'Update order'}
          onPressHandler={updateFuelQuantity}
          disabled={!adjustedFuelQuantity}
        />
      </View>
    </View>
  );
};

export default Single;