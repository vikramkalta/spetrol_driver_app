import { call, put, takeLatest } from 'redux-saga/effects';

import DriverService from '../services/driver';
import OrderService from '../services/order';
import { ACTIONS, ORDER_STATUSES_STRING } from '../utils/constants';
import { errorHandler } from '../utils/helper-functions';
import { ReposIOT } from '../../NativeModules';
import { APP_CONFIG } from '../config';

const ORDER = ACTIONS.ORDER;

export function* getOrders({ payload }) {
  try {
    const result = yield call(OrderService.getOrders, payload);
    yield put({ type: ORDER.FETCH_ORDERS_SUCCESS, payload: result, orderType: payload.Type });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: ORDER.FETCH_ORDERS_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchGetOrders() {
  yield takeLatest(ORDER.FETCH_ORDERS_ASYNC, getOrders);
}

export function* getOrdersQueue({ payload }) {
  try {
    const result = yield call(DriverService.getOrders, payload);
    yield put({ type: ORDER.FETCH_ORDERS_QUEUE_SUCCESS, payload: result });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: ORDER.FETCH_ORDERS_QUEUE_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchGetOrdersQueue() {
  yield takeLatest(ORDER.FETCH_ORDERS_QUEUE_ASYNC, getOrdersQueue);
}

export function* orderFulfillment({ payload }) {
  try {
    const result = yield call(OrderService.orderFulfillment, payload);
    yield put({ type: ORDER.ACCEPT_REJECT_SUCCESS, payload: result });
    if (payload.Status === ORDER_STATUSES_STRING.DELIVERED) {
      yield put({ type: ORDER.SET_ONGOING_ORDER_TO_NULL });
      ReposIOT.initRepos(APP_CONFIG.REPOS_DEVICE_ID, APP_CONFIG.REPOS_PARTNER_ID, JSON.stringify({
        OrderId: String(result.OrderId),
        FuelAmount: result.FuelAmount,
        SpotFuelPrice: result.SpotFuelPrice,
      }));
    }
    if (payload.callback) {
      payload.callback();
    }
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: ORDER.ACCEPT_REJECT_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchOrderFulfillment() {
  yield takeLatest(ORDER.ACCEPT_REJECT_ASYNC, orderFulfillment);
}

export function* createOfflineOrder({ payload, callback }) {
  try {
    const result = yield call(OrderService.createOfflineOrder, payload);
    yield put({ type: ORDER.CREATE_OFFLINE_ORDER_SUCCESS, payload: result });
    callback && callback();
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: ORDER.CREATE_OFFLINE_ORDER_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchCreateOfflineOrder() {
  yield takeLatest(ORDER.CREATE_OFFLINE_ORDER_ASYNC, createOfflineOrder);
}

export function* adjustOrder({ payload, callback }) {
  try {
    const result = yield call(OrderService.adjustOrder, payload);
    yield put({ type: ORDER.ADJUST_ORDER_SUCCESS, payload: result });
    callback && callback();
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: ORDER.ADJUST_ORDER_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchAdjustOrder() {
  yield takeLatest(ORDER.ADJUST_ORDER_ASYNC, adjustOrder);
}

export function* onOrderFinished({ payload }) {
  try {
    yield call(DriverService.onOrderFinished, payload);
  } catch (error) {
    errorHandler(error.message, 'Error in IOT Controller [Order finished event]');
  }
}

export function* watchOnOrderFinished() {
  yield takeLatest(ORDER.ON_ORDER_FINISHED_ASYNC, onOrderFinished);
}