import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import PastOrders from './past-order';
import OngoingOrders from './ongoing-order';
import { SPETROL_RED } from '../../utils/constants';
import ScheduledOrders from './scheduled-order';

const Tab = createMaterialTopTabNavigator();

const PastOngoing = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: SPETROL_RED },
        lazy: true
      }}
      initialRouteName={'Past'}>
      <Tab.Screen name='Past' component={PastOrders} />
      <Tab.Screen name='Ongoing' component={OngoingOrders} />
      <Tab.Screen name='Scheduled' component={ScheduledOrders} />
    </Tab.Navigator>
  );
};

export default PastOngoing;