import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import RNOtpVerify from 'react-native-otp-verify';

import { IButton, ITextInput, ILoader } from '../../components';
import layoutStyles from '../../styles/layout';
import { ACTIONS, BACK_BUTTON_SIZE, COMMON_ERROR_MESSAGE, COMMON_TEXT_COLOR, OTP_LENGTH, SPETROL_RED } from '../../utils/constants';
import { setAuthReducerSuccessFalse } from '../../actions/auth';
// import { errorHandler } from '../../utils/helper-functions';

const TITLE = 'Enter the OTP sent to your phone number.';
const RESEND_OTP_TEXT = 'Didn\'t receive code?|Resend';

const RESEND_OTP_TIME = 30;
const RESEND_OTP_TIME_MS = RESEND_OTP_TIME * 1000;

const Otp = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [showResendOtp, setShowResendOtp] = useState(false);
  const [resendOtpCountdown, setResendOtpCountdown] = useState(RESEND_OTP_TIME);
  const [textInputBorderColor, setTextInputBorderColor] = useState(COMMON_TEXT_COLOR);
  const { authReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResendOtp(true);
    }, RESEND_OTP_TIME_MS);

    let countdownTimer;
    if (!showResendOtp) {
      let x = 0;
      countdownTimer = setInterval(() => {
        x++;
        let countdown = RESEND_OTP_TIME - x;
        setResendOtpCountdown(countdown);
        if (countdown === 0) {
          clearInterval(countdownTimer);
        }
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [showResendOtp]);

  const verifyOtpHandler = () => {
    dispatch({ type: ACTIONS.AUTH.VERIFY_OTP_ASYNC, otp, phone: authReducer.phone });
  };

  const onBack = () => {
    dispatch(setAuthReducerSuccessFalse());
    navigation.pop();
  };

  const resendOtp = () => {
    dispatch({ type: ACTIONS.AUTH.SEND_OTP_ASYNC, phone: authReducer.phone });
    setShowResendOtp(false);
    setResendOtpCountdown(RESEND_OTP_TIME);
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
          maxLength={OTP_LENGTH}
          textChangeHandler={setOtp}
          value={otp}
          placeholder={'OTP'}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>

      <View style={{ flex: 1 }}>
        {
          showResendOtp ?
            (
              <Text>
                <Text style={{ fontSize: 12, color: COMMON_TEXT_COLOR }}>{RESEND_OTP_TEXT.split('|')[0]}</Text>
                <Text onPress={resendOtp} style={{ fontSize: 12, color: SPETROL_RED }}>{` ${RESEND_OTP_TEXT.split('|')[1]}`}</Text>
              </Text>
            ) : (
              <Text style={{ fontSize: 12, color: COMMON_TEXT_COLOR }}>{`Resend OTP in ${resendOtpCountdown} seconds`}</Text>
            )
        }
      </View>

      <View style={{ flex: 2, width: '100%' }}>
        {
          authReducer.isLoading ?
            (<ILoader size='large' />)
            : (
              <IButton
                style={[
                  { ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED },
                  { alignSelf: 'stretch', backgroundColor: SPETROL_RED }
                ]}
                title={'Verify'}
                disabled={otp.length !== OTP_LENGTH}
                onPressHandler={verifyOtpHandler}
              />
            )
        }
      </View>

    </View>
  );
};

export default Otp;