import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { IButton, ILoader, ITextInput } from '../../../components';
import IModal from '../../../components/modal';
import { ACTIONS, COMMON_TEXT_COLOR, COMMON_TEXT_HEIGHT, MONTHS, SPETROL_BLUE, SPETROL_RED } from '../../../utils/constants';
import { formatDate, formatHour } from '../../../utils/helper-functions';

const SelfConsumption = ({ navigation }) => {
  const { homeReducer, authReducer } = useSelector(state => state);
  const [selfConsumptionLogs, setSelfConsumptionLogs] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fuelQuantity, setFuelQuantity] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch({
        type: ACTIONS.HOME.FETCH_SELF_CONSUMPTION_LOGS_ASYNC, payload: {
          Page: 1, PageSize: 50, FuellingVehicleId: authReducer.user?.Vehicles,
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (homeReducer.selfConsumptionLogs?.length) {
      setSelfConsumptionLogs(homeReducer.selfConsumptionLogs);
    }
  }, [homeReducer.selfConsumptionLogs]);

  const renderItem = ({ item }) => {
    const createdTime = new Date(item.CreatedTime || null);
    const hour = formatHour(createdTime.getHours(), createdTime.getMinutes());
    const date = formatDate(createdTime.getDate());
    const month = MONTHS[createdTime.getMonth()];
    const year = createdTime.getFullYear();
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
        shadowOffset: { width: 0, height: 3, },
        padding: 10,
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 8,
      }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: COMMON_TEXT_COLOR }}>{`${item.FuelQuantity}L Diesel`}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: COMMON_TEXT_COLOR }}>{`${date} ${month} (${year})`}</Text>
          <Text style={{ fontSize: COMMON_TEXT_HEIGHT, color: COMMON_TEXT_COLOR }}>{`${hour}`}</Text>
        </View>
      </View>
    );
  };

  const renderSelfConsumedLogs = () => {
    if (!selfConsumptionLogs?.length) {
      return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Icon name='shopping-bag' size={50} color='lightgrey' />
          <Text style={{ marginTop: '3%', color: COMMON_TEXT_COLOR, fontSize: 16, fontWeight: 'bold' }}>{'No self consumed logs'}</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          data={[...selfConsumptionLogs]}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      </View>
    )
  };

  const setDisabled = () => {
    return !parseInt(fuelQuantity);
  };

  const onPressAddConsumptionLog = () => {
    setModalVisible(!modalVisible);
  };

  const addConsumedFuel = () => {
    dispatch({
      type: ACTIONS.HOME.CREATE_SELF_CONSUMPTION_LOGS_ASYNC,
      payload: {
        FuellingVehicleId: authReducer.user?.Vehicles,
        FuelQuantity: fuelQuantity,
      },
      callback: () => {
        Alert.alert(
          'Success',
          'Consumed fuel added successfully',
          [{ text: 'OK', onPress: () => {} }]
        );
        setModalVisible(!modalVisible);
        dispatch({
          type: ACTIONS.HOME.FETCH_SELF_CONSUMPTION_LOGS_ASYNC, payload: {
            Page: 1, PageSize: 50, FuellingVehicleId: authReducer.user?.Vehicles,
          }
        });
      }
    });
  };

  return (
    <View style={{ flex: 1, marginTop: '2%' }}>
      <View style={{ height: 40, width: '100%', backgroundColor: 'lightgrey', alignItems: 'flex-end', padding: '1%' }}>
        <TouchableOpacity onPress={onPressAddConsumptionLog}>
          <Icon name='add-circle' size={30} color={SPETROL_BLUE} />
        </TouchableOpacity>
      </View>
      {
        homeReducer.isLoading ? (
          <ILoader size='large' />
        ) : (
            renderSelfConsumedLogs()
          )
      }
      <IModal modalVisible={modalVisible}>
        <View
          style={{
            width: '100%',
            height: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <View style={{ padding: '3%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', marginBottom: '3%' }}>
              <ITextInput
                style={{ padding: 10, borderColor: '#555', borderWidth: 1, borderRadius: 8, height: 50, width: 150, backgroundColor: '#fff' }}
                maxLength={7}
                textChangeHandler={setFuelQuantity}
                placeholder={'Fuel quantity'}
                defaultValue={'0'} />
            </View>
            <IButton
              style={[{ backgroundColor: SPETROL_RED, borderRadius: 4 }, { width: '90%' }]}
              title={'Add consumed fuel'}
              onPressHandler={addConsumedFuel}
              disabled={setDisabled()}
            />
          </View>

        </View>
        <View style={{ height: 40, width: '100%', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <Icon onPress={() => setModalVisible(false)} name='close' size={40} color={SPETROL_RED} />
        </View>
      </IModal>
    </View>
  );
};

export default SelfConsumption;