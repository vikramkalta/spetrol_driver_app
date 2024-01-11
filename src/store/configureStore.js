import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from '../sagas/root';
import authReducer from '../reducers/auth';
import profileReducer from '../reducers/profile';
import homeReducer from '../reducers/home';
import orderReducer from '../reducers/order';
import fuellingUnitReducer from '../reducers/fuelling-unit';
import { ACTIONS } from '../utils/constants';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  authReducer: authReducer,
  profileReducer: profileReducer,
  homeReducer: homeReducer,
  orderReducer: orderReducer,
  fuellingUnitReducer: fuellingUnitReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === ACTIONS.AUTH.LOG_OUT) {
    return appReducer(undefined, { type: undefined });
  }
  return appReducer(state, action);
};

const configureStore = () => {
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  // Run the saga
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;