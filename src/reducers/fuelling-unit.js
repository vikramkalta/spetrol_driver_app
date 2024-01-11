import { ACTIONS } from '../utils/constants';

const FUELLING_UNIT = ACTIONS.FUELLING_UNIT;

const initialState = {
  isLoading: false,
  success: false,
  errorMessage: '',
  fuellingUnits: [],
};

const fuellingUnitReducer = (state = initialState, action) => {
  switch (action.type) {
    case FUELLING_UNIT.FETCH_FUELLING_UNIT_ASYNC:
      return {
        ...state,
        isLoading: true,
      };
    case FUELLING_UNIT.FETCH_FUELLING_UNIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fuellingUnits: action.payload,
      };
    case FUELLING_UNIT.FETCH_FUELLING_UNIT_FAIL:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload?.errorMessage,
      };
    case FUELLING_UNIT.SWITCH_UNIT_ASYNC:
      return {
        ...state,
        isLoading: true,
      };
    case FUELLING_UNIT.SWITCH_UNIT_SUCCESS:
    case FUELLING_UNIT.SWITCH_UNIT_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default fuellingUnitReducer;