import { Picker } from '@react-native-picker/picker';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ILoader } from '../../../components';
import { ACTIONS } from '../../../utils/constants';

const SelectUnit = ({ navigation }) => {
  const { fuellingUnitReducer, authReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: ACTIONS.FUELLING_UNIT.FETCH_FUELLING_UNIT_ASYNC, payload: {} });
  }, [navigation]);

  const handleChangeUnit = value => {
    dispatch({ type: ACTIONS.FUELLING_UNIT.SWITCH_UNIT_ASYNC, payload: { FuellingVehicleId: value } });
  };

  return (
    <View style={{ flex: 1, padding: '3%', alignItems: 'center' }}>
      {
        fuellingUnitReducer.isLoading ?
          <ILoader size='large' />
          : (
            <Picker
              style={{ width: 150, height: 40, borderColor: '#555', borderStyle: 'solid', borderWidth: 1 }}
              selectedValue={authReducer.user?.Vehicles}
              onValueChange={handleChangeUnit}
            >
              {fuellingUnitReducer.fuellingUnits?.map(fuellingUnit => (
                <Picker.Item key={fuellingUnit._id} label={fuellingUnit.PlateNumber} value={fuellingUnit._id} />
              ))}
            </Picker>
          )
      }

    </View>
  );
};

export default SelectUnit;