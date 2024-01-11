import Config from 'react-native-config';

export const APP_CONFIG = {
  // BASE_URL: 'http://192.168.1.201:3001/api/',
  // AUTH_BASE_URL: 'http://192.168.1.201:3002/auth/',
  // SOCKET_URL: 'http://192.168.1.201:3001/'
  BASE_URL: Config.BASE_URL,
  AUTH_BASE_URL: Config.AUTH_BASE_URL,
  SOCKET_URL: Config.SOCKET_URL,
  REPOS_DEVICE_ID: Config.REPOS_DEVICE_ID,
  REPOS_PARTNER_ID: Config.REPOS_PARTNER_ID,
};