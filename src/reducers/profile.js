import { ACTIONS } from '../utils/constants';

const PROFILE = ACTIONS.PROFILE;

const initialState = {
  errorMessage: '',
  isLoading: false,
  success: false,
  userId: ''
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE.SET_USER_ID:
      return {
        ...state,
        success: false,
        userId: action.payload
      };
    case PROFILE.UPDATE_DETAILS_ASYNC:
      return {
        ...state,
        isLoading: true
      };
    case PROFILE.UPDATE_DETAILS_SUCCESS:
      return {
        ...state,
        profileDetails: action.payload?.profile,
        isLoading: false,
        success: true
      };
    case PROFILE.UPDATE_DETAILS_FAIL:
      return {
        ...state,
        success: false,
        isLoading: false,
        errorMessage: action.payload?.errorMessage
      };
    case PROFILE.UPLOAD_MEDIA_ASYNC:
      return {
        ...state,
        isLoading: true
      };
    case PROFILE.UPLOAD_MEDIA_SUCCESS:
      return {
        ...state,
        mediaUrl: action.payload?.Url,
        isLoading: false,
        success: true
      };
    case PROFILE.UPLOAD_MEDIA_FAIL:
      return {
        ...state,
        success: false,
        isLoading: false,
        errorMessage: action.payload?.errorMessage
      };
    case PROFILE.SET_SUCCESS_FALSE:
      return {
        ...state,
        success: false
      };
    default:
      return state;
  }
};

export default profileReducer;