import { call, put, takeLatest } from 'redux-saga/effects';
import DriverService from '../services/driver';

import { ACTIONS } from '../utils/constants';
import { errorHandler } from '../utils/helper-functions';

const HOME = ACTIONS.HOME;

export function* updateFuellingVehicle({ payload }) {
  try {
    yield call(DriverService.updateFuellingVehicle, payload);
    yield put({ type: HOME.UPDATE_FUELLING_VEHICLE_SUCCESS, payload });
  } catch (error) {
    errorHandler(error.message, 'Please contact admin to view orders.');
    yield put({ type: HOME.UPDATE_FUELLING_VEHICLE_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchUpdateFuellingVehicle() {
  yield takeLatest(HOME.UPDATE_FUELLING_VEHICLE_ASYNC, updateFuellingVehicle);
}

export function* getSelfConsumptionLogs({ payload }) {
  try {
    const result = yield call(DriverService.getSelfConsumptionLogs, payload);
    yield put({ type: HOME.FETCH_SELF_CONSUMPTION_LOGS_SUCCESS, payload: result });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: HOME.FETCH_SELF_CONSUMPTION_LOGS_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchGetSelfConsumptionLogs() {
  yield takeLatest(HOME.FETCH_SELF_CONSUMPTION_LOGS_ASYNC, getSelfConsumptionLogs);
}

export function* createSelfConsumptionLogs({ payload, callback }) {
  try {
    const result = yield call(DriverService.createSelfConsumptionLogs, payload);
    yield put({ type: HOME.CREATE_SELF_CONSUMPTION_LOGS_SUCCESS, payload: result });
    callback && callback();
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: HOME.CREATE_SELF_CONSUMPTION_LOGS_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchCreateSelfConsumptionLogs() {
  yield takeLatest(HOME.CREATE_SELF_CONSUMPTION_LOGS_ASYNC, createSelfConsumptionLogs);
}