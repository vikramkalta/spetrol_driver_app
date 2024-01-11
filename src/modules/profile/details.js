import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ITextInput, IButton, ILoader } from '../../components';
import layoutStyles from '../../styles/layout';
import { ACTIONS, COMMON_TEXT_COLOR, MIN_PROFILE_DETAILS_TEXT_LENGTH, SCREENS, SPETROL_RED } from '../../utils/constants';

const TITLE = 'How would you like to be called?';

const Details = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [textInputFirstBorderColor, setTextInputFirstBorderColor] = useState(COMMON_TEXT_COLOR);
  const [textInputLastBorderColor, setTextInputLastBorderColor] = useState(COMMON_TEXT_COLOR);
  const { authReducer, profileReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  const updateDriverDetails = () => {
    dispatch({
      type: ACTIONS.PROFILE.UPDATE_DETAILS_ASYNC,
      payload: {
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        UserId: authReducer.user?._id
      }
    });
  };

  useEffect(() => {
    if (profileReducer.success) {
      navigation.navigate(SCREENS.DOCUMENT);
    }
  });

  const onFocusFirst = () => setTextInputFirstBorderColor(SPETROL_RED);
  const onBlurFirst = () => setTextInputFirstBorderColor(COMMON_TEXT_COLOR);
  const onFocusLast = () => setTextInputLastBorderColor(SPETROL_RED);
  const onBlurLast = () => setTextInputLastBorderColor(COMMON_TEXT_COLOR);

  return (
    <View style={[layoutStyles.defaultContainer]}>
      <View style={{ flex: 1 }}>
        <Text style={[layoutStyles.defaultTextColor, { fontWeight: 'bold', fontSize: 20 }]}>
          {TITLE}
        </Text>
      </View>

      <View style={{ flex: 6, width: '100%' }}>
        <View style={{ height: 150 }}>
          <View style={{ flex: 1, padding: 2 }}>
            <ITextInput
              style={[layoutStyles.defaultTextInput, { alignSelf: 'stretch', padding: 10, borderColor: textInputFirstBorderColor }]}
              maxLength={20}
              textChangeHandler={setFirstName}
              value={firstName}
              keyboardDefault={true}
              placeholder={'First name'}
              onFocus={onFocusFirst}
              onBlur={onBlurFirst} />
          </View>
          <View style={{ flex: 1, padding: 2 }}>
            <ITextInput
              style={[layoutStyles.defaultTextInput, { alignSelf: 'stretch', padding: 10, borderColor: textInputLastBorderColor }]}
              maxLength={20}
              textChangeHandler={setLastName}
              value={lastName}
              keyboardDefault={true}
              placeholder={'Last name'}
              onFocus={onFocusLast}
              onBlur={onBlurLast} />
          </View>
        </View>

      </View>

      <View style={{ flex: 2, width: '100%' }}>
        {
          profileReducer.isLoading ?
            (<ILoader size='large' />)
            : (
              <IButton
                style={[
                  { ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED },
                  { alignSelf: 'stretch' }
                ]}
                title={'Next'}
                disabled={firstName.length < MIN_PROFILE_DETAILS_TEXT_LENGTH
                  || lastName.length < MIN_PROFILE_DETAILS_TEXT_LENGTH}
                onPressHandler={updateDriverDetails}
              />
            )
        }
      </View>
    </View>
  );
};

export default Details;