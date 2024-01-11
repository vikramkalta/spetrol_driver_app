import React, { useState } from 'react';
import { Modal } from 'react-native';

const IModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible || props.modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)} >
      {props.children}
    </Modal>
  );
};

export default IModal;