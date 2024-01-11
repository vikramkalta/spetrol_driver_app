import { ACTIONS, APP_STATES, SCREENS } from '../utils/constants';

const AUTH = ACTIONS.AUTH;

const initialState = {
  appStateFetching: true,
  phone: '',
  token: '',
  errorMessage: '',
  isLoading: false,
  success: false,
  user: {},
  appState: '',
  initialScreen: ''
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH.SET_USER_ID:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case AUTH.SET_TOKEN:
      let appState = '';

      if (!action.payload) {
        appState = APP_STATES.LOGIN;
        initialScreen = SCREENS.START;
      } else {
        const isDocsVerified = getDocumentsVerified(state.user?.Documents);
        appState = isDocsVerified ? APP_STATES.READY : APP_STATES.DOCUMENT_PENDING;
        initialScreen = isDocsVerified ? SCREENS.HOME : SCREENS.DETAILS;
      }
      return {
        ...state,
        token: action.payload,
        appStateFetching: false,
        appState,
        initialScreen,
      };
    case AUTH.SEND_OTP_ASYNC:
      return {
        ...state,
        isLoading: true
      };
    case AUTH.SEND_OTP_SUCCESS:
      return {
        ...state,
        phone: action.payload?.phone,
        isLoading: false,
        success: true
      };
    case AUTH.SEND_OTP_FAIL:
      return {
        ...state,
        errorMessage: action.payload?.errorMessage,
        isLoading: false,
        success: false
      };
    case AUTH.VERIFY_OTP_ASYNC:
      return {
        ...state,
        isLoading: true
      };
    case AUTH.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        success: true
      };
    case AUTH.VERIFY_OTP_FAIL:
      return {
        ...state,
        errorMessage: action.payload?.errorMessage,
        isLoading: false,
        success: false
      };
    case AUTH.SET_SUCCESS_FALSE:
      return {
        ...state,
        success: false
      };
    case AUTH.SET_DOCUMENTS:
      return {
        ...state,
        user: {
          ...state.user,
          ImageUrl: action.payload?.type === 'Pic' ? action.payload?.ImageUrl : state.user?.ImageUrl,
          Documents: action.payload?.Documents
        }
      };
    case AUTH.VERIFY_DOCUMENTS:
      state.user?.Documents?.forEach(doc => {
        doc.Verified = true;
      });
      return {
        ...state,
        user: {  ...state.user, },
        appState: APP_STATES.READY,
        initialScreen: SCREENS.HOME,
      };
    case AUTH.SET_CURRENT_VEHICLE:
      return {
        ...state,
        user: {
          ...state.user,
          Vehicles: action.payload,
        }
      };
    default:
      return state;
  }
};

const getDocumentsVerified = documents => {
  let isVerified = true;
  if (!documents?.length) {
    return false;
  }
  for (let i = 0; i < documents?.length; i++) {
    const doc = documents[i];
    if (!doc.Verified) {
      isVerified = false;
      break;
    }
  }
  return isVerified;
};

export default authReducer;