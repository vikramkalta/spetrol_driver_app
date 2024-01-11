import { call, put, takeLatest } from 'redux-saga/effects';

import DriverService from '../services/driver';
import FuellingUnitService from '../services/fuelling-unit';
import { ACTIONS } from '../utils/constants';
import { errorHandler } from '../utils/helper-functions';

const FUELLING_UNIT = ACTIONS.FUELLING_UNIT;

export function* getFuellingUnits({ payload }) {
  try {
    const result = yield call(FuellingUnitService.getFuellingUnits, payload);
    yield put({ type: FUELLING_UNIT.FETCH_FUELLING_UNIT_SUCCESS, payload: result });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: FUELLING_UNIT.FETCH_FUELLING_UNIT_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchGetFuellingUnits() {
  yield takeLatest(FUELLING_UNIT.FETCH_FUELLING_UNIT_ASYNC, getFuellingUnits);
}

export function* switchUnit({ payload }) {
  try {
    const result = yield call(DriverService.switchUnit, payload);
    yield put({ type: FUELLING_UNIT.SWITCH_UNIT_SUCCESS, payload: result });
    yield put({ type: ACTIONS.AUTH.SET_CURRENT_VEHICLE, payload: payload.FuellingVehicleId });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: FUELLING_UNIT.SWITCH_UNIT_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchSwitchUnit() {
  yield takeLatest(FUELLING_UNIT.SWITCH_UNIT_ASYNC, switchUnit);
}