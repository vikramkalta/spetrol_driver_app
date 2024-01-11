import { all } from 'redux-saga/effects';

import { watchSendOtp, watchSetDeviceTokenInactive, watchSetToken, watchVerifyOtp } from './auth';
import { watchGetFuellingUnits, watchSwitchUnit } from './fuelling-unit';
import { watchCreateSelfConsumptionLogs, watchGetSelfConsumptionLogs, watchUpdateFuellingVehicle } from './home';
import { watchAdjustOrder, watchCreateOfflineOrder, watchGetOrders, watchGetOrdersQueue, watchOnOrderFinished, watchOrderFulfillment } from './order';
import { watchUpdateDriver, watchUploadMedia } from './profile';

// notice how we now only export the rootSaga
// single entry point to start all sagas at once
export default function* rootSaga() {
  yield all([
    watchSendOtp(),
    watchVerifyOtp(),
    watchUpdateDriver(),
    watchUploadMedia(),
    watchUpdateFuellingVehicle(),
    watchGetOrders(),
    watchGetOrdersQueue(),
    watchOrderFulfillment(),
    watchSetToken(),
    watchSetDeviceTokenInactive(),
    watchCreateOfflineOrder(),
    watchAdjustOrder(),
    watchOnOrderFinished(),
    watchGetSelfConsumptionLogs(),
    watchCreateSelfConsumptionLogs(),
    watchGetFuellingUnits(),
    watchSwitchUnit(),
  ]);
}