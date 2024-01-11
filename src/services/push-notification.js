import { APP_CONFIG } from '../config';
import APIKit from './api';

export default class PushNotificationService {
  static async register(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}push-notification/register`;
      const { data } = await APIKit.post(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }
}