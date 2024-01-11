import React from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import layoutStyles from '../styles/layout';
import { COMMON_TEXT_COLOR, COMMON_TEXT_HEIGHT, ORDER_STATUSES_STRING, SPETROL_BLUE, SPETROL_RED } from '../utils/constants';
import IButton from './button';

const OrderCard = ({
  quantity, status, vehicleDetailsSummary, deliveryLocation, deliveryType, disabled,
  handleAccept, order, orderCardHeight, showButtons, onPressAdjust, handleOngoingOrder
}) => {
  const handleOrderDetails = () => { };
  const accept = () => handleAccept(order);
  const changeCurrentOrder = () => handleOngoingOrder ? handleOngoingOrder(order) : null;

  return (
    <Pressable
      onPress={changeCurrentOrder}
      style={{
        width: '100%',
        height: orderCardHeight,
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
        marginTop: 3,
        marginBottom: 3,
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 8,
      }}>

      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: COMMON_TEXT_COLOR }}>{quantity}</Text>
          <Text style={{ fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{vehicleDetailsSummary}</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 30,
            backgroundColor: '#F8921C',
            borderRadius: 10,
          }}>
          <Text style={{ color: '#fff' }}>{status}</Text>
        </View>
      </View>

      {
        status === ORDER_STATUSES_STRING.ON_WAY ? (
          <TouchableOpacity style={{ height: 40, alignItems: 'flex-end' }} onPress={() => onPressAdjust()}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
                height: 30,
                backgroundColor: SPETROL_BLUE,
                borderRadius: 10,
              }}>
              <Text style={{ color: '#fff' }}>{'ADJUST'}</Text>
            </View>
          </TouchableOpacity>
        ) : null
      }

      <View style={{ height: 60 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='location' size={20} style={{ marginLeft: -4 }} />
          <Text style={{ fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{deliveryLocation}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcon name='access-time' size={15} />
            <Text style={{ marginLeft: 5, fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{deliveryType}</Text>
          </View>
          <View>
            <Text style={{ marginLeft: 5, fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>
              {order.ScheduledTime?.StartTime ? moment(order.ScheduledTime.StartTime).format('DD-MM-YYYY hh:mm A') : ''}
            </Text>
          </View>
        </View>

      </View>
      {
        showButtons ? (
          (
            <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', marginTop: 5 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <IButton
                  style={[{ ...layoutStyles.defaultButton, backgroundColor: COMMON_TEXT_COLOR }, { width: '90%' }]}
                  title={'Help'}
                  onPressHandler={handleOrderDetails}
                />
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <IButton
                  style={[{ ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED }, { width: '90%' }]}
                  title={'Start delivery'}
                  onPressHandler={accept}
                  disabled={disabled}
                />
              </View>
            </View>
          )
        ) : null
      }
    </Pressable >
  );
};

export default OrderCard;