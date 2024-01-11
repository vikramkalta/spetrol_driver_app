import { ACTIONS } from '../utils/constants';

const HOME = ACTIONS.HOME;

const initialState = {
  errorMessage: '',
  isLoading: false,
  onlineStatus: false,
  socketConnected: false,
  success: false,
  origin: {},
  selfConsumptionLogs: [],
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME.ONLINE_STATUS:
      return {
        ...state,
        onlineStatus: !state.onlineStatus
      };
    case HOME.SET_SOCKET_CONNECTED:
      return {
        ...state,
        socketConnected: action.payload,
      };
    case HOME.UPDATE_FUELLING_VEHICLE_ASYNC:
      return {
        ...state,
        isLoading: true
      };
    case HOME.UPDATE_FUELLING_VEHICLE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true
      };
    case HOME.UPDATE_FUELLING_VEHICLE_FAIL:
      return {
        ...state,
        success: false,
        isLoading: false,
        errorMessage: action.payload?.errorMessage
      };
    case HOME.CURRENT_LOCATION:
      return {
        ...state,
        origin: action.payload,
      };
    case HOME.FETCH_SELF_CONSUMPTION_LOGS_ASYNC:
      return {
        ...state,
        isLoading: true
      };
    case HOME.FETCH_SELF_CONSUMPTION_LOGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        selfConsumptionLogs: action.payload,
      };
    case HOME.FETCH_SELF_CONSUMPTION_LOGS_FAIL:
      return {
        ...state,
        success: false,
        isLoading: false,
        errorMessage: action.payload?.errorMessage
      };
    default:
      return state;
  }
};

export default homeReducer;