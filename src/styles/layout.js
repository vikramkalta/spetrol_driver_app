import { StyleSheet } from 'react-native';

const DEFAULT_TEXT_COLOR = '#3A3A3A';

export default StyleSheet.create({
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  defaultTextColor: {
    color: DEFAULT_TEXT_COLOR
  },
  defaultTextInput: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 4,
    color: DEFAULT_TEXT_COLOR,
    fontSize: 20
  },
  defaultButton: {
    backgroundColor: '#0077FF',
    height: 70,
    borderRadius: 4
  },
  cancelButton: {
    backgroundColor: 'orange',
    height: 70,
    borderRadius: 4
  },
  leftHeavyContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E5E5E5',
  },
  break: {
    height: 20
  },
  goOnlineButton: {
    backgroundColor: '#0077FF',
    height: 100,
    width: 100,
    borderRadius: 50,
  }
});