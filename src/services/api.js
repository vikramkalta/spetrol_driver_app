import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { APP_CONFIG } from '../config';
import { AUTH_TOKEN_KEY } from '../utils/constants';

let APIKit = axios.create({
  baseURL: APP_CONFIG.BASE_URL,
  timeout: 10000
});

APIKit.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.app = 'driver';
  return config;
});

// export const setClientToken = token => {
//   console.log('set token called', token);
//   try {
//     APIKit.interceptors.request.use(config => {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log('config.headers.Authorization', config.headers.Authorization);
//       return config;
//     });
//   } catch (error) {
//     errorHandler(error.message);
//   }
// };

export default APIKit;
