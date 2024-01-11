import { APP_CONFIG } from '../config';
import APIKit from './api';

export default class FuellingUnitService {
  static async getFuellingUnits() {
    try {
      const url = `${APP_CONFIG.BASE_URL}fuelling-vehicle/all`;
      const { data } = await APIKit.get(url);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }
}