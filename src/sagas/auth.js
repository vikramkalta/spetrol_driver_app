import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, takeLatest } from 'redux-saga/effects';
import messaging from '@react-native-firebase/messaging';

import AuthService from '../services/auth';
import DriverService from '../services/driver';
import { ACTIONS, AUTH_TOKEN_KEY } from '../utils/constants';
import { errorHandler } from '../utils/helper-functions';
import PushNotificationService from '../services/push-notification';

const AUTH = ACTIONS.AUTH;

// Our worker saga: will perform the async task
export function* sendOtp(payload) {
  try {
    yield call(AuthService.sendOtp, payload.phone, payload.phone.includes('9999999') ? true : false);
    yield put({ type: AUTH.SEND_OTP_SUCCESS, payload: { phone: payload.phone } });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: AUTH.SEND_OTP_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchSendOtp() {
  yield takeLatest(AUTH.SEND_OTP_ASYNC, sendOtp);
}

export function* verifyOtp(payload) {
  try {
    const result = yield call(AuthService.verifyOtp, payload);
    yield AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
    yield put({ type: AUTH.VERIFY_OTP_SUCCESS, payload: result });
    yield put({ type: AUTH.SET_TOKEN, payload: result.token });
    yield messaging().registerDeviceForRemoteMessages();
    const deviceToken = yield messaging().getToken();
    // Save the user device token.
    yield call(PushNotificationService.register, { Token: deviceToken, Active: true });
  } catch (error) {
    errorHandler(null, error.message);
    yield put({ type: AUTH.VERIFY_OTP_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchVerifyOtp() {
  yield takeLatest(AUTH.VERIFY_OTP_ASYNC, verifyOtp);
}

export function* setToken() {
  try {
    const token = yield AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      const driver = yield call(DriverService.getDriver);
      yield put({ type: AUTH.SET_USER_ID, payload: driver });
      yield put({ type: AUTH.SET_TOKEN, payload: token });
    } else {
      yield put({ type: AUTH.SET_TOKEN, payload: null });
    }
  } catch (error) {
    errorHandler(error.message);
  }
}

export function* watchSetToken() {
  yield takeLatest(AUTH.FETCH_APP_STATE, setToken);
}

export function* setDeviceTokenInactive() {
  try {
    // Set the token as inactive.
    yield messaging().registerDeviceForRemoteMessages();
    const deviceToken = yield messaging().getToken();
    yield call(PushNotificationService.register, { Token: deviceToken, Active: false });
  } catch (error) {
    errorHandler(null, error.message);
  }
}

export function* watchSetDeviceTokenInactive() {
  yield takeLatest(AUTH.SET_DEVICE_TOKEN_INACTIVE, setDeviceTokenInactive);
}