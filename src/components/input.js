import React from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import { COMMON_TEXT_COLOR } from '../utils/constants';

const ITextInput = ({
  style, maxLength, textChangeHandler, value,
  placeholder, keyboardDefault, onBlur, onFocus, defaultValue
}) => {
  return (
    <SafeAreaView>
      <TextInput
        style={style}
        onChangeText={textChangeHandler}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardDefault ? 'default' : 'numeric'}
        maxLength={maxLength}
        onBlur={onBlur ? onBlur : null}
        onFocus={onFocus ? onFocus : null}
        placeholderTextColor={COMMON_TEXT_COLOR}
        defaultValue={defaultValue}
      />
    </SafeAreaView>
  );
};

export default ITextInput;