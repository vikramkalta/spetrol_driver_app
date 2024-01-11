import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';

import { IButton, ITextInput, ILoader } from '../../components';
import layoutStyles from '../../styles/layout';
import { ACTIONS, BACK_BUTTON_SIZE, COMMON_TEXT_COLOR, PHONE_LENGTH, SCREENS, SPETROL_RED } from '../../utils/constants';

const TITLE = 'What is your phone number?';
const TERMS = 'By proceeding, I agree to Spetrol\'s|Terms of use|and acknowledge that I have read the|Privacy Policy';

const Phone = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [textInputBorderColor, setTextInputBorderColor] = useState(COMMON_TEXT_COLOR);
  const { authReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  const onBack = () => {
    navigation.popToTop();
  };

  const sendOtpHandler = () => {
    dispatch({ type: ACTIONS.AUTH.SEND_OTP_ASYNC, phone });
    navigation.navigate(SCREENS.OTP);
  };

  const onFocus = () => setTextInputBorderColor(SPETROL_RED);
  const onBlur = () => setTextInputBorderColor(COMMON_TEXT_COLOR);

  return (
    <View style={layoutStyles.defaultContainer}>
      <View style={{ width: '100%', justifyContent: 'flex-start' }}>
        <Icon.Button
          backgroundColor='transparent'
          name='arrowleft'
          size={BACK_BUTTON_SIZE}
          color={layoutStyles.defaultTextColor.color}
          onPress={onBack}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[layoutStyles.defaultTextColor, {
          fontWeight: 'bold',
          fontSize: 18
        }]}>
          {TITLE}
        </Text>
      </View>

      <View style={{ flex: 6, width: '100%' }}>
        <ITextInput
          style={[layoutStyles.defaultTextInput, { alignSelf: 'stretch', padding: 10, borderColor: textInputBorderColor }]}
          maxLength={PHONE_LENGTH}
          textChangeHandler={setPhone}
          value={phone}
          placeholder={'Phone'}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>

      <View style={{ flex: 1, }}>
        <Text>
          <Text style={{ color: COMMON_TEXT_COLOR, fontSize: 12 }}>{TERMS.split('|')[0]}</Text>
          <Text style={{ color: SPETROL_RED, fontSize: 12 }}>{` ${TERMS.split('|')[1]}`}</Text>
          <Text style={{ color: COMMON_TEXT_COLOR, fontSize: 12 }}>{` ${TERMS.split('|')[2]}`}</Text>
          <Text style={{ color: SPETROL_RED, fontSize: 12 }}>{` ${TERMS.split('|')[3]}`}</Text>
        </Text>
      </View>

      <View style={{ flex: 1, marginTop: '2%', width: '100%' }}>
        {
          authReducer.isLoading ?
            (<ILoader size='large' />)
            : (
              <IButton
                style={[
                  { ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED },
                  { alignSelf: 'stretch', backgroundColor: SPETROL_RED }
                ]}
                title={'Next'}
                disabled={phone.length !== PHONE_LENGTH}
                onPressHandler={sendOtpHandler}
              />
            )
        }
      </View>

    </View>
  );
};

export default Phone;
