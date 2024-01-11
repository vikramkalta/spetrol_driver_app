import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

import { setOngoingOrderToNull } from '../../actions/orders';
import { IButton } from '../../components';
import { COMMON_TEXT_COLOR, SCREENS, SPETROL_RED } from '../../utils/constants';

const OrderSuccessful = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setOngoingOrderToNull());
  }, []);

  const onPressBack = () => {
    navigation.navigate(SCREENS.DRIVER_NAVIGATOR);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Icon name='check-box' size={40} color={'#87BF11'} />
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: COMMON_TEXT_COLOR }}>
        {'Order successfully delivered!'}
      </Text>

      <IButton
        style={[{backgroundColor: SPETROL_RED}, { width: '90%', position: 'absolute', bottom: '5%', backgroundColor: SPETROL_RED }]}
        onPressHandler={onPressBack}
        title={'Go back home'}
      />
    </View>
  );
};

export default OrderSuccessful;

