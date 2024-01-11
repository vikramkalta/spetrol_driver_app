import { Alert } from 'react-native';

const IAlert = (title, message, options) => {
  Alert.alert(title, message, options);
};

export default IAlert;