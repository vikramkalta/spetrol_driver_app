import { ACTIONS } from '../utils/constants';

export function setOnlineStatus() {
  return {
    type: ACTIONS.HOME.ONLINE_STATUS,
  };
}

export function setSocketConnected(value) {
  return {
    type: ACTIONS.HOME.SET_SOCKET_CONNECTED,
    payload: value,
  };
}