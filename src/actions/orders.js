import { ACTIONS } from '../utils/constants';

export function setOngoingOrderToNull() {
  return {
    type: ACTIONS.ORDER.SET_ONGOING_ORDER_TO_NULL,
  };
}