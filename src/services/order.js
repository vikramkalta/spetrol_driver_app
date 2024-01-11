import { APP_CONFIG } from '../config';
import APIKit from './api';

export default class OrderService {
  static async getOrders(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}order/all?Page=${reqObj.Page}&PageSize=${reqObj.PageSize}&Type=${reqObj.Type}`;
      const { data } = await APIKit.get(url);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async orderFulfillment(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}order/fulfillment`;
      const { data } = await APIKit.put(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createOfflineOrder(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}order/offline`;
      const { data } = await APIKit.post(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async adjustOrder(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}order/adjust?OrderId=${reqObj.OrderId}`;
      const { data } = await APIKit.put(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }
}