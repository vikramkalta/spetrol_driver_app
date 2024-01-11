import { APP_CONFIG } from '../config';
import { errorHandler } from '../utils/helper-functions';
import APIKit from './api';

export default class DriverService {
  static async updateDriver(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}driver?UserId=${reqObj.UserId}`;
      const { data } = await APIKit.put(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getDriver() {
    try {
      const url = `${APP_CONFIG.BASE_URL}driver?UserId=1`; // Mocking UserId as it will block call if not sent
      const { data } = await APIKit.get(url);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async switchUnit(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}driver/switch-unit`;
      const { data } = await APIKit.put(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async uploadMedia(reqObj) {
    try {
      let url = `${APP_CONFIG.BASE_URL}media?moduleId=${reqObj.UserId}&moduleName=Driver`;
      if (reqObj.type !== 'Pic') {
        url = `${APP_CONFIG.BASE_URL}driver/document?UserId=${reqObj.UserId}&Type=${reqObj.type}`;
      }

      const formData = new FormData();
      const { assetData } = reqObj;
      formData.append('image', {
        uri: reqObj.url,
        name: assetData.fileName,
        filename: assetData.fileName,
        type: assetData.type,
      });
      const { data } = await APIKit.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      errorHandler(null, JSON.stringify(error));
      throw error;
    }
  }

  static async updateFuellingVehicle(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}fuelling-vehicle?VehicleId=${reqObj.VehicleId}`;
      const { data } = await APIKit.put(url, { Serviceable: reqObj.Serviceable });
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getOrders(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}driver/orders?UserId=${reqObj.UserId}&FuellingVehicleId=${reqObj.FuellingVehicleId}`;
      const { data } = await APIKit.get(url);
      if (!data.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async onOrderFinished(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}fuelling-vehicle/order/finished?VehicleId=${reqObj.VehicleId}`;
      const { data } = await APIKit.post(url, reqObj);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getSelfConsumptionLogs(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}fuelling-vehicle/self-consumption/logs?FuellingVehicleId=${reqObj.FuellingVehicleId}&Page=${reqObj.Page}&PageSize=${reqObj.PageSize}`;
      const { data } = await APIKit.get(url);
      if (!data.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async createSelfConsumptionLogs(reqObj) {
    try {
      const url = `${APP_CONFIG.BASE_URL}fuelling-vehicle/self-consumption/logs?FuellingVehicleId=${reqObj.FuellingVehicleId}`;
      const { data } = await APIKit.put(url, reqObj);
      if (!data.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }
}