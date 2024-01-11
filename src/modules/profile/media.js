import React, { useState } from 'react';
import { View, Text, Image, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { IButton, ILoader } from '../../components';
import layoutStyles from '../../styles/layout';
import { ACTIONS, BACK_BUTTON_SIZE, COMMON_ERROR_MESSAGE, COMMON_TEXT_COLOR, DOCUMENT_NAMES, MIN_PROFILE_DETAILS_TEXT_LENGTH, SCREENS, SPETROL_RED } from '../../utils/constants';
import { errorHandler } from '../../utils/helper-functions';

const AGREEMENT_TEXT = 'By tapping Save, you agree that Spetrol or a trusted vendor may collect and process your photos with technology that allows us to verify your identity';

const Media = ({ route, navigation }) => {
  const { type, imageUrl } = route.params;
  const [fileUri, setFileUri] = useState(imageUrl);
  const [assetData, setAssetData] = useState(null);

  const { authReducer, profileReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  const onUploadMedia = () => {
    dispatch({
      type: ACTIONS.PROFILE.UPLOAD_MEDIA_ASYNC, payload: {
        url: fileUri,
        UserId: authReducer.user?._id,
        type,
        assetData,
      }
    });
  };

  const imageGalleryLaunch = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
        errorHandler(COMMON_ERROR_MESSAGE);
      } else {
        const { assets } = res;
        const asset = assets[0];
        if (asset) {
          setFileUri(asset.uri);
          setAssetData(asset);
        } else {
          errorHandler('No asset found');
        }
      }
    });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        cameraLaunch();
      } else {
        await requestCameraPermission();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  // Launch camera
  const cameraLaunch = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    };

    launchCamera(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
        errorHandler(COMMON_ERROR_MESSAGE);
      } else {
        const { assets } = res;
        const asset = assets[0];
        if (asset) {
          setFileUri(asset.uri);
          setAssetData(asset);
        } else {
          errorHandler(null, 'No asset found');
        }
      }
    });
  };

  const retakeHandler = () => {
    setFileUri(null);
    setAssetData(null);
  };

  const getImageType = () => {
    let _type = '';
    switch (type) {
      case DOCUMENT_NAMES.Pic:
        _type = 'profile photo';
        break;
      case DOCUMENT_NAMES.Aadhaar:
        _type = 'photo of your Aadhaar card - Front';
        break;
      case DOCUMENT_NAMES.License:
        _type = 'photo of your Driving License - Front';
        break;
      default:
        break;
    }
    return _type;
  };

  const getImageInstructions = () => {
    let _type = '';
    switch (type) {
      case DOCUMENT_NAMES.Pic:
        _type = 'For purpose here and guidelines here.';
        break;
      case DOCUMENT_NAMES.Aadhaar:
        _type = 'For purpose here and guidelines here.';
        break;
      case DOCUMENT_NAMES.License:
        _type = `Make sure License number, Driving License Type, your Address, Father\'s Name, D.O.B, expiration Date and Govt logo on the License are clearly visible and the photo is not blurred.`;
        break;
      default:
        break;
    }
    return _type;
  };

  const getImageContainerStyle = () => {
    let style = {};
    switch (type) {
      case DOCUMENT_NAMES.Pic:
        style = {
          width: 250,
          height: 250,
          borderRadius: 125,
          borderColor: 'grey',
          borderWidth: 1,
          shadowColor: '#000',
          overflow: 'hidden'
        };
        break;
      case DOCUMENT_NAMES.Aadhaar:
      case DOCUMENT_NAMES.License:
        style = {
          width: '100%',
          height: 250,
          borderRadius: 5,
          borderColor: 'grey',
          borderWidth: 1,
          shadowColor: '#000',
          overflow: 'hidden'
        };
        break;
      default:
        break;
    }
    return style;
  };

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      padding: 10
    }}>
      <View style={{ width: '100%', justifyContent: 'flex-start' }}>
        <Icon.Button
          backgroundColor='transparent'
          name='arrowleft'
          size={BACK_BUTTON_SIZE}
          color={layoutStyles.defaultTextColor.color}
          onPress={() => navigation.pop()}
        />
      </View>

      <View style={getImageContainerStyle()}>
        <Image
          resizeMode={'cover'}
          source={{ uri: fileUri || imageUrl }}
          style={{ width: '100%', height: '100%', alignSelf: 'center', }}
        />
      </View>

      {
        fileUri ? (
          <>
            <View style={{ flex: 1, padding: 10, width: '100%', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: COMMON_TEXT_COLOR, fontWeight: 'bold' }}>{'Want to use this photo?'}</Text>
              <Text style={{ marginTop: '2%', color: COMMON_TEXT_COLOR }}>{AGREEMENT_TEXT}</Text>
            </View>

            <View style={{ position: 'absolute', bottom: '4%', flexDirection: 'row', width: '100%', marginTop: 10, justifyContent: 'space-evenly' }}>
              <IButton
                style={[{ ...layoutStyles.defaultButton, backgroundColor: '#555' }, { width: '45%' }]}
                title={'Retake'}
                onPressHandler={retakeHandler}
              />
              {
                profileReducer.isLoading ?
                  (<ILoader size='large' />)
                  : (
                    <IButton
                      style={[{ ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED }, { width: '45%' }]}
                      title={'Save'}
                      // disabled={disabled}
                      onPressHandler={onUploadMedia}
                    />
                  )
              }
            </View>
          </>
        ) : (
            <>
              <View style={{ flex: 1, padding: 10, width: '100%' }}>
                <Text style={{ fontSize: 16, color: COMMON_TEXT_COLOR, fontWeight: 'bold' }}>{`Take a ${getImageType()}`}</Text>
                <Text style={{ marginTop: '2%', color: COMMON_TEXT_COLOR }}>{getImageInstructions()}</Text>
              </View>

              <View style={{ position: 'absolute', bottom: '4%', flexDirection: 'row', width: '100%', marginTop: 10, justifyContent: 'space-evenly' }}>
                <IButton
                  style={[{ ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED }, { width: '45%' }]}
                  title={'Take photo'}
                  onPressHandler={requestCameraPermission}
                />
                <IButton
                  style={[{ ...layoutStyles.defaultButton, backgroundColor: SPETROL_RED }, { width: '45%' }]}
                  title={'Take from gallery'}
                  onPressHandler={imageGalleryLaunch}
                />
              </View>
            </>
          )
      }

    </View>


  );
};

export default Media;