import React, {} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { SPETROL_RED } from '../../utils/constants';
import Single from './adjust-order/single';
import Multiple from './adjust-order/multiple';

const Tab = createMaterialTopTabNavigator();

const AdjustOrder = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor: SPETROL_RED},
        lazy: true,
      }}
      initialRouteName={'Adjust-Order'}
    >
      {/* <Tab.Screen name='Single' component={Single} /> */}
      <Tab.Screen name='Adjust-Order' component={Multiple} />
    </Tab.Navigator>
  );
};

export default AdjustOrder;