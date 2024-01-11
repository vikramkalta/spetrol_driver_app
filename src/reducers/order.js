import { ACTIONS } from '../utils/constants';

const ORDER = ACTIONS.ORDER;

const initialState = {
  isLoading: false,
  success: false,
  errorMessage: '',
  orders: [],
  orderMetadata: [],
  acceptRejectLoading: false,
  ongoingOrder: null,
  ongoingOrders: [],
  pastOrders: [],
  offlineOrder: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER.FETCH_ORDERS_ASYNC:
      return {
        ...state,
        isLoading: true,
      };
    case ORDER.FETCH_ORDERS_SUCCESS: {
      const orders = action.payload?.[0]?.data;
      if (!orders) {
        return state;
      }
      return {
        ...state,
        isLoading: false,
        ...(action.orderType === 'Scheduled' ? {
          scheduledOrders: orders,
        } : {
          pastOrders: orders,
        })
      };
    }
    case ORDER.FETCH_ORDERS_FAIL:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload?.errorMessage,
      };
    case ORDER.FETCH_ORDERS_QUEUE_ASYNC:
      return {
        ...state,
        isLoading: true,
      };
    case ORDER.FETCH_ORDERS_QUEUE_SUCCESS: {
      let ongoingOrder = null;
      if (!action.payload?.length) {
        ongoingOrder = null;
      } else if (state.ongoingOrder && Object.keys(state.ongoingOrder).length) {
        ongoingOrder = state.ongoingOrder;
      } else {
        ongoingOrder = action.payload[0];
      }
      const copyOrder = [...action.payload].filter(order => order._id !== ongoingOrder._id);
      const upcomingOrders = [];
      for (let i = 0; i < copyOrder.length; i++) {
        upcomingOrders.push(copyOrder[i]);
      }
      return {
        ...state,
        isLoading: false,
        orders: action.payload,
        ongoingOrder,
        upcomingOrders,
      };
    }
    case ORDER.FETCH_ORDERS_QUEUE_FAIL:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload?.errorMessage,
      };
    case ORDER.ACCEPT_REJECT_ASYNC:
      return {
        ...state,
        acceptRejectLoading: true,
      };
    case ORDER.ACCEPT_REJECT_SUCCESS: {
      let ongoingOrder = null;
      for (let i = 0; i < state.orders.length; i++) {
        if (state.orders[i]._id === action.payload._id) {
          state.orders[i].OrderStatus = action.payload?.OrderStatus;
          ongoingOrder = state.orders[i];
          break;
        }
      }
      return {
        ...state,
        acceptRejectLoading: false,
        ongoingOrder
      };
    }
    case ORDER.ACCEPT_REJECT_FAIL:
      return {
        ...state,
        acceptRejectLoading: false,
        errorMessage: action.payload?.errorMessage
      };
    case ORDER.SET_ONGOING_ORDER_TO_NULL:
      return {
        ...state,
        ongoingOrder: null,
      };
    case ORDER.CREATE_OFFLINE_ORDER_ASYNC:
      return {
        ...state,
        isLoading: true,
      };
    case ORDER.CREATE_OFFLINE_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        offlineOrder: action.payload,
      };
    case ORDER.CREATE_OFFLINE_ORDER_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case ORDER.ADJUST_ORDER_ASYNC:
      return {
        ...state,
        isLoading: true,
      };
    case ORDER.ADJUST_ORDER_SUCCESS:
      return {
        ...state,
        ongoingOrder: {
          ...state.ongoingOrder,
          FuelAmount: action.payload.FuelAmount,
        },
        isLoading: false,
      };
    case ORDER.ADJUST_ORDER_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case ORDER.SET_ONGOING_ORDER:
      const ongoingOrder = action.payload;
      const copyOrder = [...state.orders].filter(order => order._id !== action.payload._id);
      const upcomingOrders = [];
      for (let i = 0; i < copyOrder.length; i++) {
        upcomingOrders.push(copyOrder[i]);
      }
      return {
        ...state,
        isLoading: false,
        ongoingOrder,
        upcomingOrders,
      };
    default:
      return state;
  }
};

export default orderReducer;