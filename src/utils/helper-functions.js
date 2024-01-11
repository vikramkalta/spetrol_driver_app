import { IAlert } from '../components';
import { COMMON_ERROR_MESSAGE } from './constants';

export const errorHandler = (message, customMsg) => {
  IAlert('Failure', customMsg || COMMON_ERROR_MESSAGE);
};

export const formatDate = date => {
  date = date.toString();
  if (date.length === 1) {
    date = `0${date}`;
  }
  const _date = parseInt(date.charAt(1));
  if (['11', '12', '13'].includes(date)) {
    date = `${date}th`;
  } else if (_date === 1) {
    date = `${date}st`;
  } else if (_date === 2) {
    date = `${date}nd`;
  } else if (_date === 3) {
    date = `${date}rd`;
  } else {
    date = `${date}th`;
  }
  return date;
};

export const formatHour = (hour, min) => {
  let amPm = 'AM';
  if (hour > 11) {
    amPm = 'PM';
  }
  if (hour > 12) {
    hour = hour % 12;
  }
  hour = hour.toString();
  if (hour.length === 1) {
    hour = `0${hour}`;
  }
  return `${hour}:${min} ${amPm}`;
};