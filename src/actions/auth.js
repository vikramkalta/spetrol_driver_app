import { ACTIONS } from '../utils/constants';

export function setAuthReducerSuccessFalse() {
  return {
    type: ACTIONS.AUTH.SET_SUCCESS_FALSE,
    payload: false
  };
}

export function setDocumentsVerified() {
  return {
    type: ACTIONS.AUTH.VERIFY_DOCUMENTS
  };
}

export function setCurrentVehicle(payload) {
  return { type: ACTIONS.AUTH.SET_CURRENT_VEHICLE, payload, };
}