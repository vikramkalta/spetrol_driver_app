import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { IButton, IDocumentNavigator, ILoader } from '../../components';
import layoutStyles from '../../styles/layout';
import { BACK_BUTTON_SIZE, SCREENS, COMMON_ERROR_MESSAGE, SPETROL_RED, DOCUMENT_NAMES, COMMON_TEXT_COLOR } from '../../utils/constants';
import { errorHandler } from '../../utils/helper-functions';
import { setProfileReducerSuccessFalse } from '../../actions/profile';
import { setDocumentsVerified } from '../../actions/auth';

const TITLE = 'Required Documents';
const INSTRUCTIONS = 'Here\'s what you need to do to set up your account.';

const Document = ({ route, navigation }) => {
  const verified = route?.params?.verified;
  const [confirmed, setConfirmed] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { profileReducer, authReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const _disabled = getVerificationState();
    setDisabled(_disabled);
  });

  const onComplete = () => {
    // navigation.navigate(SCREENS.HOME);
    setConfirmed(true);
  };

  const onBack = () => {
    dispatch(setProfileReducerSuccessFalse());
    navigation.pop();
  };

  const takeHome = () => {
    dispatch(setDocumentsVerified());
  };

  const getVerificationState = () => {
    let disabled = false;
    if (authReducer.user?.Documents?.length === 2 && authReducer.user?.ImageUrl) {
      disabled = false;
    } else {
      disabled = true;
    }
    return disabled;
  };

  const onPressHandler = type => {
    try {
      let imageUrl;
      if (authReducer.user) {
        switch (type) {
          case DOCUMENT_NAMES.License: {
            const _imageUrl = authReducer.user.Documents?.find(doc => doc.Name === DOCUMENT_NAMES.License);
            if (_imageUrl) {
              imageUrl = _imageUrl.ImageUrl;
            }
            break;
          }
          case DOCUMENT_NAMES.Aadhaar: {
            const _imageUrl = authReducer.user.Documents?.find(doc => doc.Name === DOCUMENT_NAMES.Aadhaar);
            if (_imageUrl) {
              imageUrl = _imageUrl.ImageUrl;
            }
            break;
          }
          case DOCUMENT_NAMES.Pic:
            imageUrl = authReducer.user.ImageUrl;
            break;
          default:
            break;
        }
      }
      navigation.navigate(SCREENS.MEDIA, { type, imageUrl });
    } catch (error) {
      errorHandler(COMMON_ERROR_MESSAGE);
    }
  };

  const CompletedCard = ({ title, completed }) => {
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
        <Text style={{ color: COMMON_TEXT_COLOR, fontSize: 16, fontWeight: '300' }}>{title}</Text>

        <MaterialIcon
          style={{ marginRight: '4%' }}
          backgroundColor='transparent'
          name={completed ? 'check' : 'pending'}
          size={15}
          color={layoutStyles.defaultTextColor.color}
        />
      </View>
    );
  };

  const renderSummary = () => {
    let aadhaarCompleted, licenseCompleted = false;
    for (let i = 0; i < authReducer.user?.Documents?.length; i++) {
      const doc = authReducer.user?.Documents[i];
      const _type = doc.Name;
      switch (_type) {
        case DOCUMENT_NAMES.License:
          licenseCompleted = !!doc.ImageUrl;
          break;
        case DOCUMENT_NAMES.Aadhaar:
          aadhaarCompleted = !!doc.ImageUrl;
          break;
        default:
          break;
      }
    }
    let picCompleted = !!authReducer?.user?.ImageUrl;

    return (
      <>
        <CompletedCard title={'Legal Agreements'} completed={true} />
        <CompletedCard title={'Profile photo'} completed={picCompleted} />
        <CompletedCard title={'Driving License'} completed={licenseCompleted} />
        <CompletedCard title={'Aadhaar Card'} completed={aadhaarCompleted} />
      </>
    );
  };

  return (
    <View style={layoutStyles.leftHeavyContainer}>
      <View style={{
        flex: 1.5,
        backgroundColor: 'white',
        borderColor: 'transparent',
        borderBottomWidth: 1,
        position: 'relative',
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        padding: 10,
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 8,
      }}>
        {
          !verified ?
            (
              <TouchableOpacity style={{ width: '10%', height: 25, alignItems: 'center' }}>
                <MaterialIcon
                  backgroundColor='transparent'
                  style={{ marginLeft: -15 }}
                  name='chevron-left'
                  size={BACK_BUTTON_SIZE}
                  color={layoutStyles.defaultTextColor.color}
                  onPress={onBack}
                />
              </TouchableOpacity>
            ) : null
        }
        <View style={{ flex: 1, }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: COMMON_TEXT_COLOR
            }}>
              {TITLE}
            </Text>
            <View style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 25,
              backgroundColor: COMMON_TEXT_COLOR,
              borderRadius: 15,
            }}>
              <Text style={{ color: '#fff' }}>{'Help'}</Text>
            </View>
          </View>

          <Text style={{
            fontSize: 16,
            color: COMMON_TEXT_COLOR,
            marginTop: '5%'
          }}>
            {INSTRUCTIONS}
          </Text>
        </View>
      </View>

      <View style={{ flex: 3, width: '100%', paddingTop: 10, }}>
        <IDocumentNavigator
          title={'Profile Photo'}
          subTitle={'For purpose here'}
          type={DOCUMENT_NAMES.Pic}
          onPressHandler={onPressHandler}
        />

        <IDocumentNavigator
          title={'Driving License - Front'}
          subTitle={'For purpose here'}
          type={DOCUMENT_NAMES.License}
          onPressHandler={onPressHandler}
        />

        <IDocumentNavigator
          title={'Aadhaar Card'}
          subTitle={'For purpose here'}
          type={DOCUMENT_NAMES.Aadhaar}
          onPressHandler={onPressHandler}
        />
      </View>

      <Text style={{ marginBottom: '2%', marginLeft: '2%', color: COMMON_TEXT_COLOR, fontWeight: 'bold' }}>{'SUMMARY'}</Text>

      <View style={{ flex: 3, width: '100%' }}>
        {renderSummary()}
      </View>


      <View style={{ flex: 1, width: '100%', }}>
        {
          !verified ?
            (
              profileReducer.isLoading ?
                (<ILoader size='large' />)
                : (
                  <IButton
                    style={[{ ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED }, { alignSelf: 'stretch' }]}
                    title={!confirmed ? 'Finish' : 'We are verifying your documents'}
                    // disabled={getVerificationState()}
                    disabled={disabled}
                    onPressHandler={onComplete}
                  />
                )
            ) : null
        }
        {
          !verified ? (
            <IButton
              title={'Take me to home screen'}
              onPressHandler={takeHome}
            />
          ) : null
        }
      </View>

    </View>
  );
};

export default Document;