import ApiService from './api';

export default class BaseService {
  static async query(params) {
    try {
      const result = await ApiService.query(this.url, params);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async get(id) {
    try {
      const result = await ApiService.get(this.url, id);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async update(id, params) {
    try {
      const result = await ApiService.update(this.url, id, params);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async post(body) {
    try {
      const result = await ApiService.post(this.url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async delete(id) {
    try {
      const result = await ApiService.delete(this.url, id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}