import React from 'react';
import { SafeAreaView, Button, View } from 'react-native';

const IButton = ({ style, disabled, title, onPressHandler }) => {
  return (
    <View style={[style?.[1]]}>
      <Button
        color={style?.[0]?.backgroundColor}
        disabled={disabled}
        title={title}
        onPress={onPressHandler}
      />
    </View>
  );
};

export default IButton;