import React from 'react';
import { View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import layoutStyles from '../styles/layout';
import { COMMON_TEXT_COLOR } from '../utils/constants';

const IDocumentNavigator = ({ title, subTitle, onPressHandler, type }) => {
  return (
    <View style={{
      height: 50,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      borderColor: 'transparent',
      borderBottomWidth: 1,
      position: 'relative',
      borderRadius: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      padding: 10,
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    }}>
      <View>
        <Text style={{ fontSize: 16, color: COMMON_TEXT_COLOR, fontWeight: '500' }}>{title}</Text>
        <Text style={{ fontSize: 10, color: COMMON_TEXT_COLOR }}>{subTitle}</Text>
      </View>

      <View style={{}}>
        <Icon.Button
          backgroundColor='transparent'
          name='chevron-right'
          size={15}
          color={layoutStyles.defaultTextColor.color}
          onPress={() => onPressHandler(type)}
        />
      </View>
    </View>
  );
};

export default IDocumentNavigator;