import { APP_CONFIG } from '../config';
import APIKit from './api';

export default class AuthService {
  static async sendOtp(number, test) {
    try {
      let url = `${APP_CONFIG.AUTH_BASE_URL}otp/send?Mobile=${number}`;
      if (test) {
        url += `&Bypass=true`;
      }
      const { data } = await APIKit.get(url);
      if (!data?.success) {
        throw data.data;
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOtp(payload) {
    try {
      const url = `${APP_CONFIG.AUTH_BASE_URL}otp/verify`;
      const reqObj = {
        Mobile: payload.phone,
        OTP: payload.otp,
        Role: 'driver'
      };
      const { data } = await APIKit.post(url, reqObj);
      if (!data?.success) {
        throw { message: 'OTP Invalid.' };
      }
      return data.data;
    } catch (error) {
      throw { message: 'OTP Invalid.' };
    }
  }
}