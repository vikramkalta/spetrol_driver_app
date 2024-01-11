import { call, put, takeLatest } from 'redux-saga/effects';

import DriverService from '../services/driver';
import { ACTIONS } from '../utils/constants';
import { errorHandler } from '../utils/helper-functions';

const PROFILE = ACTIONS.PROFILE;

export function* updateDriver({ payload }) {
  try {
    yield call(DriverService.updateDriver, payload);
    yield put({ type: PROFILE.UPDATE_DETAILS_SUCCESS, payload });
    yield put({ type: ACTIONS.AUTH.SET_USER_ID, payload });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: PROFILE.UPDATE_DETAILS_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchUpdateDriver() {
  yield takeLatest(PROFILE.UPDATE_DETAILS_ASYNC, updateDriver);
}

export function* uploadMedia({ payload }) {
  try {
    let result = yield call(DriverService.uploadMedia, payload);
    yield put({ type: PROFILE.UPLOAD_MEDIA_SUCCESS, payload: result });
    if (result.length) {
      result = result[0];
    }
    yield put({ type: ACTIONS.AUTH.SET_DOCUMENTS, payload: { ...result, type: payload.type } });
  } catch (error) {
    errorHandler(error.message);
    yield put({ type: PROFILE.UPLOAD_MEDIA_FAIL, payload: { errorMessage: error.message } });
  }
}

export function* watchUploadMedia() {
  yield takeLatest(PROFILE.UPLOAD_MEDIA_ASYNC, uploadMedia);
}